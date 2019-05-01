<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.psBkcodeCount')}}</h3>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 时间选择 -->
      <el-form-item prop="name"
      :label="this.$t('views.dateType')">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          :start-placeholder="this.$t('date.start')"
          :end-placeholder="this.$t('date.end')"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <!-- 查询按钮 -->
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{$t('table.query')}}</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName"
      @tab-click="handleClick"
      style='width:100%'>
      <el-tab-pane :label="this.$t('views.tablechart')"
        name="tablechart">
        <table-chart
          :date="date"
          ref="bkcodeChild"></table-chart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import tableChart from './_components/tableChart';
import mixin from '@/utils/mixin';
export default {
  name: 'psBkcodeCount',
  mixins: [mixin],
  components: {
    tableChart
  },
  data() {
    return {
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ], // 选中时间的值
      activeName: 'tablechart'
    };
  },
  methods: {
    handleClick(tab, event) {},
    query() {
      this.$refs.bkcodeChild.init();
    }
  }
};
</script>
<style lang="scss" scoped>
// ...
</style>