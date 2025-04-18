<template>
  <Form id="url" v-on:submit="apply">
    <p>
      Encode a link, an email, some arbitrary text, a telephone number, or
      similar data in the QR code.
    </p>

    <div class="form-line">
      <label>Data type:</label>
      <div id="text-format-container">
        <FormField v-slot="$field" name="data-types" v-bind:initial-value="dataType">
          <SelectButton
            v-model="dataType"
            v-bind:options="Object.entries(DATA_TYPES)"
            v-bind:option-label="(data) => data[1]"
            v-bind:option-value="(data) => data[0]"
          ></SelectButton>
        </FormField>
      </div>
    </div>

    <div class="form-line">
      <label for="data">
        {{ DATA_TYPES[dataType] }}:
      </label>

      <FormField v-slot="$field" name="data" initialValue="">
        <InputText v-bind:type="INPUT_TYPES[dataType]" v-bind:placeholder="PLACEHOLDERS[dataType]" v-model="data" fluid />
      </FormField>
    </div>
    <div class="form-line">
      <span></span>
      <Button type="submit">Generate {{ DATA_TYPES[dataType] }} QR code</Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { InputTypeHTMLAttribute, ref } from 'vue'
import { useStore } from '../pinia'
import { Form, FormField } from '@primevue/forms'
import { InputText, Button, SelectButton } from 'primevue'

const store = useStore()

const emit = defineEmits<{
  (e: 'completed'): void
}>()

const DATA_TYPES = {
  url: 'URL',
  text: 'Text',
  email: 'Email',
  phone: 'Phone'
}

const PLACEHOLDERS: Record<keyof typeof DATA_TYPES, string> = {
  url: 'https://www.example.com/',
  text: 'Some text',
  email: 'email@example.com',
  phone: '+1 232 567 89'
}

const INPUT_TYPES: Record<keyof typeof DATA_TYPES, InputTypeHTMLAttribute> = {
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
      emit('completed')
      break
    case 'email':
      store.setQRData(`MATMSG:TO:${data.value};SUB:;BODY:;`)
      emit('completed')
      break
    case 'phone':
      store.setQRData(`TEL:${data.value}`)
      emit('completed')
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
