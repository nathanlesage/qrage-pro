<template>
  <form id="event" v-on:submit.prevent="apply">
    <p>
      Create a QR code for an event you are planning. By scanning the QR code,
      your users can directly add this event into their calendars. The summary (or
      title), start, and end times are required, the rest is optional.
      <strong>
        Note that all times are expected in <em>your local timezone</em>
      </strong>. That means, please choose the start and end date based on your
      own timezone. The app will convert the times into UTC and direct anyone's
      smartphone to convert that time into the user's own timezone.
    </p>

    <div class="form-line">
      <label for="summary">Summary</label>
      <input type="text" name="summary" placeholder="What is the event about?" v-model="summary" required>
    </div>
    <div class="form-line">
      <label for="dtstart">Start</label>
      <input type="datetime-local" name="dtstart" placeholder="Start date" v-model="dtstart" required>
    </div>
    <div class="form-line">
      <label for="dtstart">End</label>
      <input type="datetime-local" name="dtend" placeholder="End date" v-model="dtend" required>
    </div>
    <div class="form-line">
      <label for="pass">Location</label>
      <input type="text" placeholder="Street Avenue 2324" v-model="location">
    </div>

    <div class="form-line">
      <label for="pass">URL</label>
      <input type="url" placeholder="https://www.example.com" v-model="url">
    </div>

    <div class="form-line">
      <label for="pass">Description</label>
      <input type="text" placeholder="A longer description" v-model="description">
    </div>

    <div class="form-line">
      <span></span>
      <input type="submit" value="Create Event QR code">
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../pinia'
import { v4 as uuid } from 'uuid'
import { DateTime } from 'luxon'

const store = useStore()

const summary = ref('')
const description = ref('')
const dtstart = ref('')
const dtend = ref('')
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
  const start = iso2iCal(DateTime.fromISO(dtstart.value).toUTC().toISO(opts))
  const end = iso2iCal(DateTime.fromISO(dtend.value).toUTC().toISO(opts))
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
}
</script>

<style lang="css" scoped></style>
