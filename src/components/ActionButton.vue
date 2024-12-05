<script setup></script>

<template>
  <button class="action-button" type="button">
    <slot></slot>
  </button>
</template>

<style scoped>
.action-button {
  padding: 10px 10px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  outline: none;
  cursor: pointer;
  background-color: var(--color-background);
  transition: background-color 0.3s ease-in-out;
  grid-area: generate-btn;
  display: flex;
  justify-content: center;
  justify-self: flex-end;
}

@media screen and (max-width: 480px) {
  .action-button {
    justify-self: auto;
  }
}
</style>
