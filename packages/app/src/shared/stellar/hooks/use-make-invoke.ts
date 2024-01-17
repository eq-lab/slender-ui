import * as StellarSdk from '@stellar/stellar-sdk';
import { SorobanRpc } from '@stellar/stellar-sdk';

import { useContextSelector } from 'use-context-selector';
import { WalletContext } from '@/shared/contexts/wallet';
import { useCallback } from 'react';
import { server } from '@/shared/stellar/server';
import { scValToJs } from '@/shared/stellar/decoders';
import { Tx, Wallet } from '@bindings/pool';
import { logError } from '@/shared/logger';
import { NETWORK_DETAILS } from '../constants/networks';
import { parseMetaXdrToJs } from './parse-result-xdr';

const FEE = '100';
const PLACEHOLDER_NULL_ACCOUNT = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
const ACCOUNT_SEQUENCE = '0';

async function getAccount(wallet: Wallet): Promise<StellarSdk.Account | null> {
  if (!(await wallet.isConnected()) || !(await wallet.isAllowed())) {
    return null;
  }
  const { publicKey } = await wallet.getUserInfo();
  if (!publicKey) {
    return null;
  }
  return server.getAccount(publicKey);
}

async function signTx(wallet: Wallet, tx: Tx, networkPassphrase: string): Promise<Tx> {
  const signed = await wallet.signTransaction(tx.toXDR(), {
    networkPassphrase,
  });

  return StellarSdk.TransactionBuilder.fromXDR(signed, networkPassphrase) as Tx;
}

type SendTx = SorobanRpc.Api.SendTransactionResponse;
type GetTx = SorobanRpc.Api.GetTransactionResponse;

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
    getTransactionResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
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

  if (getTransactionResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
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
    (contractAddress: string, { secondsToWait = 10 }: { secondsToWait?: number } = {}) => {
      const contract = new StellarSdk.Contract(contractAddress);
      return async <T>(
        methodName: string,
        txParams: StellarSdk.xdr.ScVal[] = [],
      ): Promise<T | undefined> => {
        const wallet = await import('@stellar/freighter-api');

        // getAccount gives an error if stellar account is not activated (does not have 1 XML)
        const walletAccount = await getAccount(wallet).catch(() => null);

        const sourceAccount =
          walletAccount ?? new StellarSdk.Account(userAddress, ACCOUNT_SEQUENCE);

        let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: FEE,
          networkPassphrase: NETWORK_DETAILS.networkPassphrase,
        })
          .addOperation(contract.call(methodName, ...txParams))
          .setTimeout(StellarSdk.TimeoutInfinite)
          .build();
        const simulated = await server.simulateTransaction(tx);

        if (SorobanRpc.Api.isSimulationError(simulated)) {
          throw new Error(simulated.error);
        } else if (!simulated.result) {
          throw new Error(`invalid simulation: no result in ${simulated}`);
        }

        const authsCount = simulated.result.auth.length;
        const writeLength = simulated.transactionData.getReadWrite().length;
        const isViewCall = authsCount === 0 && writeLength === 0;
        if (isViewCall) {
          return scValToJs(simulated.result.retval);
        }

        if (authsCount > 1) {
          throw new Error('Multiple auths not yet supported');
        }

        if (!walletAccount) {
          throw new Error('Not connected to Freighter');
        }

        const operation = SorobanRpc.assembleTransaction(
          tx,
          NETWORK_DETAILS.networkPassphrase,
          // @ts-ignore
          simulated,
        ).build();

        tx = await signTx(wallet, operation, NETWORK_DETAILS.networkPassphrase);

        const raw = await sendTx(tx, secondsToWait);
        // if `sendTx` awaited the inclusion of the tx in the ledger, it used
        // `getTransaction`, which has a `resultXdr` field
        if ('resultXdr' in raw) {
          if (raw.status !== SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
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
