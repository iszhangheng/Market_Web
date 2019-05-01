<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.psAdressCount')}}</h3>
    <!-- 时间选择 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
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
      <!-- 地区选择 -->
      <el-form-item :label="this.$t('date.area')">
        <v-distpicker class="el-area" name="Area"
          @province="onChangeProvince"
          @city="onChangeCity"
          @area="onChangeArea">
        </v-distpicker>
      </el-form-item>
      <!-- 查询按钮 -->
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{$t('table.query')}}</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName"
      style='width:100%'>
      <el-tab-pane :label="this.$t('views.tablechart')"
        name="tablechart">
        <table-chart
          :date="date" :condition="condition"
          ref="areaChild"></table-chart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import tableChart from './_components/tableChart';
import mixin from '@/utils/mixin';
import VDistpicker from 'v-distpicker';
export default {
  name: 'psAdressCount',
  mixins: [mixin],
  components: {
    tableChart,
    VDistpicker
  },
  data() {
    return {
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ], // 选中时间的值
      activeName: 'tablechart',
      condition: {
        dataProvince: '',
        dataCity: '',
        dataArea: ''
      }
    };
  },
  methods: {
    onChangeProvince(data) {
      this.condition.dataProvince = data.value;
    },
    onChangeCity(data) {
      this.condition.dataCity = data.value;
    },
    onChangeArea(data) {
      this.condition.dataArea = data.value;
    },
    query() {
      this.$refs.areaChild.init();
    }
  }
};
</script>
<style lang="scss">
// ...
.el-area {
  select {
    font-size: 12px;
    padding: 0 5px;
    height: 28px !important;
    line-height: 28px !important;
  }
}
</style>
