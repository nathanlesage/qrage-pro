<template>
  <header>
    <div class="container">
      <h1>QRage Pro <small>The No-BS QR Code Generator</small></h1>
    </div>
  </header>
  <div class="container">
      <section class="lead">
        Generate beautiful and custom QR codes in a breeze. Simply select the
        appropriate tab, enter the data you want to see in the QR code, and
        adapt the settings. QRage Pro lets you customize everything from colors
        to even include your own logo.
      </section>
      <div id="tab-container">
        <a href="#text" v-on:click.prevent="currentForm = 'text'" v-bind:class="{ active: currentForm === 'text' }">Text</a>
        <a href="#wifi" v-on:click.prevent="currentForm = 'wifi'" v-bind:class="{ active: currentForm === 'wifi' }">WiFi</a>
        <a href="#vcard" v-on:click.prevent="currentForm = 'vcard'" v-bind:class="{ active: currentForm === 'vcard' }">VCard</a>
        <a href="#event" v-on:click.prevent="currentForm = 'event'" v-bind:class="{ active: currentForm === 'event' }">Event</a>
        <span style="flex-grow: 1"><!-- spacer --></span>
        <a href="#settings" v-on:click.prevent="currentForm = 'settings'" v-bind:class="{ active: currentForm === 'settings', special: true }">Settings</a>
      </div>
      <div id="form-container">
        <TextForm v-show="currentForm === 'text'"></TextForm>
        <WifiForm v-show="currentForm === 'wifi'"></WifiForm>
        <VCardForm v-show="currentForm === 'vcard'"></VCardForm>
        <EventForm v-show="currentForm === 'event'"></EventForm>
        <CodeSettings v-if="currentForm === 'settings'"></CodeSettings>
      </div>
      <!-- Actual QR Code Canvas -->
      <QRCode></QRCode>
    </div>
    <footer>
      <div class="container">
        <strong>QRage Pro</strong>
        | &copy; 2024 Hendrik Erz
        | <a href="https://github.com/nathanlesage/qrage-pro">View on GitHub</a>
      </div>
    </footer>
</template>

<script setup lang="ts">
import CodeSettings from './CodeSettings.vue'
import EventForm from './forms/EventForm.vue'
import TextForm from './forms/TextForm.vue'
import VCardForm from './forms/VCardForm.vue'
import WifiForm from './forms/WifiForm.vue'
import QRCode from './QRCode.vue'
import { ref } from 'vue'

const currentForm = ref('text')
</script>

<style lang="css" scoped>
section.lead {
  margin: 20px 0;
  line-height: 120%;
}

footer {
  margin: 0;
  height: 40px;
  padding: 10px 20px;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

#form-container {
  border: 1px solid #aaa;
  padding: 10px 10px;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

#tab-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

#tab-container a {
  border: 1px solid var(--border-light);
  border-bottom: none;
  display: inline-block;
  text-decoration: none;
  color: #333;
  padding: 5px 10px;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
}

#tab-container a:hover, #tab-container a.active {
  color: var(--accent-fg-light);
}

#tab-container a.active {
  background-color: var(--accent-bg-light);
}

@media (prefers-color-scheme: dark) {
  #form-container {
    border-color: var(--border-dark);
  }

  #tab-container a {
    color: #fff;
  }

  #tab-container a:hover, #tab-container a.active {
    color: var(--accent-fg-dark);
  }

  #tab-container a.active {
    background-color: var(--accent-bg-dark);
  }
}
</style>
