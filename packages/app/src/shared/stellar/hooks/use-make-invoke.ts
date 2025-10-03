import * as StellarSdk from '@stellar/stellar-sdk';
import { rpc as StellarRpc } from '@stellar/stellar-sdk';

import { useContextSelector } from 'use-context-selector';
import { WalletContext } from '@/shared/contexts/wallet';
import { useCallback } from 'react';
import { server } from '@/shared/stellar/server';
import { scValToJs } from '@/shared/stellar/decoders';
import { logError } from '@/shared/logger';
import { Tx } from '@stellar/stellar-sdk/lib/contract';
import * as wallet from '@stellar/freighter-api';
import { NETWORK_DETAILS } from '../constants/networks';
import { parseMetaXdrToJs } from './parse-result-xdr';

const PLACEHOLDER_NULL_ACCOUNT = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
const ACCOUNT_SEQUENCE = '0';

const readPoolFuncNames: Set<string> = new Set([
  'protocol_fee',
  'twap_median_price',
  'user_configuration',
  'account_position',
  'pause_info',
  'token_total_supply',
  'token_balance',
  'price_feeds',
  'pool_configuration',
  'debt_coeff',
  'collat_coeff',
  'get_reserve',
  'version',
]);
const readPoolSTokenNames: Set<string> = new Set([
  'pool',
  'underlying_asset',
  'total_supply',
  'symbol',
  'name',
  'decimals',
  'authorized',
  'spendable_balance',
  'balance',
  'allowance',
  'version',
]);
const readPoolDebtTokenNames: Set<string> = new Set([
  'total_supply',
  'symbol',
  'name',
  'decimals',
  'authorized',
  'spendable_balance',
  'balance',
  'version',
]);

function isReadOnlyFunction(name: string): boolean {
  return readPoolFuncNames.has(name) || readPoolSTokenNames.has(name) || readPoolDebtTokenNames.has(name);
}

async function getAccount(): Promise<StellarSdk.Account | null> {
  const { isConnected, error: isConnectedError } = await wallet.isConnected();
  if (isConnectedError || !isConnected) {
    return null;
  }
  const { isAllowed, error: isAllowedError } = await wallet.isAllowed();
  if (isAllowedError || !isAllowed) {
    return null;
  }

  const { address, error: addressError } = await wallet.getAddress();
  if (addressError || !address) {
    return null;
  }
  return server.getAccount(address);
}

type SendTx = StellarRpc.Api.SendTransactionResponse;
type GetTx = StellarRpc.Api.GetTransactionResponse;

async function sendTx(tx: Tx, secondsToWait: number): Promise<SendTx | GetTx> {
  const sendTransactionResponse = await server.sendTransaction(tx);

  if (sendTransactionResponse.status !== 'PENDING' || secondsToWait === 0) {
    return sendTransactionResponse;
  }

  let getTransactionResponse = await server.getTransaction(sendTransactionResponse.hash);

  const waitUntil = new Date(Date.now() + secondsToWait * 1000).valueOf();

  let waitTime = 1000;
  const exponentialFactor = 1.5;

  while (
    Date.now() < waitUntil &&
    getTransactionResponse.status === StellarRpc.Api.GetTransactionStatus.NOT_FOUND
  ) {
    // Wait a beat
    // eslint-disable-next-line no-await-in-loop,no-loop-func
    await new Promise((resolve) => {
      setTimeout(resolve, waitTime);
    });
    waitTime *= exponentialFactor;
    // See if the transaction is complete
    // eslint-disable-next-line no-await-in-loop
    getTransactionResponse = await server.getTransaction(sendTransactionResponse.hash);
  }

  if (getTransactionResponse.status === StellarRpc.Api.GetTransactionStatus.NOT_FOUND) {
    logError(
      `Waited ${secondsToWait} seconds for transaction to complete, but it did not. Returning anyway. Check the transaction status manually. Info: ${JSON.stringify(
        sendTransactionResponse,
        null,
        2,
      )}`,
    );
  }

  return getTransactionResponse;
}

export function useMakeInvoke() {
  const userAddress =
    useContextSelector(WalletContext, (state) => state.address) || PLACEHOLDER_NULL_ACCOUNT;

  return useCallback(
    (contractAddress: string, { secondsToWait = 25 }: { secondsToWait?: number } = {}) => {
      const contract = new StellarSdk.Contract(contractAddress);
      return async <T>(
        methodName: string,
        txParams: StellarSdk.xdr.ScVal[] = [],
      ): Promise<T | null | undefined> => {
        // getAccount gives an error if stellar account is not activated (does not have 1 XML)
        const walletAccount = await getAccount().catch(() => null);

        if (!walletAccount) {
          throw new Error('Not connected to Freighter');
        }

        const sourceAccount =
          walletAccount ?? new StellarSdk.Account(userAddress, ACCOUNT_SEQUENCE);

        let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: NETWORK_DETAILS.networkPassphrase,
        })
          .addOperation(contract.call(methodName, ...txParams))
          .setTimeout(StellarSdk.TimeoutInfinite)
          .build();
        const simulated = await server.simulateTransaction(tx);
        if (StellarRpc.Api.isSimulationError(simulated)) {
          throw new Error(simulated.error);
        } else if (!simulated.result) {
          throw new Error(`invalid simulation: no result in ${simulated}`);
        }

        const authsCount = simulated.result.auth.length;
        const isViewCall = !simulated.stateChanges?.length;

        if (isViewCall || isReadOnlyFunction(methodName)) {
          return scValToJs(simulated.result.retval);
        }

        if (authsCount > 1) {
          throw new Error('Multiple auths not yet supported');
        }

        const operation = StellarRpc.assembleTransaction(tx, simulated).build();

        const signed = await wallet.signTransaction(operation.toXDR(), {
          networkPassphrase: NETWORK_DETAILS.networkPassphrase,
        });

        tx = StellarSdk.TransactionBuilder.fromXDR(
          signed.signedTxXdr,
          NETWORK_DETAILS.networkPassphrase,
        ) as Tx;

        const raw = await sendTx(tx, secondsToWait);
        // if `sendTx` awaited the inclusion of the tx in the ledger, it used
        // `getTransaction`, which has a `resultXdr` field
        if ('resultXdr' in raw) {
          if (raw.status !== StellarRpc.Api.GetTransactionStatus.SUCCESS) {
            throw new Error('Transaction submission failed! Returning full RPC response.');
          }

          return parseMetaXdrToJs<T>(raw.resultMetaXdr);
        }

        logError("Don't know how to parse result!", raw);
        throw new Error(raw.status);
      };
    },
    [userAddress],
  );
}
