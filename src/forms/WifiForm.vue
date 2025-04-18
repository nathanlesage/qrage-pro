<template>
  <Form id="wifi" v-on:submit="apply">
    <p>
      Create a QR code that enables anyone who scans the QR code to immediately
      join the WiFi network provided in the code.
    </p>
    <FormField v-slot="$field" name="ssid" class="form-line">
      <label for="ssid">SSID:</label>
      <InputText type="text" v-model="ssid" placeholder="WiFi name"></InputText>
    </FormField>
    <FormField v-slot="$field" name="pass" class="form-line">
      <label for="pass">Password:</label>
      <Password v-model="pass" placeholder="WiFi password" toggleMask />
    </FormField>
    <FormField v-slot="$field" name="encryption" class="form-line">
      <label for="pass">Encryption:</label>
      <SelectButton
        v-model="encryption"
        v-bind:options="ENCRYPTION_OPTIONS"
        v-bind:option-value="(data) => data[0]"
        v-bind:option-label="(data) => data[1]"
      ></SelectButton>
    </FormField>
    <FormField class="form-line">
      <span></span>
      <Button type="submit">Create WiFi QR code</Button>
    </FormField>
  </Form>
</template>

<script setup lang="ts"> 
import { ref } from 'vue'
import { useStore } from '../pinia'
import { Form, FormField } from '@primevue/forms'
import { InputText, Password, Button, SelectButton } from 'primevue'

const store = useStore()

const emit = defineEmits<{
  (e: 'completed'): void
}>()

const ssid = ref('')
const pass = ref('')
const encryption = ref('WPA')

const ENCRYPTION_OPTIONS = [
  ['WPA', 'WPA/WPA2'],
  ['WEP', 'WEP'],
  ['', 'None']
]

function apply () {
  store.setQRData(`WIFI:T:${encryption.value};S:${ssid.value};P:${pass.value};`)
  emit('completed')
}
</script>

<style lang="css" scoped></style>
