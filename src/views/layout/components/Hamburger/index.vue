<template>
  <i class="sidebar-fold"
    @click="toggleClick">
    <svg-icon v-if="isActive"
      icon-class="outdent" />
    <svg-icon v-else
      icon-class="indent" />
  </i>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
};
</script>
