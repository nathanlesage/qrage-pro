<template>
  <form id="settings">
    <p>Customize your QR code here.</p>

    <div class="form-line">
      <label for="style">Style</label>
      <HelpIcon v-bind:size="20" v-bind:title="'Selects the drawing style for the QR code for various aesthetics.'"></HelpIcon>
      <select name="style" v-model="store.state.style">
        <option value="default">Squares (default)</option>
        <option value="dots">Dots</option>
        <option value="rorschach">Rorschach blot</option>
      </select>
    </div>

    <div class="form-line">
      <label for="ec">Error correction</label>
      <HelpIcon v-bind:size="20" v-bind:title="'Error correction means: How resistant is this QR code to obstructions? Higher error correction means that you can obstruct or destroy larger parts of the QR code while it is still readable.'"></HelpIcon>
      <select name="ec" v-model="store.state.errorCorrection">
        <option value="L">Low</option>
        <option value="M">Medium</option>
        <option value="Q">Quartile</option>
        <option value="H">High</option>
      </select>
    </div>
    <div class="form-line">
      <label for="scale">Resolution</label>
      <HelpIcon v-bind:size="20" v-bind:title="'Increase or decrease the QR code\'s size.'"></HelpIcon>
      <div class="flex">
        <button
          v-on:click.prevent="store.state.scale > 0 ? store.state.scale-- : false"
        >
          &minus;
        </button>
        <button
        v-on:click.prevent="store.state.scale < 100 ? store.state.scale++ : false"
        >
          &plus;
        </button>
        <span>
          {{ store.state.scale }}&times;
        </span>
      </div>
    </div>
    <div class="form-line">
      <label for="margin">Margin</label>
      <HelpIcon v-bind:size="20" v-bind:title="'Usually, QR codes should have some margin around it. Here you can adjust it. If you already know that there won\'t be anything around the QR code, you can set this to zero.'"></HelpIcon>
      <div class="flex">
        <button
          v-on:click.prevent="store.state.margin > 0 ? store.state.margin-- : false"
        >
          &minus;
        </button>
        <button
        v-on:click.prevent="store.state.margin < 100 ? store.state.margin++ : false"
        >
        &plus;
      </button>
      <span>
        {{ store.state.margin }} blocks
      </span>
      </div>
    </div>

    <div class="form-line">
      <label for="logo">Logo</label>
      <HelpIcon v-bind:size="20" v-bind:title="'Add an optional logo in the center of your QR code. Supported are PNG and JPEG images.'"></HelpIcon>
      <div class="flex">
        <img v-if="store.state.logo !== undefined" v-bind:src="store.state.logo" style="max-width: 25%">
        <input v-if="store.state.logo === undefined" type="file" accept=".png, .jpg, .jpeg" v-on:input="handleImage">
        <button v-if="store.state.logo !== undefined" v-on:click.prevent="store.state.logo = undefined">Remove</button>
      </div>
    </div>
    <div class="form-line">
      <label for="logo-size">Logo size</label>
      <HelpIcon v-bind:size="20" v-bind:title="'The larger the logo, the higher the error correction should be. Remember to test your QR code before downloading it.'"></HelpIcon>
      <div class="flex">
        <button v-on:click.prevent="store.state.logoSize = 'S'">S</button>
        <button v-on:click.prevent="store.state.logoSize = 'M'">M</button>
        <button v-on:click.prevent="store.state.logoSize = 'L'">L</button>
      </div>
    </div>

    <div class="form-line">
      <label for="fg">Foreground</label>
      <HelpIcon v-bind:size="20" v-bind:title="'Choose a color for the QR code itself. The last choice allows choosing a custom color.'"></HelpIcon>
      <div class="flex">
        <div
          class="color-swatch"
          v-for="col in fgColors"
          v-bind:style="`background-color: ${col}`"
          v-bind:title="col"
          v-bind:class="{ active: store.state.foregroundColor === col }"
          v-on:click="setColor(col, 'fg')"
        ></div>
        <input
          type="color"
          class="color-swatch"
          title="Custom foreground color"
          v-bind:class="{ active: store.state.foregroundColor === customFgColor }"
          v-model="customFgColor"
          v-on:change="setColor(customFgColor, 'fg')"
        >
      </div>
    </div>
    <div class="form-line">
      <label for="bg">Background</label>
      <HelpIcon v-bind:size="20" v-bind:title="'Choose a background color. The first choice is transparent, the last one allows choosing a custom color.'"></HelpIcon>
      <div class="flex">
        <div
          class="color-swatch"
          v-for="col in bgColors"
          v-bind:style="`background-color: ${col}`"
          v-bind:title="col"
          v-bind:class="{ active: store.state.backgroundColor === col }"
          v-on:click="setColor(col, 'bg')"
        ></div>
        <input
          type="color"
          class="color-swatch"
          title="Custom background color"
          v-bind:class="{ active: store.state.backgroundColor === customBgColor }"
          v-model="customBgColor"
          v-on:change="setColor(customBgColor, 'bg')"
        >
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from './pinia'
import HelpIcon from './icons/HelpIcon.vue'

const customFgColor = ref('#000000ff')
const customBgColor = ref('#ffffffff')

const fgColors = [
  '#000000ff',
  '#666666ff',
  '#ff3366ff',
  '#33dd11ff',
  '#3366ffff',
  '#66ddddff',
  '#ff33ffff',
  '#aa33ffff',
]

const bgColors = [
  '#00000000', // Transparent
  '#ffffffff', // White
  '#000000ff',
  '#ff3366ff',
  '#33dd11ff',
  '#3366ffff',
  '#66ddddff',
  '#ff33ffff',
]

const store = useStore()

function setColor(color: string, where: 'fg'|'bg') {
  if (where === 'bg') {
    store.state.backgroundColor = color
  } else {
    store.state.foregroundColor = color
  }
}

function handleImage (event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files.length === 0) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    store.state.logo = reader.result as string
  }
  reader.readAsDataURL(input.files[0])
}
</script>

<style lang="css" scoped>
div.flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 20px;
  row-gap: 5px;
}

div.form-line {
  grid-template-columns: minmax(100px, 20%) 20px auto;
}

.color-swatch {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: var(--border-radius);
  border: 2px solid #999;
  appearance: none;
}

.color-swatch.active {
  border-color: #008fff;
}
</style>
