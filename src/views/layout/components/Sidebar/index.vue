<template>
  <el-menu mode="vertical"
    :show-timeout="200"
    :unique-opened="true"
    :default-active="$route.path"
    :collapse="isCollapse"
    background-color="#273345"
    text-color="#b8c3cc"
    active-text-color="#429dfb">
    <sidebar-item :routes="permission_routers"></sidebar-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
