<template>
  <div class="tiny-wrap"
    :class="{hideSidebar:!sidebar.opened}">
    <div class="tiny-sidebar">
      <div class="tiny-logo">
        <router-link to="/">
          <img class="logo-max"
            v-if="sidebar.opened"
            src="../../assets/images/sunline_logo.png">
          <img class="logo-mini"
            v-else
            src="../../assets/images/sunline_logo_mini.png">
        </router-link>
      </div>
      <sidebar class="sidebar-container"></sidebar>
    </div>
    <div class="tiny-layout">
      <app-header></app-header>
      <app-main class="tiny-layout-content"></app-main>
      <div class="tiny-layout-footer"></div>
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain, AppHeader } from '@/views/layout/components';
export default {
  name: 'layout',
  components: {
    Sidebar,
    AppMain,
    AppHeader
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  }
};
</script>
