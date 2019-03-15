<template>
  <el-breadcrumb v-if="!isDashboard"
    class="tiny-breadcrumb"
    separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList"
        :key="item.path"
        v-if='item.meta.title'>
        <span v-if='item.redirect==="noredirect"||index==levelList.length-1'
          class="no-redirect">{{generateTitle(item.meta.title)}}</span>
        <router-link v-else
          :to="item.redirect||item.path">{{generateTitle(item.meta.title)}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/i18n';

export default {
  created() {
    this.getBreadcrumb();
  },
  data() {
    return {
      levelList: null,
      isDashboard: false
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      const first = matched[0];
      this.isDashboard = false;
      if (first && first.name !== 'dashboard') {
        matched = [
          {
            path: '/dashboard',
            meta: {
              title: 'dashboard'
            }
          }
        ].concat(matched);
      } else {
        this.isDashboard = true;
      }
      this.levelList = matched;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.tiny-breadcrumb {
  font-size: 13px;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  overflow: hidden;
  zoom: 1;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
