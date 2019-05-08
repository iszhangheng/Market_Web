<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.pageAccess')}}</h3>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 查询框 -->
      <el-form-item :label="this.$t('views.pageName')"
        prop="name">
        <el-input v-model="pageName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('please.pageName')"
          clearable></el-input>
      </el-form-item>
      <!-- 时间查询 -->
      <el-form-item prop="name"
        :label="this.$t('views.dateType')">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          change="computeSumDay"
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
      :columns-handler="columnsHandler"
      :column-key-map="{ label: 'name' }"
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
    <!-- 修改员工信息 -->
    <el-dialog :title="urlTitle"
      top="10vh"
      :visible.sync="visibleShow"
      width="80%">
      
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleShow = false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗趋势图 -->
    <el-dialog :title="appUrlTitle"
      top="10vh"
      :visible.sync="visibleShowChart"
      width="80%">
      <line-chart v-if="visibleShowChart"
        :url="appUrl"
        :newdate="date"></line-chart>
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
import appApi from '@/api/app';
import columnLineChart from '@/views/app/appPage/_components/columnLineChart';
import columnTowards from '@/views/app/appPage/_components/columnTowards';
import lineChart from '@/views/app/appPage/_components/lineChart';
import tableForm from '@/views/app/appPage/_components/tableForm';
// import tableChart from './tableChart/index';
// import webTableChart from './webTableChart/index';
import mixin from '@/utils/mixin';
import ExportExcel from '@/components/ExportExcel/index';
export default {
  name: 'appPage',
  mixins: [mixin],
  components: {
    // tableChart,
    // webTableChart,
    tableForm,
    lineChart,
    ExportExcel
  },
  data() {
    return {
      urlTitle: '',
      appUrlTitle: '',
      appUrl: '',
      towardsName: '',
      visibleShowChart: false,
      visibleShow: false,
      listExcel: [],
      pageName: '',
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      columnSort: {
        prop: '',
        order: ''
      },
      list: [],
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
        {
          name: this.$t('views.pageName'),
          prop: 'currentName',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.Count'),
          prop: 'count',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('views.entryTimesProportion'),
          prop: 'countPercent',
          align: 'center'
        },
        {
          name: this.$t('views.users'),
          prop: 'users',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('views.userNumProportion'),
          prop: 'usersPercent',
          align: 'center'
        },
        {
          name: this.$t('views.sumTimes'),
          prop: 'sumTime',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('views.avgTimes'),
          prop: 'avgTime',
          align: 'center',
          sortable: 'custom'
          // propsHandler({ col, row, column }) {
          //   return {
          //     col,
          //     row,
          //     column,
          //     val: row[col.prop]
          //   };
          // },
          // component: columnStyle
        },
        {
          name: this.$t('views.leaveNum'),
          prop: 'leaveNum',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('views.leaveNumProportion'),
          prop: 'leaveNumPercent',
          align: 'center',
          sortable: 'custom'
        }
      ];
    }
  },
  mounted() {
    this.initTableData();
  },
  methods: {
    query() {
      this.currentPage = 1;
      this.initTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.pageName = '';
      this.initTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageName = '';
      this.initTableData();
    },
    sortChange(column) {
      if (this.total <= 0) {
        return;
      }
      this.columnSort.prop = column.prop;
      this.columnSort.order = column.order;
      this.initTableData();
    },
    columnsHandler(cols) {
      const that = this;
      return cols.concat(
        {
          width: 80,
          fixed: 'right',
          label: this.$t('views.towards'),
          align: 'center',
          component: columnTowards,
          // listeners 可用于监听自定义组件内部 $emit 出的事件
          listeners: {
            'get-table'(row) {
              that.getTable(row);
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
            'get-msg'(row) {
              that.getMsg(row);
            }
          }
        }
      );
    },
    getTable(row) {
      this.appUrl = row.currentUrl;
      this.urlTitle =
        row.currentName === ''
          ? row.currentUrl + '走向'
          : row.currentName + '走向';
      this.towardsName = row.appCurrentName;
      this.visibleShow = true;
    },
    getMsg(row) {
      this.appUrl = row.currentUrl;
      this.appUrlTitle =
        row.currentName === ''
          ? row.currentUrl + '趋势图'
          : row.currentName + '趋势图';
      this.visibleShowChart = true;
    },
    initTableData() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        prop:
          this.columnSort.prop === 'sumTime'
            ? 'sum_time'
            : this.columnSort.prop && this.columnSort.prop === 'avgTime'
            ? 'avg_time'
            : this.columnSort.prop && this.columnSort.prop === 'leaveNum'
            ? 'leave_num'
            : this.columnSort.prop && this.columnSort.prop === 'leaveNumPercent'
            ? 'leave_num_percent'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        pageName: this.pageName
      };
      appApi
        .appUrlSumTime(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.avgTime = item.avgTime + '/ms';
              item.sumTime = item.sumTime + '/ms';
              return item;
            });
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
    initExcelList() {
      // 导出数据请求
      const data = {
        prop:
          this.columnSort.prop === 'sumTime'
            ? 'sum_time'
            : this.columnSort.prop && this.columnSort.prop === 'avgTime'
            ? 'avg_time'
            : this.columnSort.prop && this.columnSort.prop === 'leaveNum'
            ? 'leave_num'
            : this.columnSort.prop && this.columnSort.prop === 'leaveNumPercent'
            ? 'leave_num_percent'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        startDate: this.startDate,
        endDate: this.endDate,
        pageName: this.pageName
      };
      appApi
        .appUrlSumTime(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.listExcel = res.robj.items.map(item => {
              item.avgTime = item.avgTime + 'ms';
              item.sumTime = item.sumTime + 'ms';
              return item;
            });
          } else {
            this.$message.warning('数据为空,不能执行导出操作');
            this.$refs.exportExcelChild.downloadLoading = false;
          }
        })
        .catch(res => {
          this.$message.error('导出数据请求失败');
        });
    }
  }
};
</script>

<style lang="scss" scope>
// ...
</style>


