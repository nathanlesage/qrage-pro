<template>
  <form id="vcard" v-on:submit.prevent="apply">
    <div class="form-line">
      <label>Given name</label>
      <input type="text" v-model="givenName" placeholder="John" required>
    </div>

    <div class="form-line">
      <label>Family name</label>
      <input type="text" v-model="familyName" placeholder="Doe" required>
    </div>

    <div class="form-line">
      <label>Personal Email</label>
      <input type="email" v-model="personalEmail" placeholder="john.doe@gmail.com">
    </div>

    <div class="form-line">
      <label>Website</label>
      <input type="url" v-model="website" placeholder="https://www.john-doe.com/">
    </div>

    <div class="form-line">
      <label>Main Phone</label>
      <input type="tel" v-model="mainPhone" placeholder="+1 232 456 78">
    </div>

    <div class="form-line">
      <label>Home phone</label>
      <input type="tel" v-model="homePhone" placeholder="+1 232 456 78">
    </div>

    <div class="form-line">
      <label>Note</label>
      <input type="text" v-model="note" placeholder="Something to note">
    </div>

    <fieldset>
      <legend>Personal address</legend>
      <div class="form-line">
        <label>Street</label>
        <input type="text" v-model="homeStreet" placeholder="Street Avenue 2324">
      </div>

      <div class="form-line">
        <label>City</label>
        <input type="text" v-model="homeCity" placeholder="Atlantic City">
      </div>

      <div class="form-line">
        <label>ZIP code</label>
        <input type="text" v-model="homeZip" placeholder="60219">
      </div>

      <div class="form-line">
        <label>State</label>
        <input type="text" v-model="homeState" placeholder="Pennsylvania">
      </div>

      <div class="form-line">
        <label>Country</label>
        <input type="text" v-model="homeCountry" placeholder="USA">
      </div>
    </fieldset>

    <fieldset>
      <legend>Work</legend>
      <div class="form-line">
        <label>Company/Organization</label>
        <input type="text" v-model="company" placeholder="ACME company">
      </div>

      <div class="form-line">
        <label>Role</label>
        <input type="text" v-model="role" placeholder="Manager">
      </div>

      <div class="form-line">
        <label>Title</label>
        <input type="text" v-model="title" placeholder="CEO">
      </div>

      <div class="form-line">
        <label>Street</label>
        <input type="text" v-model="workStreet" placeholder="Street Avenue 2324">
      </div>

      <div class="form-line">
        <label>City</label>
        <input type="text" v-model="workCity" placeholder="Atlantic City">
      </div>

      <div class="form-line">
        <label>ZIP code</label>
        <input type="text" v-model="workZip" placeholder="60219">
      </div>

      <div class="form-line">
        <label>State</label>
        <input type="text" v-model="workState" placeholder="Pennsylvania">
      </div>

      <div class="form-line">
        <label>Country</label>
        <input type="text" v-model="workCountry" placeholder="USA">
      </div>

      <div class="form-line">
        <label>Work Email</label>
        <input type="email" v-model="workEmail" placeholder="john@company.com">
      </div>

      <div class="form-line">
        <label>Work phone</label>
        <input type="tel" v-model="workPhone" placeholder="+1 232 456 78">
      </div>
    </fieldset>

    <div class="form-line">
      <span></span>
      <input type="submit" value="Create VCard QR Code">
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../pinia'
import { v4 as uuid } from 'uuid'

const store = useStore()

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
}
</script>

<style lang="css" scoped></style>
