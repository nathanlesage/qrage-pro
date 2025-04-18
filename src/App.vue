<template>
  <header>
    <div class="container">
      <h1>QRage Pro</h1>
      <small>The No-BS QR Code Generator</small>
    </div>
  </header>
  <div class="container">
      <section class="lead">
        Generate beautiful and custom QR codes for any occasion in a breeze.
        Follow our wizard, provide the data you want to encode, and adapt the
        looks and feel for your QR Code. QRage Pro lets you customize everything
        from colors to even include your own logo. And the best? Everything
        happens on your computer, and no data is transmitted over the internet.
      </section>

      <Stepper value="1" v-bind:linear="linear">
        <StepItem value="1">
          <Step>Choose QR Code Type</Step>
          <StepPanel v-slot="{ activateCallback }">
            <SelectButton
              v-model="currentForm"
              v-bind:options="[
                [ 'text', 'Text' ],
                [ 'wifi', 'WiFi' ],
                [ 'vcard', 'VCard' ],
                [ 'event', 'Event' ]
              ]"
              v-bind:option-label="(data) => data[1]"
              v-bind:option-value="(data) => data[0]"
              v-on:value-change="value => selectQRType(value, activateCallback)"
            ></SelectButton>
          </StepPanel>
        </StepItem>

        <StepItem value="2">
          <Step>Provide data</Step>
          <StepPanel v-slot="{ activateCallback }">
            <TextForm v-show="currentForm === 'text'" v-on:completed="linear = false; activateCallback('3')"></TextForm>
            <WifiForm v-show="currentForm === 'wifi'" v-on:completed="linear = false; activateCallback('3')"></WifiForm>
            <VCardForm v-show="currentForm === 'vcard'" v-on:completed="linear = false; activateCallback('3')"></VCardForm>
            <EventForm v-show="currentForm === 'event'" v-on:completed="linear = false; activateCallback('3')"></EventForm>
          </StepPanel>
        </StepItem>

        <StepItem value="3">
          <Step>Customize QR Code</Step>
          <StepPanel v-slot="{ activateCallback }">
            <!-- Just the QR Code Canvas as Preview -->
            <QRCode></QRCode>

            <!-- Settings -->
            <CodeSettings></CodeSettings>

            <Button v-on:click="activateCallback('4')">Review &amp; Download</Button>
          </StepPanel>
        </StepItem>

        <StepItem value="4">
          <Step>Download QR Code</Step>
          <StepPanel v-slot="{ activateCallback }">
            <p>Test your QR code, and download it as JPG or PNG.</p>
            <Button v-on:click="activateCallback('3')">Adapt Settings</Button>
            <!-- QR code for confirmation and download -->
            <QRCode :show-buttons="true" :show-info="true"></QRCode>
          </StepPanel>
        </StepItem>
      </Stepper>
    </div>
    <footer>
      <div class="container">
        <strong>QRage Pro</strong>
        | &copy; 2025 Hendrik Erz
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
import { Button } from 'primevue'

// For the step wizard
import { SelectButton } from 'primevue'
import Stepper from 'primevue/stepper'
import StepItem from 'primevue/stepitem'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'

const currentForm = ref('')
const linear = ref(true)

function selectQRType (value: string|null, activateCallback: Function) {
  if (value === null) {
    return
  }

  currentForm.value = value
  activateCallback('2')
}
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
