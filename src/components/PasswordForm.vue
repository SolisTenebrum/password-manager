<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits, watch } from 'vue';
import GenerateIcon from './icons/GenerateIcon.vue';
import ShowPasswordIcon from './icons/ShowPasswordIcon.vue';
import SettingsIcon from './icons/SettingsIcon.vue';
import { generatePassword } from '../utils/utils'

const props = defineProps({
  activeWindow: String,
  addPassword: Function,
  savedPasswords: Array,
  isLoading: Boolean,
  errorMessage: String,
  formData: Object,
  generationInfoMessage: String,
  successMessage: String,
  updateGenerationInfoMessage: Function
})

const emit = defineEmits(['update:formData', 'update:generationInfoMessage'])

const localFormData = ref({ ...props.formData })

watch(() => props.formData, (newFormData) => {
  localFormData.value = { ...newFormData }
})

const inputType = ref('password')
const isIconActive = ref(false)
const isSettingsActive = ref(false)
const ownSetEnabled = ref(false)

const options = ref({
  length: 6,
  letters: {
    uppercase: null,
    lowercase: null,
    randomCase: null,
  },
  numbers: null,
  symbols: null,
  ownSet: null,
  ownSetInput: ''
})

const handleRandomCaseChange = () => {
  if (options.value.letters.lowercase || options.value.letters.uppercase) {
    options.value.letters.lowercase = null
    options.value.letters.uppercase = null
  }
}

const handleUpperLowercaseChange = () => {
  if (options.value.letters.randomCase) {
    options.value.letters.randomCase = null
  }
}

const handleOwnSetChange = () => {
  ownSetEnabled.value = !ownSetEnabled.value

  if (ownSetEnabled.value) {
    options.value.letters.uppercase = null
    options.value.letters.lowercase = null
    options.value.letters.randomCase = null
    options.value.numbers = null
    options.value.symbols = null
  }
}

const handleOwnSetInputChange = (event) => {
  options.value.ownSetInput = event.target.value
}

const onGenerate = () => {
  localFormData.value.password = generatePassword(options.value, props.updateGenerationInfoMessage);
  inputType.value = 'text'
  isIconActive.value = true

  emit('update:generationInfoMessage', 'Password generated')

  setTimeout(() => {
    emit('update:generationInfoMessage', '')
  }, 2000)

  emit('update:formData', localFormData.value)
}

const onSubmit = () => {
  props.addPassword({ ...localFormData.value })
  emit('update:generationInfoMessage', '')

  inputType.value = 'password'
}

const showPassword = () => {
  isIconActive.value = !isIconActive.value
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}

const openSettings = () => {
  isSettingsActive.value = !isSettingsActive.value
}

const closeSettings = () => {
  isSettingsActive.value = false
}

const updateLength = (event) => {
  options.value.length = event.target.value
}

const handleClickOutside = (event) => {
  const menu = document.querySelector('.settings-container')
  const button = document.querySelector('.settings-btn')

  if (!menu.contains(event.target) && !button.contains(event.target)) {
    closeSettings()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="container">
    <h2 class="title">Add Service</h2>
    <form class="form" @submit.prevent="onSubmit">
      <div class="inputs">
        <input name="url" class="input" placeholder="Enter service URL" required type="url"
          v-model="localFormData.url" />
        <input name="password" class="input" placeholder="Enter password" required
          :type="inputType.includes('text') ? 'text' : 'password'" :minlength="6" :maxlength="64"
          v-model="localFormData.password" />
        <button class="show-password-btn" type="button" @click="showPassword"><show-password-icon
            :isActive="isIconActive"></show-password-icon></button>
        <button class="generate-btn" type="button" @click="onGenerate"><generate-icon></generate-icon></button>
        <button class="settings-btn" :class="isSettingsActive && 'active'" type="button"
          @click="openSettings"><settings-icon></settings-icon></button>
        <div class="info-container">
          <p v-if="props.generationInfoMessage" class="info-text">{{ props.generationInfoMessage }}</p>
          <span v-else-if="isLoading" class="loader"></span>
          <p v-else-if="props.errorMessage" class="info-text error">{{ props.errorMessage }}</p>
          <p v-else-if="props.successMessage" class="info-text success">{{ props.successMessage }}</p>
        </div>
        <div class="settings-container" :class="isSettingsActive && 'active'">
          <ul class="settings-list">
            <li class="settings-item">
              <input id="length" type="number" min="6" max="64" @input="updateLength" v-model="options.length" />
              <label for="length" class="label">Length</label>
            </li>
            <li class="settings-item">
              <input id="lowercase" type="checkbox" v-model="options.letters.lowercase"
                :disabled="options.letters.randomCase || options.ownSet" @change="handleUpperLowercaseChange">
              <label for="lowercase" class="label">Lowercase</label>
            </li>
            <li class="settings-item">
              <input id="uppercase" type="checkbox" v-model="options.letters.uppercase"
                :disabled="options.letters.randomCase || options.ownSet" @change="handleUpperLowercaseChange">
              <label for="uppercase" class="label">Uppercase</label>
            </li>
            <li class="settings-item">
              <input id="randomcase" type="checkbox" v-model="options.letters.randomCase"
                :disabled="options.letters.lowercase || options.letters.uppercase || options.ownSet"
                @change="handleRandomCaseChange">
              <label for="randomcase" class="label">RandomCase</label>
            </li>
            <li class="settings-item">
              <input id="numbers" type="checkbox" v-model="options.numbers" :disabled="options.ownSet">
              <label for="numbers" class="label">Numbers</label>
            </li>
            <li class="settings-item">
              <input id="symbols" type="checkbox" v-model="options.symbols" :disabled="options.ownSet">
              <label for="symbols" class="label">Symbols</label>
            </li>
            <li class="settings-item">
              <input id="ownset" type="checkbox" v-model="options.ownSet" @change="handleOwnSetChange">
              <label v-if="!options.ownSet" for="ownset" class="label">Own set</label>
              <input v-if="options.ownSet" class="own-set-input" type="text" v-model="options.ownSetInput" minlength="1"
                :maxlength="options.length" @change="handleOwnSetInputChange" />
            </li>
          </ul>
        </div>
      </div>
      <button class="save-btn" type="submit" :class="isLoading && 'disabled'">Save</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  padding: var(--window-padding);
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: var(--corner-radius);
  position: relative;
}

.title {
  text-transform: uppercase;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  align-self: center;
  max-width: 400px;
  width: 100%;
  height: 100%;
}

.inputs {
  display: grid;
  grid-template-areas: 'url url url url'
    'password show-btn generate-btn settings-btn';
  width: 100%;
  gap: 10px;
  margin: auto 0;
  position: relative;
  grid-template-columns: 1fr 40px;
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  background-color: var(--color-background);
  outline: none;
  color: #ffffff;
}

.input:first-of-type {
  grid-area: url;
}

.input:nth-of-type(2) {
  grid-area: password;
}

.input::placeholder {
  color: #c2c2c2;
}

.info-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, 50%);
}

