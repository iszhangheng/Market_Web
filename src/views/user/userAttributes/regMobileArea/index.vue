<template>
  <div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <span @click="chartCut('piechart')"
        :class="{current:groupItem ==='piechart'}">
        <svg-icon icon-class="pieCharts" /></span>
    </div>
    <div v-show="groupItem === 'table'">
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :column-key-map="{ label: 'name' }"
      :data="list"
      :columns="columns">
    </egrid>
    <!-- 表格分页 -->
    <el-pagination v-if="total !== 0"
      class="tiny-pagination"
      @current-change="handleCurrentChange"
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage">
    </el-pagination>
    </div>
    <div v-if="groupItem === 'piechart'">
      <map-Chart></map-Chart>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
import mapChart from './_components/mapChart';
export default {
  name: 'regArea',
  mixins: [mixin],
  props: ['date', 'condition'],
  components: {
    mapChart
  },
  data() {
    return {
      groupItem: 'table',
      list: [],
      total: 0,
      listLoading: false,
      currentPage: 1, // 当前页码
      pageSize: 10 // 页面大小
    };
  },
  computed: {
    columns() {
      return [
        // 表头数据
        { name: this.$t('views.province'), prop: 'province' },
        { name: this.$t('views.city'), prop: 'city' },
        { name: this.$t('views.area'), prop: 'area' },
        { name: this.$t('views.num'), prop: 'num' },
        { name: this.$t('views.statisticDate'), prop: 'dateType' }
      ];
    },
    verify() {
      return JSON.stringify(this.condition);
    }
  },
  watch: {
    // date() {
    //   this.init();
    // },
    condition: {
      deep: true,
      handler() {
        this.condition = this.condition;
        this.init();
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    chartCut(name) {
      this.groupItem = name;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    init() {
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        province:
          this.condition.dataProvince === '省'
            ? ''
            : this.condition.dataProvince,
        city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
        area: this.condition.dataArea === '区' ? '' : this.condition.dataArea
      };
      userApi
        .userMobileArea(data)
        .then(res => {
          this.list = res.robj.items;
          this.total = res.robj.total;
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>
