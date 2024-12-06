<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ClickIcon from './icons/ClickIcon.vue'
import CopyIcon from './icons/CopyIcon.vue'
import DeleteIcon from './icons/DeleteIcon.vue'
import LoadingIcon from './icons/LoadingIcon.vue'
import ShowPasswordIcon from './icons/ShowPasswordIcon.vue'
import SearchIcon from './icons/SearchIcon.vue'
import DotsIcon from './icons/DotsIcon.vue'
import { copyToClipboard } from '@/utils/utils'
import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

const props = defineProps({
  activeWindow: String,
  showIcon: Boolean,
  savedPasswords: Array,
  deletePassword: Function,
  isDeleting: Boolean,
  popupSuccessMessage: String,
  popupErrorMessage: String,
})

const isIconActive = ref({})
const searchInput = ref('')
const isCopied = ref(false)
const isMoreActionsMenuOpen = ref({
  id: null,
  position: { top: '0px' },
})

const filteredPasswords = computed(() => {
  return props.savedPasswords.filter((item) =>
    item.url.toLowerCase().includes(searchInput.value.toLowerCase()),
  )
})

const showPassword = (passwordId) => {
  const password = props.savedPasswords.find((pw) => pw.id === passwordId)
  if (password) {
    password.isVisible = !password.isVisible
    isIconActive.value = {
      ...isIconActive.value,
      [passwordId]: password.isVisible,
    }
  }
}

const onCopy = async (password) => {
  isCopied.value = true
  try {
    await copyToClipboard(password)
    setTimeout(() => {
      isCopied.value = false
    }, 1000)
  } catch (err) {
    console.error('Failed to copy password:', err)
    isCopied.value = false
  }
}

const toggleMoreActionsMenu = (itemId, event) => {
  const button = event.target.closest('.more-btn')
  if (button) {
    const buttonRect = button.getBoundingClientRect()
    const position = {
      bottom: `${buttonRect.bottom - window.scrollY}px`,
    }

    if (isMoreActionsMenuOpen.value.id === itemId) {
      isMoreActionsMenuOpen.value = { id: null, position: { bottom: '0px' } }
    } else {
      isMoreActionsMenuOpen.value = { id: itemId, position }
    }
  }
}

const handleClickOutside = (event) => {
  const menu = event.target.closest('.more-actions-menu')
  const button = event.target.closest('.more-btn')
  if (!menu && !button) {
    isMoreActionsMenuOpen.value = {}
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
    <click-icon :showIcon="showIcon"></click-icon>
    <div class="container-header">
      <h2 class="title" :class="activeWindow === 'main' && 'active'">Saved passwords</h2>
      <div
        class="search-input-container"
        v-if="savedPasswords.length"
        :class="activeWindow === 'saved' && 'visible'"
      >
        <search-icon></search-icon>
        <input class="search-input" type="text" placeholder="Search" v-model="searchInput" />
      </div>
    </div>

    <div
      class="saved-passwords-empty"
      :class="activeWindow === 'saved' && 'visible'"
      v-if="savedPasswords.length === 0"
    >
      <p class="text">You don't have any saved passwords yet</p>
    </div>
    <ul class="saved-passwords-list" :class="activeWindow === 'saved' && 'visible'" v-else>
      <simplebar
        :style="{
          maxHeight: '100%',
          height: '100%',
        }"
      >
        <li v-for="item in filteredPasswords" :key="item" class="saved-passwords-item">
          <input class="data" :value="item.url" type="url" />
          <input class="data" :value="item.password" :type="item.isVisible ? 'text' : 'password'" />
          <div class="btns">
            <button
              class="show-btn"
              :class="isDeleting && 'disabled'"
              type="button"
              @click="showPassword(item.id)"
            >
              <show-password-icon :isActive="isIconActive[item.id]"></show-password-icon>
            </button>
            <button
              class="copy-btn"
              :class="isDeleting && 'disabled'"
              type="button"
              @click="onCopy(item.password)"
            >
              <copy-icon></copy-icon>
            </button>
            <button
              class="delete-btn"
              :class="isDeleting && 'disabled'"
              type="button"
              @click="deletePassword(item.id)"
            >
              <template v-if="!isDeleting"><delete-icon></delete-icon></template>
              <template v-else><loading-icon></loading-icon></template>
            </button>
            <button class="more-btn" type="button" @click="toggleMoreActionsMenu(item.id, $event)">
              <dots-icon></dots-icon>
            </button>
          </div>

          <div class="more-actions-menu visible" v-if="isMoreActionsMenuOpen.id === item.id">
            <button
              class="show-btn mobile"
              :class="isDeleting && 'disabled'"
              type="button"
              @click="showPassword(item.id)"
            >
              <show-password-icon :isActive="isIconActive[item.id]"></show-password-icon>
            </button>
            <button
              class="copy-btn mobile"
              :class="isDeleting && 'disabled'"
              type="button"
              @click="onCopy(item.password)"
            >
              <copy-icon></copy-icon>
            </button>
            <button
              class="delete-btn mobile"
              :class="isDeleting && 'disabled'"
              type="button"
              @click="deletePassword(item.id)"
            >
              <template v-if="!isDeleting"><delete-icon></delete-icon></template>
              <template v-else><loading-icon></loading-icon></template>
            </button>
          </div>
        </li>
      </simplebar>
    </ul>
  </div>
  <div class="copy-popup" :class="isCopied && 'visible'">
    <div class="copy-popup-container">
      <p class="message clipboard">Copied to clipboard</p>
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

.container-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  text-transform: uppercase;
  transition: transform 0.5s ease-in-out;
}

