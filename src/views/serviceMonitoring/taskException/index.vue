<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.taskException')}}</h3>
    <!-- <el-form class="search-form"
      :inline="true"
      label-width="100px"
      size="mini">
      <el-form-item label="日期:"
        prop="name">
        <el-date-picker v-model="value"
          type="month"
          placeholder="选择月"></el-date-picker>
      </el-form-item>
    </el-form> -->
    <el-tabs v-model="activeName"
      @tab-click="handleClick"
      style='width:100%'>
      <el-tab-pane :label="$t('views.tablechart')"
        name="tablechart">
        <tableChart id='tetab'
        ></tableChart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import tableChart from './_components/tableChart';
export default {
  name: 'taskException',
  components: {
    tableChart
  },
  data() {
    return {
      // date: new Date(), // 选中时间的值
      activeName: 'tablechart'
    };
  },
  methods: {
    handleClick(tab, event) {}
  }
};
</script>
<style lang="scss" scoped>
// ...
</style>
