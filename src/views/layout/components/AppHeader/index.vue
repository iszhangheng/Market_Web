<template>
  <div class="tiny-header">
    <hamburger :toggleClick="toggleSideBar"
      :isActive="sidebar.opened"></hamburger>
    <div v-if="avatar"
      class="header-avator-con">
      <el-dropdown trigger="hover">
        <div class="avatar-wrapper">
          <img class="user-avatar"
            :src="avatar">
          <span>{{name}}</span>
        </div>
        <el-dropdown-menu class="user-dropdown"
          slot="dropdown">
          <el-dropdown-item>
            <span @click="logout"
              style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <lang-select></lang-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LangSelect from '@/views/layout/components/LangSelect';
import Hamburger from '@/views/layout/components/Hamburger';
export default {
  components: {
    Hamburger,
    LangSelect
  },
  computed: {
    ...mapGetters(['avatar', 'name']),
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    }
  }
};
</script>