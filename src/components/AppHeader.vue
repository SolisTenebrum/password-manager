<script setup>
// import { onBeforeUnmount } from 'vue';
// import { onMounted } from 'vue';
// import { ref } from 'vue';

// const isBurgerMenuActive = ref(false);

// const toggleBurgerMenu = () => {
//   isBurgerMenuActive.value = !isBurgerMenuActive.value
// }

// const closeBurgerMenu = () => {
//   isBurgerMenuActive.value = false
// }

// const handleClickOutside = (event) => {
//   const menu = document.querySelector('.burger-menu')
//   const button = document.querySelector('.burger-button')

//   if (!menu.contains(event.target) && !button.contains(event.target)) {
//     closeBurgerMenu()
//   }
// }

// onMounted(() => {
//   document.addEventListener('click', handleClickOutside)
// })

// onBeforeUnmount(() => {
//   document.removeEventListener('click', handleClickOutside)
// })
</script>

<template>
  <header class="header">
    <div class="container">
      <!-- <div class="burger-button" @click="toggleBurgerMenu">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div> -->
      <h1 class="title">Password manager</h1>
    </div>
  </header>
  <!-- <div class="burger-menu" :class="{ active: isBurgerMenuActive }">
    <div class="burger-menu-wrapper">
      <p class="burger-menu-item">First </p>
      <p class="burger-menu-item">Second something</p>
      <p class="burger-menu-item">Third item</p>
      <p class="burger-menu-item">Fourth who</p>
    </div>
  </div> -->
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  padding: 0 10px 10px;
}

.container {
  padding: 20px 50px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  gap: 30px;
  border-bottom-left-radius: var(--corner-radius);
  border-bottom-right-radius: var(--corner-radius);
}

.title {
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 600;
  color: #000;
  user-select: none;
}

.burger-button {
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  user-select: none;
  width: 30px;
  position: relative;
}

.line {
  width: 26px;
  height: 3px;
  background-color: #000;
  border-radius: 30px;
}

.line:first-of-type {
  width: 30px;
}

.burger-menu {
  position: fixed;
  top: 0;
  left: 45px;
  width: 230px;
  z-index: 98;
  visibility: hidden;
  align-items: center;
  justify-content: center;
  transform: translateY(-100%);
  transition: transform 0.5s ease-in-out, visibility 0.5s ease-in-out, opacity 0.5s ease-in-out;
  opacity: 0;
}

.burger-menu.active {
  visibility: visible;
  transform: translateY(0);
  opacity: 1;
}

.burger-menu-wrapper {
  padding: 92px 50px 20px 50px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 21px;
  border-bottom-right-radius: var(--corner-radius);
  border-bottom-left-radius: var(--corner-radius);
}

.burger-menu-item {
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 500;
}
</style>