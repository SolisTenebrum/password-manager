<script setup>
import { onMounted, ref } from 'vue'
import PasswordForm from './PasswordForm.vue'
import SavedPasswords from './SavedPasswords.vue'
import { generateUniqueId } from '../utils/utils'
import { simulateServerRequest } from '../utils/utils'

const savedPasswords = ref([])
const activeWindow = ref('main')
const zIndexMain = ref(2)
const zIndexSaved = ref(1)
const showIcon = ref(false)
const isLoading = ref(false)
const isDeleting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const popupSuccessMessage = ref('')
const popupErrorMessage = ref('')
const generationInfoMessage = ref('')
const formData = ref({
  id: '',
  url: '',
  password: '',
})

const updateFormData = (data) => {
  formData.value = data
}

const updateGenerationInfoMessage = (message) => {
  generationInfoMessage.value = message
}

const setMainActive = () => {
  if (activeWindow.value === 'main') return
  zIndexMain.value++
  activeWindow.value = 'main'
}

const setSavedActive = () => {
  if (activeWindow.value === 'saved') return
  zIndexSaved.value++
  activeWindow.value = 'saved'
  showIcon.value = false
}

const addPassword = async (data) => {
  isLoading.value = true

  try {
    await simulateServerRequest('Connection error')

    const newPassword = { ...data, id: generateUniqueId() }
    savedPasswords.value.push(newPassword)
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords.value))
    successMessage.value = 'Password saved successfully'

    formData.value = { id: '', url: '', password: '' }

    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error(error)
    if (error === 'Connection error') {
      errorMessage.value = 'Connection error'
    } else {
      errorMessage.value = 'Failed to save password'
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false
      setTimeout(() => {
        errorMessage.value = ''
      }, 1000)
    }, 1000)
  }
}

const deletePassword = async (id) => {
  isDeleting.value = true

  try {
    await simulateServerRequest('Failed to delete password. Try again later')

    savedPasswords.value = savedPasswords.value.filter((item) => item.id !== id)
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords.value))

    popupSuccessMessage.value = 'Password deleted successfully'
    popupErrorMessage.value = ''
  } catch (error) {
    popupErrorMessage.value = error
    popupSuccessMessage.value = ''
  } finally {
    setTimeout(() => {
      isDeleting.value = false
      setTimeout(() => {
        popupSuccessMessage.value = ''
        popupErrorMessage.value = ''
      }, 1000)
    }, 1000)
  }
}

onMounted(() => {
  setTimeout(() => {
    if (activeWindow.value === 'saved' || localStorage.getItem('isFirstEntry')) return
    showIcon.value = true

    localStorage.setItem('isFirstEntry', false)
  }, 3000)

  if (localStorage.getItem('savedPasswords')) {
    savedPasswords.value = JSON.parse(localStorage.getItem('savedPasswords'))
  }
})
</script>

<template>
  <section class="windows">
    <div
      class="main-window"
      @click="setMainActive"
      :style="{ 'z-index': zIndexMain }"
      :class="{ 'main-window_active': activeWindow === 'main' }"
    >
      <PasswordForm
        :activeWindow="activeWindow"
        :showIcon="showIcon"
        :savedPasswords="savedPasswords"
        :addPassword="addPassword"
        :isLoading="isLoading"
        :errorMessage="errorMessage"
        :formData="formData"
        @updateFormData="updateFormData"
        :successMessage="successMessage"
        :generationInfoMessage="generationInfoMessage"
        @updateGenerationInfoMessage="updateGenerationInfoMessage"
        :updateGenerationInfoMessage="updateGenerationInfoMessage"
      />
    </div>

    <div
      class="saved-window"
      @click="setSavedActive"
      :style="{ 'z-index': zIndexSaved }"
      :class="{ 'saved-window_active': activeWindow === 'saved' }"
    >
      <SavedPasswords
        :activeWindow="activeWindow"
        :showIcon="showIcon"
        :savedPasswords="savedPasswords"
        :deletePassword="deletePassword"
        :isDeleting="isDeleting"
        :popupSuccessMessage="popupSuccessMessage"
        :popupErrorMessage="popupErrorMessage"
      />
    </div>
  </section>
</template>

<style scoped>
.windows {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.main-window,
.saved-window {
  max-width: 700px;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-38%, -64%);
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s ease-in-out 0.2s;
  opacity: 0.7;
  cursor: pointer;
  padding: 15px;
  height: 500px;
}

.main-window_active,
.saved-window_active {
  transform: translate(-50%, -50%);
  opacity: 1;
  cursor: default;
}

@media screen and (max-width: 768px) {
  .main-window,
  .saved-window {
    transform: translate(-50%, -67%) scale(0.9);
  }

  .main-window_active,
  .saved-window_active {
    transform: translate(-50%, -50%);
  }
}
</style>
