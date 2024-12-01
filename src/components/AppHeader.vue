<script setup>
</script>

<template>
  <header class="header">
    <div class="container">
      <h1 class="title">Password manager</h1>
    </div>
  </header>
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
</style>