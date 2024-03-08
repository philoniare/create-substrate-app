import { ref, onMounted, watch, reactive } from 'vue'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp'
import { formatBalance } from '@polkadot/util'
import type { KeypairType } from '@polkadot/util-crypto/types'
import type { HexString } from '@polkadot/util/types'

/**
 * Represents an injected account with metadata.
 */
interface InjectedAccountWithMeta {
  address: string
  meta: {
    genesisHash?: string | null
    name?: string
    source: string
  }
  type?: KeypairType
}

/**
 * Defines the shape of the Substrate context.
 */
export interface SubstrateContextValue {
  api: ApiPromise | null
  connectWallet: () => Promise<void>
  account: InjectedAccountWithMeta | null
  isConnected: boolean
  balance: string
  transfer: (recipientAddress: string | undefined, amount: string) => Promise<HexString | undefined>
}

/**
 * Composable function that provides the Substrate context.
 * @param providerUrl The WebSocket URL of the Substrate node.
 * @param appName The name of the application.
 * @returns The Substrate context value.
 */
export function useSubstrate(providerUrl: string, appName: string): SubstrateContextValue {
  const api = ref<ApiPromise | null>(null)
  const account = ref<InjectedAccountWithMeta | null>(null)
  const isConnected = ref<boolean>(false)
  const balance = ref<string>('')

  /**
   * Connects to the Polkadot{.js} extension and retrieves the accounts.
   */
  const connectWallet = async () => {
    try {
      await web3Enable(appName)
      const injectedAccounts = await web3Accounts()
      if (injectedAccounts.length > 0) {
        account.value = injectedAccounts[0]
        isConnected.value = true
      }
    } catch (error) {
      console.error('Failed to fetch accounts from Polkadot{.js} extension:', error)
    }
  }

  /**
   * Fetches the balance of the connected account.
   */
  const fetchBalance = async () => {
    if (api.value && account.value) {
      try {
        const { address } = account.value
        const result = await api.value.derive.balances.all(address)
        const chainInfo = await api.value.registry.getChainProperties()
        if (chainInfo) {
          balance.value = formatBalance(result.availableBalance, {
            decimals: chainInfo.tokenDecimals.unwrap()[0].toNumber(),
            withUnit: chainInfo.tokenSymbol.unwrap()[0].toString()
          })
        }
      } catch (error) {
        console.error('Failed to fetch account balance:', error)
      }
    }
  }

  /**
   * Transfers funds from the connected account to the specified recipient address.
   * @param recipientAddress The address of the recipient.
   * @param amount The amount to transfer in the smallest denomination of the chain's native token.
   * @returns The transaction hash if successful, undefined otherwise.
   */
  const transfer = async (
    recipientAddress: string,
    amount: string
  ): Promise<HexString | undefined> => {
    try {
      const amountInSmallestDenom = parseFloat(amount)
      if (api.value && account.value) {
        if (!api.value.tx.balances?.transferKeepAlive) {
          console.error('transferKeepAlive method not found. Please check API version.')
          return
        }
        const transaction = api.value.tx.balances.transferKeepAlive(
          recipientAddress,
          amountInSmallestDenom
        )

        const injector = await web3FromSource(account.value.meta.source)
        const hash = await transaction.signAndSend(account.value.address, {
          signer: injector.signer
        })
        return hash.toHex()
      }
    } catch (error) {
      console.error('Failed to make a transfer:', error)
    }
  }

  /**
   * Connects to the Substrate node using the provided WebSocket URL.
   */
  const connectToSubstrate = async () => {
    try {
      const provider = new WsProvider(providerUrl)
      api.value = await ApiPromise.create({ provider })
    } catch (error) {
      console.error('Failed to connect to Substrate node:', error)
    }
  }

  onMounted(() => {
    connectToSubstrate()
  })

  watch(
    [api, account],
    () => {
      fetchBalance()
    },
    { immediate: true }
  )

  return reactive({
    api,
    connectWallet,
    account,
    isConnected,
    balance,
    transfer
  }) as SubstrateContextValue
}
