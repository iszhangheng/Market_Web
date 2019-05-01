<template>
  <div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <span @click="chartCut('barchart')"
        :class="{current:groupItem ==='barchart'}">
        <svg-icon icon-class="barCharts" /></span>
      <span @click="chartCut('linechart')"
        :class="{current:groupItem ==='linechart'}">
        <svg-icon icon-class="lineCharts" /></span>
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
        :column-type="['index']"
        :column-type-props="columnTypeProps"
        :data="list"
        :columns="columns">
      </egrid>
      <!-- 表格分页 -->
      <el-pagination v-if="total !== 0"
        class="tiny-pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, prev, sizes, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 40]"
        :current-page="currentPage">
      </el-pagination>
    </div>
    <div v-if="groupItem === 'barchart'">
      <bar-Chart :date="date"
        ref="barChild"></bar-Chart>
    </div>
    <div v-if="groupItem === 'linechart'">
      <line-Chart :date="date"></line-Chart>
    </div>
    <div v-if="groupItem === 'piechart'">
      <pie-Chart :date="date"></pie-Chart>
    </div>
  </div>
</template>
<script>
import productApi from '@/api/product';
import mixin from '@/utils/mixin';
import barChart from './_components/barChart';
import lineChart from './_components/lineChart';
import pieChart from './_components/pieChart';
export default {
  name: 'dataSummary',
  mixins: [mixin],
  props: ['date'],
  components: {
    barChart,
    pieChart,
    lineChart
  },
  data() {
    return {
      groupItem: 'table',
      list: [],
      listSum: [],
      total: 0,
      listLoading: false,
      currentPage: 1, // 当前页码
      pageSize: 10 // 页面大小
    };
  },
  computed: {
    columnTypeProps() {
      return {
        index: {
          fixed: 'left',
          label: this.$t('views.index'),
          width: 50,
          align: 'center'
        }
      };
    },
    columns() {
      return [
        // 表头数据
        { name: this.$t('transactions.transactions'), prop: 'sumTotal', align: 'center' },
        { name: this.$t('transactions.amount'), prop: 'sumMoney', align: 'center' },
        { name: this.$t('transactions.clinchNum'), prop: 'sucTotal', align: 'center' },
        { name: this.$t('transactions.clinchAmount'), prop: 'sucMoney', align: 'center' },
        { name: this.$t('views.successRate'), prop: 'sucPercent', align: 'center' },
        { name: this.$t('transactions.failMoney'), prop: 'failMoney', align: 'center' },
        { name: this.$t('transactions.numFail'), prop: 'failTotal', align: 'center' },
        { name: this.$t('views.failureRate'), prop: 'failPercent', align: 'center' },
        {
          name: this.$t('views.statisticDate'),
          prop: 'date',
          align: 'center'
        }
      ];
    }
  },
  watch: {
    date() {
      this.init();
    }
  },
  created() {
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    init() {
      this.listLoading = true;
      // 查询数据库获取表格信息
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      productApi
        .dataSummary(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.list = res.robj.items;
            this.total = res.robj.total;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.total = 0;
            this.list = [];
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>
