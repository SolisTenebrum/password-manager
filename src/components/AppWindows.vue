<script setup>
import { onMounted, ref } from 'vue';
import PasswordForm from './PasswordForm.vue';
import SavedPasswords from './SavedPasswords.vue';
import { generateUniqueId } from '../utils/utils'

const savedPasswords = ref([]);
const activeWindow = ref('main');
const zIndexMain = ref(2);
const zIndexSaved = ref(1);
const showIcon = ref(false)
const isLoading = ref(false)
const isDeleting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const generationInfoMessage = ref('')
const popupMessage = ref('')
const formData = ref({
  id: '',
  url: '',
  password: ''
});


const updateFormData = (data) => {
  formData.value = data
}

const updateGenerationInfoMessage = (message) => {
  generationInfoMessage.value = message
}

const setMainActive = () => {
  if (activeWindow.value === 'main') return;
  zIndexMain.value++;
  activeWindow.value = 'main';
}

const setSavedActive = () => {
  if (activeWindow.value === 'saved') return;
  zIndexSaved.value++;
  activeWindow.value = 'saved';
  showIcon.value = false
}

const addPasword = async (data) => {
  isLoading.value = true
  const randomChanceToConnect = Math.floor(Math.random() * 10)
  if (randomChanceToConnect > 5) {
    try {
      const newPassword = { ...data, id: generateUniqueId() }
      savedPasswords.value.push(newPassword)
      localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords.value))
      successMessage.value = 'Password saved successfully'
      setTimeout(() => {
        successMessage.value = ''
      }, 2000)
    } catch {
      errorMessage.value = 'Failed to save password'
    } finally {
      setTimeout(() => {
        isLoading.value = false
        errorMessage.value = ''
      }, 1000)
    }
  } else {
    errorMessage.value = 'Connection error'
    isLoading.value = false
    setTimeout(() => {
      errorMessage.value = ''
    }, 1000)
  }
}

const deletePassword = (id) => {
  isDeleting.value = true
  const randomChanceToConnect = Math.floor(Math.random() * 10)
  if (randomChanceToConnect > 5) {
    try {
      savedPasswords.value = savedPasswords.value.filter(item => item.id !== id);
      localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords.value));
    } catch {
      popupMessage.value = 'Failed to delete password. Try again later';
    } finally {
      setTimeout(() => {
        isDeleting.value = false;
        popupMessage.value = '';
      }, 1000);
    }
  } else {
    popupMessage.value = 'Failed to delete password. Try again later';
    isDeleting.value = false;
    setTimeout(() => {
      popupMessage.value = '';
    }, 1000);
  }
}


onMounted(() => {
  setTimeout(() => {
    if (activeWindow.value === 'saved' || localStorage.getItem('isFirstEntry')) return;
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
    <div class="main-window" @click="setMainActive" :style="{ 'z-index': zIndexMain }"
      :class="{ 'main-window_active': activeWindow === 'main' }">
      <PasswordForm :activeWindow="activeWindow" :savedPasswords="savedPasswords" :addPassword="addPasword"
        :isLoading="isLoading" :errorMessage="errorMessage" :formData="formData" @updateFormData="updateFormData"
        :successMessage="successMessage" :generationInfoMessage="generationInfoMessage"
        @updateGenerationInfoMessage="updateGenerationInfoMessage"
        :updateGenerationInfoMessage="updateGenerationInfoMessage" />
    </div>

    <div class="saved-window" @click="setSavedActive" :style="{ 'z-index': zIndexSaved }"
      :class="{ 'saved-window_active': activeWindow === 'saved' }">
      <SavedPasswords :activeWindow="activeWindow" :showIcon="showIcon" :savedPasswords="savedPasswords"
        :deletePassword="deletePassword" :isDeleting="isDeleting" :popupMessage="popupMessage" />
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
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out 0.2s;
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
</style>
