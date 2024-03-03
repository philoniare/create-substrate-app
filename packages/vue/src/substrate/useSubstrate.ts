import { ref, onMounted, watch, reactive } from 'vue'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { formatBalance } from '@polkadot/util'
import type { KeypairType } from '@polkadot/util-crypto/types'

interface InjectedAccountWithMeta {
  address: string
  meta: {
    genesisHash?: string | null
    name?: string
    source: string
  }
  type?: KeypairType
}

export default interface SubstrateContextType {
  api: ApiPromise | null
  connectWallet: () => Promise<void>
  account: InjectedAccountWithMeta | null
  isConnected: boolean
  balance: string
}

export function useSubstrate(providerUrl: string, appName: string): SubstrateContextType {
  const api = ref<ApiPromise | null>(null)
  const account = ref<InjectedAccountWithMeta | null>(null)
  const isConnected = ref<boolean>(false)
  const balance = ref<string>('')

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
    balance
  }) as SubstrateContextType
}
