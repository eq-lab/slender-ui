// defined this way so typeahead shows full union, not named alias
let responseTypes: 'simulated' | 'full' | undefined
export type ResponseTypes = typeof responseTypes

export type XDR_BASE64 = string

export interface FreighterApiError extends Error {
  message: string;
}

export interface Wallet {
  isConnected: () => Promise<{ isConnected: boolean }  & { error?: FreighterApiError }>,
  isAllowed: () => Promise<{ isAllowed: boolean }  & { error?: FreighterApiError }>,
  getAddress: () => Promise<{ address: string }  & { error?: FreighterApiError }>,
  signTransaction: (tx: XDR_BASE64, opts?: {
    transactionXdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
    },
  } & {
    error?: FreighterApiError;
  }) => Promise<  {
    signedTxXdr: string;
    signerAddress: string;
  }>,
  signAuthEntry: (
    entryXdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
    },
  ) => Promise<{
    signedAuthEntry: Buffer | null;
    signerAddress: string
  } & {
    error?: FreighterApiError;
  }>
}

export type ClassOptions = {
  contractId: string
  networkPassphrase: string
  rpcUrl: string
  errorTypes?: Record<number, { message: string }>
  /**
   * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
   *
   * @example
   * ```ts
   * import freighter from "@stellar/freighter-api";
   * import { Contract } from "pool";
   * const contract = new Contract({
   *   …,
   *   wallet: freighter,
   * })
   * ```
   */
  wallet?: Wallet
}

export type MethodOptions = {
  /**
   * The fee to pay for the transaction. Default: soroban-sdk's BASE_FEE ('100')
   */
  fee?: number
}
