<template>
  <Form id="vcard" v-on:submit.prevent="apply">
    <p>
      Create a business card &ndash; either for yourself or for your business. Except
      the name, all properties are optional. If you create an organization, choose
      that one as the name. Note also that the "main phone" will be what the
      user's phones will offer to dial by default. If you want the users to dial
      your work phone, put that one into both the work phone and main phone
      fields. Likewise with your personal (home) phone.
    </p>

    <FormField v-slot="$field" class="form-line">
      <label>Given name</label>
      <InputText type="text" v-model="givenName" placeholder="John" required />
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label>Family name</label>
      <InputText type="text" v-model="familyName" placeholder="Doe" required />
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label>Personal Email</label>
      <InputText type="email" v-model="personalEmail" placeholder="john.doe@gmail.com" />
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label>Website</label>
      <InputText type="url" v-model="website" placeholder="https://www.john-doe.com/" />
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label>Main Phone</label>
      <InputText type="tel" v-model="mainPhone" placeholder="+1 232 456 78" />
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label>Home phone</label>
      <InputText type="tel" v-model="homePhone" placeholder="+1 232 456 78" />
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label>Note</label>
      <InputText type="text" v-model="note" placeholder="Something to note" />
    </FormField>

    <fieldset>
      <legend>Personal address</legend>
      <FormField v-slot="$field" class="form-line">
        <label>Street</label>
        <InputText type="text" v-model="homeStreet" placeholder="Street Avenue 2324" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>City</label>
        <InputText type="text" v-model="homeCity" placeholder="Atlantic City" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>ZIP code</label>
        <InputText type="text" v-model="homeZip" placeholder="60219" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>State</label>
        <InputText type="text" v-model="homeState" placeholder="Pennsylvania" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>Country</label>
        <InputText type="text" v-model="homeCountry" placeholder="USA" />
      </FormField>
    </fieldset>

    <fieldset>
      <legend>Work</legend>

      <FormField v-slot="$field" class="form-line">
        <label>Company/Organization</label>
        <InputText type="text" v-model="company" placeholder="ACME company" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>Role</label>
        <InputText type="text" v-model="role" placeholder="Manager" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>Title</label>
        <InputText type="text" v-model="title" placeholder="CEO" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>Street</label>
        <InputText type="text" v-model="workStreet" placeholder="Street Avenue 2324" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>City</label>
        <InputText type="text" v-model="workCity" placeholder="Atlantic City" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>ZIP code</label>
        <InputText type="text" v-model="workZip" placeholder="60219" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>State</label>
        <InputText type="text" v-model="workState" placeholder="Pennsylvania" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>Country</label>
        <InputText type="text" v-model="workCountry" placeholder="USA" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>Work Email</label>
        <InputText type="email" v-model="workEmail" placeholder="john@company.com" />
      </FormField>

      <FormField v-slot="$field" class="form-line">
        <label>Work phone</label>
        <InputText type="tel" v-model="workPhone" placeholder="+1 232 456 78" />
      </FormField>
    </fieldset>

    <FormField v-slot="$field" class="form-line">
      <span></span>
      <Button type="submit">Create VCard QR Code</Button>
    </FormField>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../pinia'
import { v4 as uuid } from 'uuid'
import { Button, InputText } from 'primevue'
import { FormField, Form } from '@primevue/forms'

const store = useStore()

const emit = defineEmits<{
  (e: 'completed'): void
}>()

const givenName = ref('')
const familyName = ref('')
const workEmail = ref('')
const personalEmail = ref('')
const website = ref('')
const mainPhone = ref('')
const homePhone = ref('')
const workPhone = ref('')
const company = ref('')
const role = ref('')
const title = ref('')
const note = ref('')

const homeStreet = ref('')
const homeCity = ref('')
const homeZip = ref('')
const homeState = ref('')
const homeCountry = ref('')

const workStreet = ref('')
const workCity = ref('')
const workZip = ref('')
const workState = ref('')
const workCountry = ref('')

function apply () {
  // see also: https://en.wikipedia.org/wiki/VCard#Properties
  // But for the actual syntax, I looked at https://vcardmaker.com/
  const data = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'PRODID:-//QRage Pro//NONSGML QRage Pro v1.0//EN',
    `FN:${givenName.value} ${familyName.value}`,
    `N:${familyName.value};${givenName.value}`,
    `UID:${uuid()}`,
    `EMAIL;type=HOME,INTERNET:${personalEmail.value}`,
    `EMAIL;type=WORK,INTERNET:${workEmail.value}`,
    `TEL;TYPE=CELL:${mainPhone.value}`,
    `TEL;TYPE=HOME,VOICE:${homePhone.value}`,
    `TEL;TYPE=WORK,VOICE:${workPhone.value}`,
    `LABEL;TYPE=HOME:Home`,
    `ADR;type=HOME:;;${homeStreet.value};${homeCity.value};${homeState.value};${homeZip.value};${homeCountry.value}`,
    `LABEL;TYPE=WORK:Work`,
    `ADR;type=WORK:;;${workStreet.value};${workCity.value};${workState.value};${workZip.value};${workCountry.value}`,
    `TITLE:${title.value}`,
    `ROLE:${role.value}`,
    `ORG:${company.value}`,
    `URL:${website.value}`,
    `NOTE:${note.value}`,
    'END:VCARD'
  ]

  store.setQRData(data.join('\n'))
  emit('completed')
}
</script>

<style lang="css" scoped></style>