.search-input-container {
  position: relative;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  pointer-events: none;
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.search-input-container.visible {
  opacity: 1;
  pointer-events: all;
}

.search-input {
  padding: 10px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  background-color: var(--color-background);
  outline: none;
  width: 200px;
  transition: opacity 0.5s ease-in-out;
  color: #fff;
}

.search-input::placeholder {
  color: #c2c2c2;
}

.search-icon {
  cursor: pointer;
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
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
}

.saved-passwords-empty.visible {
  opacity: 1;
}

.text {
  text-align: center;
}

.saved-passwords-list {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  align-self: center;
  width: 100%;
  height: 100%;
  list-style: none;
  padding: 0;
  max-height: 344px;
  height: 100%;
  opacity: 0;
  overflow-y: auto;
  pointer-events: none;
}

.saved-passwords-list.visible {
  opacity: 1;
  pointer-events: all;
}

.saved-passwords-item {
  display: flex;
  column-gap: 10px;
  margin-bottom: 10px;
  position: relative;
}

.saved-passwords-item:last-of-type {
  margin-bottom: 0;
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
  position: relative;
}

.btns {
  display: flex;
  column-gap: 5px;
}

.delete-btn,
.copy-btn,
.show-btn,
.more-btn {
  padding: 12px 12px;
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
  background-color: #c2c2c2;
  pointer-events: none;
}

.more-btn {
  background-color: rgb(78, 78, 78);
  display: none;
}

.more-actions-menu {
  display: none;
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
.copy-popup.visible,
.success-popup.visible {
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

@media screen and (max-width: 768px) {
  .container {
  }

  .title {
    font-size: 16px;
  }

  .search-input {
    width: 170px;
  }

  .saved-passwords-item {
    column-gap: 5px;
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: var(--window-padding-mobile);
  }

  .container-header {
    flex-direction: column;
    row-gap: 10px;
  }

  .search-input-container {
    position: relative;
    align-self: flex-start;
    width: 100%;
    flex-direction: row-reverse;
  }

  .search-input {
    max-width: 340px;
    width: 100%;
  }

  .search-icon {
    top: 15px;
    left: 190px;
    transform: translate(-50%, -50%);
  }

  .more-actions-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    gap: 10px;
    top: 43px;
    right: 0;
    z-index: 1;
    background-color: rgb(78, 78, 78);
    border-radius: 5px;
    padding: 10px;
    z-index: 30;
  }

  .more-actions-menu.visible {
    display: flex;
  }

  .more-btn {
    display: flex;
  }

  .delete-btn,
  .copy-btn,
  .show-btn {
    display: none;
  }

  .delete-btn,
  .copy-btn,
  .show-btn,
  .more-btn {
    padding: 8px;
  }

  .delete-btn.mobile,
  .copy-btn.mobile,
  .show-btn.mobile {
    display: flex;
  }
}
</style>
