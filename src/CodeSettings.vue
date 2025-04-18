<template>
  <Form id="settings">
    <h2>Customize Your QR Code</h2>

    <FormField v-slot="$field" class="form-line">
      <label for="style">Style</label>
      <SelectButton v-bind:options="[
          ['default', 'Squares (default)'],
          ['dots', 'Dots'],
          ['rorschach', 'Rorschach blot']
        ]"
        v-bind:option-label="(data) => data[1]"
        v-bind:option-value="(data) => data[0]"
        v-model="store.state.style"
        name="style"
      />
      <p class="info-text">Selects the drawing style for the QR code for various aesthetics.</p>
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label for="ec">Error correction</label>
      <SelectButton v-bind:options="[
          ['L', 'Low'],
          ['M', 'Medium'],
          ['Q', 'Quartile'],
          ['H', 'High']
        ]"
        v-bind:option-label="(data) => data[1]"
        v-bind:option-value="(data) => data[0]"
        v-model="store.state.errorCorrection"
        name="ec"
      />
      <p class="info-text">
        Higher error correction means that you can obstruct or destroy larger parts of the QR code while it is still readable. Obstructions include logos.
      </p>
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label for="scale">Resolution</label>
      <InputNumber
        v-model="store.state.scale"
        name="scale"
        showButtons
        buttonLayout="horizontal"
        v-bind:min="1"
        v-bind:step="1"
        increment-icon="pi pi-plus"
        decrement-icon="pi pi-minus"
        suffix=" ppb"
        fluid
      />
      <p class="info-text">Adjust the QR code's resolution (in pixel per block).</p>
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label for="margin">Margin</label>
      <InputNumber
        v-model="store.state.margin"
        name="scale"
        showButtons
        buttonLayout="horizontal"
        v-bind:min="0"
        v-bind:max="100"
        v-bind:step="1"
        increment-icon="pi pi-plus"
        decrement-icon="pi pi-minus"
        v-bind:suffix="store.state.margin === 1 ? ' block' : ' blocks'"
        fluid
      />
      <p class="info-text">
        QR codes need margin around it so that readers can decode them. If you already know that there won't be anything around the QR code, you can set this to zero.
      </p>
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label for="logo">Logo</label>
      <FileUpload
        v-on:select="handleImage"
        accept=".png, .jpg, .jpeg"
        v-bind:multiple="false"
        invalid-file-type-message="Wrong file type"
        auto
        v-on:remove-uploaded-file="store.state.logo = undefined"
      >
        <template #header="{ chooseCallback, uploadedFiles }">
          <Button
            v-on:click="chooseCallback()"
            icon="pi pi-images"
            label="Browse"
            v-bind:disabled="uploadedFiles.length > 0"
          />
        </template>
        <template #empty>
          Choose or drop a logo file as PNG or JPEG.
        </template>
      </FileUpload>

      <p class="info-text">
        Add an optional logo in the center of your QR code. Supported are PNG and JPEG images.
      </p>
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label for="logo-size">Logo size</label>

      <SelectButton
        v-model="store.state.logoSize"
        v-bind:options="[
          [ 'S', 'Small' ],
          [ 'M', 'Medium' ],
          [ 'L', 'Large' ]
        ]"
        v-bind:option-label="(data) => data[1]"
        v-bind:option-value="(data) => data[0]"
      />

      <p class="info-text">
        The larger the logo, the higher the error correction should be. Remember to test your QR code before downloading it.
      </p>

    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label for="fg">Foreground</label>

      <div class="flex">
        <div
          class="color-swatch"
          v-for="col in fgColors"
          v-bind:style="`background-color: ${col}`"
          v-bind:title="col"
          v-bind:class="{ active: store.state.foregroundColor === col }"
          v-on:click="setColor(col, 'fg')"
        ></div>
        <ColorPicker
          class="colorpicker-overwrite"
          v-model="customFgColor"
          v-on:change="setColor(customFgColor, 'fg')"
        />
      </div>

      <p class="info-text">
        Choose a color for the QR code itself. The last choice allows choosing a custom color.
      </p>
    </FormField>

    <FormField v-slot="$field" class="form-line">
      <label for="bg">Background</label>

      <div class="flex">
        <div
          class="color-swatch"
          v-for="col in bgColors"
          v-bind:style="`background-color: ${col}`"
          v-bind:title="col"
          v-bind:class="{ active: store.state.backgroundColor === col }"
          v-on:click="setColor(col, 'bg')"
        ></div>
        <ColorPicker
          class="colorpicker-overwrite"
          v-model="customBgColor"
          v-on:change="setColor(customBgColor, 'bg')"
        />
      </div>

      <p class="info-text">
        Choose a background color. The first choice is transparent, the last one allows choosing a custom color.
      </p>
    </FormField>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from './pinia'
import { Form, FormField } from '@primevue/forms'
import { ColorPicker, InputNumber, Button, SelectButton, FileUpload, FileUploadSelectEvent } from 'primevue'

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

function handleImage (customEvent: FileUploadSelectEvent) {
  const event = customEvent.originalEvent
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

.color-swatch {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: var(--border-radius);
  border: 2px solid #999;
  appearance: none;
}

.colorpicker-overwrite {
  --p-colorpicker-preview-width: 20px;
  --p-colorpicker-preview-height: 20px;
  --p-colorpicker-preview-border-radius: var(--border-radius);
  --p-colorpicker-panel-border-color: #999;
}

.color-swatch.active {
  border-color: #008fff;
}
</style>