.info-text {
  text-align: center;
  color: var(--error-color);
  font-size: 16px;
}

.save-btn {
  padding: 15px 60px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  outline: none;
  cursor: pointer;
  background-color: var(--color-background);
  color: #ffffff;
  transition: background-color 0.3s ease-in-out;
  text-transform: uppercase;
}

.save-btn:hover {
  background-color: #36b85d;
}

.save-btn.disabled {
  cursor: not-allowed;
  background-color: #c2c2c2;
}

.generate-btn {
  padding: 10px 10px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  outline: none;
  cursor: pointer;
  background-color: var(--color-background);
  color: #ffffff;
  transition: background-color 0.3s ease-in-out;
  grid-area: generate-btn;
  display: flex;
  justify-content: center;
  justify-self: flex-end;
}

.generate-btn:hover,
.show-password-btn:hover,
.settings-btn:hover {
  background-color: #36b85d;
}

.show-password-btn {
  padding: 10px 10px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  outline: none;
  cursor: pointer;
  background-color: var(--color-background);
  color: #ffffff;
  transition: background-color 0.3s ease-in-out;
  grid-area: generate-btn;
  display: flex;
  justify-content: center;
  grid-area: show-btn;
}

.settings-btn {
  padding: 10px 10px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  outline: none;
  cursor: pointer;
  background-color: var(--color-background);
  color: #ffffff;
  transition: background-color 0.3s ease-in-out;
  grid-area: generate-btn;
  display: flex;
  justify-content: center;
  grid-area: settings-btn;
}

.settings-btn.active {
  background-color: rgb(47 47 47 / 1);
}

.settings-container {
  right: -23%;
  top: -94%;
  padding: 15px;
  border-radius: 5px;
  background-color: rgb(47 47 47 / 1);
  position: absolute;
  transform: translate(50%, 50%);
  visibility: hidden;
  opacity: 0;
  transition: visibility 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.settings-container.active {
  visibility: visible;
  opacity: 1;
}

.settings-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  padding: 0;
  row-gap: 10px;
  color: white;
  max-width: 130px;
}

.settings-item {
  display: flex;
  align-items: center;
  column-gap: 7px;
}

#length {
  border-radius: 2px;
  outline: none;
  border: 1px solid;
  width: 38px;
  border-color: #c2c2c2;
}

.label {
  cursor: pointer;
  text-transform: uppercase;
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.own-set-input {
  border-radius: 2px;
  outline: none;
  border: 1px solid;
  width: 76%;
  border-color: #c2c2c2;
  padding: 3.6px;
}

.info-text.success {
  color: var(--success-color);
}

.info-text.error {
  color: var(--error-color);
}

/* Custom loader */
.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  animation-fill-mode: both;
  animation: bblFadInOut 1.8s infinite ease-in-out;
}

.loader {
  color: var(--main-color);
  font-size: 7px;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  animation-delay: -0.16s;
  position: absolute;
  top: 30%;
  transform: translateY(-50%);
}

.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}

.loader:before {
  left: -3.5em;
  animation-delay: -0.32s;
}

.loader:after {
  left: 3.5em;
}

@keyframes bblFadInOut {

  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em
  }

  40% {
    box-shadow: 0 2.5em 0 0
  }
}
</style>