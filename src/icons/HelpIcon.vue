<template>
  <svg
    ref="icon"
    xmlns="http://www.w3.org/2000/svg"
    v-bind:width="props.size ?? 24"
    v-bind:height="props.size ?? 24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-help-circle"
    v-bind:title="props.title"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
</template>

<script setup lang="ts">
import tippy from 'tippy.js'
import { onMounted, ref } from 'vue'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/material.css'

const props = defineProps<{
  size?: number
  title: string
}>()

const icon = ref<SVGElement|null>(null)

onMounted(() => {
  tippy(icon.value, {
    theme: 'material',
    content: props.title,
    trigger: 'mouseenter click',
    delay: [200, 200]
  })
})
</script>

<style lang="css" scoped>
.feather.feather-help-circle {
  cursor: help;
}
</style>
