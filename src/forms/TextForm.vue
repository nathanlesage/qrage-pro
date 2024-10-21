<template>
  <form id="url" v-on:submit.prevent="apply">
    <div class="form-line">
      <label>Data type</label>
      <div id="text-format-container">
        <div
          v-for="label, key in DATA_TYPES"
          v-bind:class="{ 'format-button': true, active: key === dataType }"
          v-on:click="dataType = key"
        >
          {{ label }}
        </div>
      </div>
    </div>
    <div class="form-line">
      <label for="data">
        {{ DATA_TYPES[dataType] }}:
      </label>
      <input
        v-bind:type="INPUT_TYPES[dataType]"
        name="data"
        v-bind:placeholder="PLACEHOLDERS[dataType]"
        v-model="data"
      >
    </div>
    <div class="form-line">
      <span></span>
      <input type="submit" v-bind:value="`Generate ${DATA_TYPES[dataType]} QR code`">
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../pinia'

const store = useStore()

const DATA_TYPES = {
  url: 'URL',
  text: 'Text',
  email: 'Email',
  phone: 'Phone'
}

const PLACEHOLDERS: Record<keyof typeof DATA_TYPES, string> = {
  url: 'https://www.example.com/',
  text: 'Some text',
  email: 'email@example.com/',
  phone: '+1 232 567 89'
}

const INPUT_TYPES: Record<keyof typeof DATA_TYPES, string> = {
  url: 'url',
  text: 'text',
  email: 'email',
  phone: 'tel'
}

const dataType = ref<keyof typeof DATA_TYPES>('url')

const data = ref('')

function apply () {
  switch (dataType.value) {
    case 'url':
    case 'text':
      store.setQRData(data.value)
      break
    case 'email':
      store.setQRData(`MATMSG:TO:${data.value};SUB:;BODY:;`)
      break
    case 'phone':
      store.setQRData(`TEL:${data.value}`)
      break
  }
}
</script>

<style lang="css" scoped>
#text-format-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

#text-format-container .format-button {
  padding: 5px 10px;
  border-radius: var(--border-radius);
  background-color: var(--input-bg-light);
  border: 1px solid var(--input-border-light);
  color: var(--input-fg-light);
  cursor: pointer;
}

#text-format-container .format-button.active {
  color: var(--accent-fg-light);
}

@media (prefers-color-scheme: dark) {
  #text-format-container .format-button {
    background-color: var(--accent-bg-dark);
    color: var(--input-fg-dark);
    border-color: var(--input-border-dark);
  }

  #text-format-container .format-button.active {
    color: var(--accent-fg-dark);
  }
}
</style>
