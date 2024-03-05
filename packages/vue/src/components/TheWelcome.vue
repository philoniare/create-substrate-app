<script setup lang="ts">
import type SubstrateContextType from '@/substrate/useSubstrate'
import { useSubstrate } from '@/substrate/useSubstrate';
import { CHAIN_PROVIDERS } from '@/substrate/chains'

const appName: string = import.meta.env.VITE_APP_NAME
const providerUrl: string = CHAIN_PROVIDERS[import.meta.env.VITE_CHAIN]
const substrate: SubstrateContextType = useSubstrate(providerUrl, appName)
</script>

<template>
  <div>
    <button
      v-if="!substrate.isConnected"
      @click="substrate.connectWallet"
      style="background: hsla(160, 100%, 37%, 1); color: white; padding: 10px; border-radius: 20px"
    >
      Connect Wallet
    </button>
    <div v-if="substrate.isConnected">
      <p>Account: {{ substrate.account?.address }}</p>
      <p>Balance: {{ substrate.balance }}</p>
    </div>
  </div>
</template>
