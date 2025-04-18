<template>
  <Form id="event" v-on:submit.prevent="apply">
    <p>
      Create a QR code for an event you are planning. By scanning the QR code,
      your users can directly add this event to their calendars. The summary (or
      title), start, and end times are required, the rest is optional.
    </p>

    <FormField v-slot="$field" class="form-line">
      <label for="summary">Summary</label>
      <InputText name="summary" placeholder="What is the event about?" v-model="summary" required></InputText>
    </FormField>
    <FormField v-slot="$field" class="form-line">
      <label for="dtstart">Start</label>
      <DatePicker id="dtstart" v-model="dtstart" showTime hourFormat="24" fluid required />
    </FormField>
    <FormField v-slot="$field" class="form-line">
      <label for="dtstart">End</label>
      <DatePicker id="dtend" v-model="dtend" showTime hourFormat="24" fluid required />
    </FormField>
    <FormField v-slot="$field" class="form-line">
      <label for="pass">Location</label>
      <InputText type="text" placeholder="Street Avenue 2324" v-model="location" />
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label for="pass">URL</label>
      <InputText type="url" placeholder="https://www.example.com" v-model="url" />
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label for="pass">Description</label>
      <InputText type="text" placeholder="A longer description" v-model="description" />
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <span></span>
      <Button type="submit">Create Event QR Code</Button>
    </FormField>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../pinia'
import { v4 as uuid } from 'uuid'
import { DateTime } from 'luxon'
import { InputNumber, Button, SelectButton, InputText, DatePicker } from 'primevue'
import { FormField } from '@primevue/forms'

const store = useStore()

const emit = defineEmits<{
  (e: 'completed'): void
}>()

const summary = ref('')
const description = ref('')
const dtstart = ref<Date>(new Date())
const dtend = ref<Date>(new Date())
const location = ref('')
const url = ref('')

/**
 * Takes an ISO string (2024-10-18T12:34:00) and returns an iCal capable format.
 *
 * @param   {string}  date  The original date
 *
 * @return  {string}        The transformed date
 */
function iso2iCal (date: string): string {
  date = date.replace(/[:-]/g, '')
  // Some luxon things spit out milliseconds even if we don't want it
  if (date.includes('.')) {
    date = date.slice(0, date.lastIndexOf('.'))
  }
  return date
}

function apply() {
  // We have ISO strings, but need to remove the - and : separators. And add seconds
  // Datetime-local inputs do not give us seconds, so we need to add them
  // We need to take the HTML input ISO timestamps, convert them to UTC and then
  // back to ISO, as iCal expects UTC by default and this saves us the hassle of
  // having to include an entire timezone block in here. Clients will
  // automatically calculate the local offsets from this.
  const opts = { suppressMilliseconds: true, includeOffset: false }
  const start = iso2iCal(DateTime.fromJSDate(dtstart.value).toUTC().toISO(opts))
  const end = iso2iCal(DateTime.fromJSDate(dtend.value).toUTC().toISO(opts))
  // Date toISO returns with fractional seconds after a period, which we need to
  // remove
  const now = iso2iCal(DateTime.utc().toISO(opts))

  const data = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QRage Pro//NONSGML QRage Pro v1.0//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `LOCATION:${location.value}`,
    `DTSTAMP:${now}`,
    `SUMMARY:${summary.value}`,
    `URL;VALUE=URI:${url.value}`,
    `DESCRIPTION:${description.value}`,
    `UID:${uuid()}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ]

  store.setQRData(data.join('\n'))
  emit('completed')
}
</script>

<style lang="css" scoped></style>
