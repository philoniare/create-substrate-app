<script setup lang="ts">
import { ref, watch } from 'vue'
import type SubstrateContextType from '@/substrate/useSubstrate'
import { useSubstrate } from '@/substrate/useSubstrate'
import { CHAIN_PROVIDERS } from '@/substrate/chains'

const appName: string = import.meta.env.VITE_APP_NAME || 'my-app'
const providerUrl: string = CHAIN_PROVIDERS[import.meta.env.VITE_CHAIN] || 'default'
const substrate: SubstrateContextType = useSubstrate(providerUrl, appName)
const toAddress = ref(substrate.account?.address)
const amount = ref('')
const tranHash = ref('')

watch(
  () => substrate.account?.address,
  (newAddress) => {
    toAddress.value = newAddress
  }
)
const handleSubmit = async () => {
  const hash = await substrate.transfer(toAddress.value, amount.value)
  if (hash) {
    tranHash.value = hash
  }
}
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
      <div>
        <table class="balance-table">
          <thead>
            <tr>
              <th class="table-header">Name</th>
              <th class="table-header">Address</th>
              <th class="table-header">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ substrate.account?.meta?.name }}</td>
              <td>{{ substrate.account?.address }}</td>
              <td>{{ substrate.balance }}</td>
            </tr>
          </tbody>
        </table>
        <div class="transfer-div">
          <form @submit.prevent="handleSubmit">
            <div class="transfer-input">
              <label for="to">To address:</label>
              <input id="to" type="text" v-model="toAddress" />
            </div>
            <div class="transfer-input">
              <label for="amount">Amount (Units):</label>
              <input id="amount" type="text" v-model="amount" />
            </div>
            <span v-if="tranHash">Tx Hash: {{ tranHash }}</span>
            <button
              style="
                background: hsla(160, 100%, 37%, 1);
                color: white;
                padding: 10px;
                border-radius: 20px;
              "
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.balance-table {
  margin-top: 20px;
  width: 656px;
  border-collapse: collapse;
}

.balance-table td,
th {
  padding: 10px;
  border: 1px solid hsla(160, 100%, 37%, 1);
}

.transfer-div {
  padding: 20px;
  border: 1px solid hsla(160, 100%, 37%, 1);
  margin-top: 20px;
  width: 656px;
  text-align: center;
}

.transfer-input {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.transfer-input input {
  width: 400px;
}

.transfer-div button {
  padding: 5px;
  margin-top: 15px;
}
</style>
