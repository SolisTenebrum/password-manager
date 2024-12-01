<script setup>
import { ref, computed } from 'vue';
import ClickIcon from './icons/ClickIcon.vue';
import CopyIcon from './icons/CopyIcon.vue';
import DeleteIcon from './icons/DeleteIcon.vue';
import LoadingIcon from './icons/LoadingIcon.vue';
import ShowPasswordIcon from './icons/ShowPasswordIcon.vue';
import { copyToClipboard } from '@/utils/utils';

const props = defineProps({
  activeWindow: String,
  showIcon: Boolean,
  savedPasswords: Array,
  deletePassword: Function,
  isDeleting: Boolean,
  popupSuccessMessage: String,
  popupErrorMessage: String
})

const isIconActive = ref({})
const searchInput = ref('')
const isCopied = ref(false)

const filteredPasswords = computed(() => {
  return props.savedPasswords.filter((item) =>
    item.url.toLowerCase().includes(searchInput.value.toLowerCase()))
})

const showPassword = (passwordId) => {
  const password = props.savedPasswords.find(pw => pw.id === passwordId)
  if (password) {
    password.isVisible = !password.isVisible
    isIconActive.value = {
      ...isIconActive.value,
      [passwordId]: password.isVisible
    }
  }
}

const onCopy = async (password) => {
  isCopied.value = true;
  try {
    await copyToClipboard(password);
    setTimeout(() => {
      isCopied.value = false;
    }, 1000);
  } catch (err) {
    console.error('Failed to copy password:', err);
    isCopied.value = false;
  }
}
</script>

<template>
  <div class="container">
    <click-icon :showIcon="showIcon"></click-icon>
    <h2 class="title">Saved passwords</h2>
    <div class="search-input-container" v-if="savedPasswords.length">
      <div class="search-icon" :class="activeWindow === 'saved' && 'visible'">
        <div class="circle"></div>
        <div class="line"></div>
      </div>
      <input class="search-input" :class="activeWindow === 'saved' && 'visible'" type="text" placeholder="Search"
        v-model="searchInput" />
    </div>
    <div class="saved-passwords-empty" v-if="savedPasswords.length === 0">
      <p class="text">You don't have any saved passwords yet</p>
    </div>
    <div class="saved-passwords" :class="activeWindow === 'saved' && 'visible'" v-else>
      <ul class="saved-passwords-list">
        <li v-for="item in filteredPasswords" :key="item" class="saved-passwords-item">
          <input class="data" :value="item.url" disabled type="url" />
          <input class="data" :value="item.password" disabled :type="item.isVisible ? 'text' : 'password'" />
          <button class="show-btn" :class="isDeleting && 'disabled'" @click="showPassword(item.id)"><show-password-icon
              :isActive="isIconActive[item.id]"></show-password-icon></button>
          <button class="copy-btn" :class="isDeleting && 'disabled'"
            @click="onCopy(item.password)"><copy-icon></copy-icon></button>
          <button class="delete-btn" :class="isDeleting && 'disabled'" @click="deletePassword(item.id)"><template
              v-if="!isDeleting"><delete-icon></delete-icon></template>
            <template v-else><loading-icon></loading-icon></template>
          </button>
        </li>
      </ul>
    </div>
  </div>
  <div class="copy-popup" :class="isCopied && 'visible'">
    <div class="copy-popup-container">
      <p class="message clipboard">Copied to clipboard </p>
    </div>
  </div>
  <div class="error-popup" :class="props.popupErrorMessage && 'visible'">
    <div class="error-popup-container">
      <p class="message error">{{ props.popupErrorMessage }}</p>
    </div>
  </div>
  <div class="success-popup" :class="props.popupSuccessMessage && 'visible'">
    <div class="success-popup-container">
      <p class="message success">{{ props.popupSuccessMessage }}</p>
    </div>
  </div>

</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
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
  margin-bottom: 30px;
}

.search-input-container {
  position: absolute;
  top: 30px;
  right: 30px;
}

.search-input {
  padding: 10px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  background-color: var(--color-background);
  outline: none;
  width: 200px;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  pointer-events: none;
  color: #fff;
}

.search-input::placeholder {
  color: #c2c2c2;
}

.search-input.visible {
  opacity: 1;
  pointer-events: all;
}

.search-icon {
  position: absolute;
  top: 43%;
  left: -27px;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  cursor: pointer;
}

.search-icon.visible {
  opacity: 1;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 4px solid var(--color-background);
  position: absolute;
  top: 50%;
  left: 0px;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.line {
  position: absolute;
  width: 12px;
  height: 4px;
  left: 0;
  top: 50%;
  background-color: var(--color-background);
  transform: rotate(45deg) translate(9px, 2.5px);
  z-index: 0;
}

.saved-passwords-empty {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: center;
  max-width: 300px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.text {
  text-align: center;
}

.saved-passwords {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: center;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  overflow-y: auto;
}

.saved-passwords.visible {
  opacity: 1;
}

.saved-passwords-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: center;
  width: 100%;
  height: 100%;
  list-style: none;
  padding: 0;
  padding-right: 5px;
}

.saved-passwords-item {
  display: flex;
  column-gap: 10px;
}

.data {
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: var(--color-background);
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  width: 100%;
  overflow-x: scroll;
  scrollbar-width: none;
  color: #fff;
  user-select: none;
  pointer-events: none;
}

.delete-btn,
.copy-btn,
.show-btn {
  padding: 15px 15px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  outline: none;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.show-btn,
.copy-btn {
  background-color: var(--common-button-color);
}

.show-btn:hover,
.copy-btn:hover {
  background-color: #121653;
}

.delete-btn {
  background-color: var(--delete-button-color);
}

.delete-btn:hover {
  background-color: #832020;
}

.delete-btn.disabled,
.copy-btn.disabled,
.show-btn.disabled {
  cursor: not-allowed;
  background-color: #c2c2c2;
}

.error-popup,
.copy-popup,
.success-popup {
  padding: 10px;
  position: absolute;
  bottom: -20%;
  max-width: 254px;
  left: 50%;
  transform: translateX(-50%);
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: hidden;
  opacity: 0;
}

.error-popup.visible,
.copy-popup.visible, .success-popup.visible {
  visibility: visible;
  opacity: 1;
}

.error-popup-container,
.copy-popup-container,
.success-popup-container {
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--corner-radius);
}

.message {
  text-align: center;
}

.message.error {
  color: var(--error-color);
}

.message.clipboard {
  color: var(--success-color);
}

.message.success {
  color: var(--success-color);
}
</style>
