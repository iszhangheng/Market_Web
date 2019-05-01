<template>
  <div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <span @click="chartCut('barchart')"
        :class="{current:groupItem ==='barchart'}">
        <svg-icon icon-class="barCharts" /></span>
      <span @click="chartCut('piechart')"
        :class="{current:groupItem ==='piechart'}">
        <svg-icon icon-class="pieCharts" /></span>
      <!-- <span @click="chartCut('linechart')"
        :class="{current:groupItem ==='linechart'}">
        <svg-icon icon-class="lineCharts" /></span> -->
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
      <h4>{{this.$t('date.history')}}</h4>
      <!-- 昨日统计表格 -->
      <egrid v-loading.body="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :column-key-map="{ label: 'name' }"
        :data="listSum"
        :columns="columnsHistory">
      </egrid>
    </div>
    <div v-if="groupItem === 'barchart'">
      <bar-Chart :date="date"
        ref="barChild"></bar-Chart>
    </div>
    <div v-if="groupItem === 'piechart'">
      <pie-Chart></pie-Chart>
    </div>
    <!-- <div v-if="groupItem === 'linechart'">
      <line-Chart :date="date"></line-Chart>
    </div> -->
  </div>
</template>
<script>
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
import barChart from './_components/barChart';
import pieChart from './_components/pieChart';
// import lineChart from './_components/lineChart';
export default {
  name: 'regSex',
  mixins: [mixin],
  props: ['date'],
  components: {
    barChart,
    pieChart
    // lineChart
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
        { name: this.$t('views.nums'), prop: 'total', align: 'center' },
        { name: this.$t('views.man'), prop: 'man', align: 'center' },
        { name: this.$t('views.woman'), prop: 'woman', align: 'center' },
        { name: this.$t('views.mystery'), prop: 'mystery', align: 'center' },
        {
          name: this.$t('views.statisticDate'),
          prop: 'dateType',
          align: 'center'
        }
      ];
    },
    columnsHistory() {
      return [
        // 表头数据
        { name: this.$t('views.nums'), prop: 'total', align: 'center' },
        { name: this.$t('views.man'), prop: 'man', align: 'center' },
        { name: this.$t('views.woman'), prop: 'woman', align: 'center' },
        { name: this.$t('views.mystery'), prop: 'mystery', align: 'center' }
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
    this.initTable();
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
      userApi
        .registerSex(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.list = res.robj.items.map(item => {
              if (item.total === 0) {
                item.man = item.man + ' | ' + '0.00%';
                item.woman = item.woman + ' | ' + '0.00%';
                item.mystery = item.mystery + ' | ' + '0.00%';
              } else {
                item.man = item.man + ' | ' + item.manPercent;
                item.woman = item.woman + ' | ' + item.womanPercent;
                item.mystery = item.mystery + ' | ' + item.mysteryPercent;
              }
              return item;
            });
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
    },
    initTable() {
      this.listLoading = true;
      // 查询数据库获取表格信息
      const data = {
        startDate: '',
        endDate: ''
      };
      userApi
        .registerSexSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.listSum = res.robj.items.map(item => {
              item.man = item.man + ' | ' + item.manPercent;
              item.woman = item.woman + ' | ' + item.womanPercent;
              item.mystery = item.mystery + ' | ' + item.mysteryPercent;
              return item;
            });
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
