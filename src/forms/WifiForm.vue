<template>
  <form id="wifi" v-on:submit.prevent="apply">
    <div class="form-line">
      <label for="ssid">SSID</label>
      <input type="text" name="ssid" placeholder="WiFi name" v-model="ssid">
    </div>
    <div class="form-line">
      <label for="pass">Password</label>
      <input type="password" name="pass" placeholder="WiFi password" v-model="pass">
    </div>
    <div class="form-line">
      <label for="pass">Encryption</label>
      <select name="pass" v-model="encryption">
        <option value="WPA">WPA/WPA2</option>
        <option value="WEP">WEP</option>
        <option value="">None</option>
      </select>
    </div>
    <div class="form-line">
      <span></span>
      <input type="submit" value="Create WiFi QR code">
    </div>
  </form>
</template>

<script setup lang="ts"> 
import { ref } from 'vue'
import { useStore } from '../pinia'

const store = useStore()

const ssid = ref('')
const pass = ref('')
const encryption = ref('WPA')

function apply () {
  store.setQRData(`WIFI:T:${encryption.value};S:${ssid.value};P:${pass.value};`)
}
</script>

<style lang="css" scoped></style>
