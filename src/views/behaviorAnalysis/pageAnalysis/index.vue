<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.pageAnalysis')}}</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 页面名称查询 -->
      <el-form-item :label="this.$t('views.pageName')"
        prop="name">
        <el-input v-model="pageName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('please.pageName')"
          clearable></el-input>
      </el-form-item>
      <!-- 时间选择 -->
      <el-form-item prop="name"
        :label="this.$t('views.date')">
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
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{$t('table.query')}}</el-button>
      </el-form-item>
      <!-- 导出模块 -->
      <el-form-item label="">
        <export-excel id="test"
          ref="exportExcelChild"
          :columns='columns'
          :list='listExcel'
          @initExcelList='initExcelList'></export-excel>
      </el-form-item>
    </el-form>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :default-sort="columnSort"
      @sort-change="sortChange"
      :column-type="['index']"
      :column-type-props="columnTypeProps"
      :column-key-map="{ label: 'name' }"
      :data="list"
      :columns-handler="columnsHandler"
      :columns="columns">
    </egrid>
    <!-- 表格分页 -->
    <el-pagination v-if="total !== 0"
      class="tiny-pagination"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 40]"
      :current-page="currentPage">
    </el-pagination>
    <!-- 弹窗走向详情 -->
    <el-dialog :title="towardsTitle"
      top="10vh"
      :visible.sync="visibleShow"
      width="80%">
      <table-form v-if="visibleShow"
        :url="pageRelationUrl"
        :name="pageRelationName"></table-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleShow = false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗趋势图 -->
    <el-dialog :title="trendTitle"
      top="10vh"
      :visible.sync="visibleShowChart"
      width="80%">
      <line-chart v-if="visibleShowChart"
        :url="pageRelationUrl"
        :newDate="date"></line-chart>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleShowChart=false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableForm from './_components/tableForm';
import lineChart from './_components/lineChart';
import columnTowards from './_components/columnTowards';
import columnLineChart from './_components/columnLineChart';
import columnStyle from './_components/columnStyle';
import behaviorApi from '@/api/behavior';
import mixin from '@/utils/mixin';
import ExportExcel from '@/components/ExportExcel/index';
export default {
  name: 'pageAnalysis',
  mixins: [mixin],
  components: {
    tableForm,
    lineChart,
    ExportExcel
  },
  data() {
    return {
      columnSort: {
        prop: '',
        order: ''
      },
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      pageName: '',
      list: [],
      listExcel: [],
      total: 0,
      visibleShow: false,
      visibleShowChart: false,
      pageRelationUrl: '',
      pageRelationName: '',
      towardsTitle: '',
      trendTitle: '',
      listLoading: false,
      currentPage: 1,
      pageSize: 10
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
        {
          name: this.$t('views.pageName'),
          prop: 'pageName',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.pageViewTimes'),
          prop: 'pageViewTimes',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('views.pageViewPercent'),
          prop: 'pageViewPercent',
          align: 'center'
        },
        {
          name: this.$t('views.deviceViewNum'),
          prop: 'deviceViewTimes',
          align: 'center',
          sortable: 'custom'
        },
        // {
        //   name: this.$t('views.deviceViewPercent'),
        //   prop: 'deviceViewPercent',
        //   width: 150,
        //   align: 'center'
        // },
        {
          name: this.$t('views.sumTimes'),
          prop: 'sumTime',
          align: 'center',
          sortable: 'custom',
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        {
          name: this.$t('views.avgTimes'),
          prop: 'avgTime',
          align: 'center',
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        {
          name: this.$t('views.leaveNumProportion'),
          prop: 'leavePercent',
          align: 'center'
        }
      ];
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    query() {
      this.currentPage = 1;
      this.init();
    },
    columnsHandler(cols) {
      const _that = this;
      return cols.concat(
        {
          width: 80,
          fixed: 'right',
          label: this.$t('views.towards'),
          align: 'center',
          component: columnTowards,
          listeners: {
            'get-towards'(row) {
              _that.getTowards(row);
            }
          }
        },
        {
          width: 80,
          fixed: 'right',
          label: this.$t('views.operation'),
          align: 'center',
          component: columnLineChart,
          listeners: {
            'get-trend'(row) {
              _that.getTrend(row);
            }
          }
        }
      );
    },
    getTowards(row) {
      this.pageRelationUrl = row.pageUrl;
      this.pageRelationName = row.pageName;
      this.towardsTitle =
        row.pageName === '' ? row.pageUrl + '走向' : row.pageName + '走向';
      this.visibleShow = true;
    },
    getTrend(row) {
      this.pageRelationUrl = row.pageUrl;
      this.trendTitle =
        row.pageName === '' ? row.pageUrl + '趋势图' : row.pageName + '趋势图';
      this.visibleShowChart = true;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.pageName = '';
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.pageName = '';
      this.init();
    },
    sortChange(column) {
      this.columnSort.prop = column.prop;
      this.columnSort.order = column.order;
      if (this.total <= 0) {
        return;
      }
      this.init();
    },
    modify(val) {
      if (val === '' || val === null || val === undefined) {
        return '未知';
      } else {
        return val;
      }
    },
    change(val) {
      if (val === '' || val === null || val === undefined) {
        return '-';
      } else {
        return val;
      }
    },
    init() {
      // 查询表格数据
      this.listLoading = true;
      const data = {
        prop: this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        startDate: this.startDate,
        endDate: this.endDate,
        pageName: this.pageName,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      behaviorApi
        .pageTable(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.pageName = this.modify(item.pageName);
              item.pageViewTimes = this.change(item.pageViewTimes);
              item.pageViewPercent = this.change(item.pageViewPercent);
              item.deviceViewTimes = this.change(item.deviceViewTimes);
              item.sumTime = this.change(item.sumTime);
              item.avgTime = this.change(item.avgTime);
              item.leavePercent = this.change(item.leavePercent);
              return item;
            });
            this.listLoading = false;
          } else {
            this.total = 0;
            this.list = [];
            this.listLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    initExcelList() {
      // 导出表格数据
      const data = {
        prop: this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        pageName: this.pageName
      };
      if (this.total <= 0) {
        this.$message.warning('数据为空,不能执行导出操作');
        this.$refs.exportExcelChild.downloadLoading = false;
      } else {
        behaviorApi
          .pageTable(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
              this.listExcel = res.robj.items;
            } else {
              this.listExcel = [];
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

