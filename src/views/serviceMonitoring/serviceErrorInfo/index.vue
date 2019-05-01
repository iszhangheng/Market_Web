<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.serviceErrorInfo')}}</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 查询框 -->
      <el-form-item :label="this.$t('views.errorMsg')"
        prop="name">
        <el-input v-model="errorMsg"
          @keyup.enter.native="query()"
          :placeholder="this.$t('please.errorMsg')"
          clearable></el-input>
      </el-form-item>
      <!-- 时间选择框 -->
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
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      :current-page="currentPage">
    </el-pagination>
    <!--  服务错误信息明细弹框 -->
    <el-dialog :title="this.$t('title.errorMsgTable')"
      top="10vh"
      :visible.sync="visibleShowTable"
      width="60%">
      <table-form v-if="visibleShowTable"
        :error="error"
        :date="date"></table-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleShowTable=false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--  错误信息折线图弹框 -->
    <el-dialog :title="this.$t('title.errorMsgChart')"
      top="10vh"
      :visible.sync="visibleShowChart"
      width="80%">
      <line-chart v-if="visibleShowChart"
        :newdate="date"
        :error="error"></line-chart>
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
import columnException from './_components/columnException';
import columnLineChart from './_components/columnLineChart';
import tableForm from './_components/tableForm';
import lineChart from './_components/lineChart';
import serviceMonitoringApi from '@/api/serviceMonitoring';
import ExportExcel from '@/components/ExportExcel/index';
import mixin from '@/utils/mixin';
export default {
  name: 'serviceErrorInfo',
  mixins: [mixin],
  components: {
    tableForm,
    lineChart,
    ExportExcel
  },
  data() {
    return {
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      name: '前置调用',
      errorMsg: '',
      columnSort: {
        prop: 'num',
        order: 'descending'
      },
      visibleShowChart: false,
      visibleShowTable: false,
      error: '',
      list: [],
      listExcel: [],
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
      var _that = this;
      return [
        { name: this.$t('views.serviceName'), prop: 'serviceName', width: 120 },
        {
          name: this.$t('views.errorMsg'),
          prop: 'errorMsg',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.Num'),
          width: 100,
          align: 'center',
          prop: 'num',
          sortable: 'custom',
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnException,
          listeners: {
            'custom-event'(row) {
              _that.customEvent(row.errorMsg, row.invokeDay);
            }
          }
        }
        // {
        //   name: this.$t('views.invokeDay'),
        //   width: 120,
        //   align: 'center',
        //   prop: 'invokeDay'
        // }
      ];
    }
  },
  created() {
    if (this.$route.query.date && this.$route.query.name) {
      this.date = [
        // 将字符串转化为Date对象
        this.$moment(this.$route.query.date),
        this.$moment(this.$route.query.date)
      ];
      this.name = this.$route.query.name;
      this.initTableData();
    } else {
      this.initTableData();
    }
  },
  methods: {
    query() {
      this.currentPage = 1;
      this.initTableData();
    },
    customEvent(error, invokeDay) {
      this.error = error;
      this.invokeDay = invokeDay;
      this.visibleShowTable = true;
    },
    columnsHandler(cols) {
      const that = this;
      return cols.concat({
        width: 80,
        fixed: 'right',
        label: this.$t('views.operation'),
        align: 'center',
        component: columnLineChart,
        listeners: {
          'get-msg'(row) {
            that.getMsg(row.errorMsg);
          }
        }
      });
    },
    getMsg(error) {
      this.error = error;
      this.visibleShowChart = true;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.errorMsg = '';
      this.initTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.errorMsg = '';
      this.initTableData();
    },
    sortChange(column) {
      this.columnSort.prop = column.prop;
      this.columnSort.order = column.order;
      if (this.total <= 0) {
        return;
      }
      this.initTableData();
    },
    initTableData() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        prop:
          this.columnSort.prop === 'invokeDay'
            ? 'invoke_day'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        errorMsg: this.errorMsg
      };
      serviceMonitoringApi
        .serviceErrorInfo(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.serviceName = this.name;
              return item;
            });
            this.listLoading = false;
          } else {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
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
          this.columnSort.prop === 'invokeDay'
            ? 'invoke_day'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        startDate: this.startDate,
        endDate: this.endDate,
        errorMsg: this.errorMsg
      };
      serveApi
        .serviceErrorInfo(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.listExcel = res.robj.items.map(item => {
              item.serviceName = this.name;
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
<style lang="scss" scoped>
</style>
