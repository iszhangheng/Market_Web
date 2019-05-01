<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.serviceInvokeMonitor')}}</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 查询框 -->
      <el-form-item :label="this.$t('views.serviceName')"
        prop="name">
        <el-input v-model="serviceName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('please.serviceName')"
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
    <!-- 折线图弹框 -->
    <el-dialog :title="serviceNameTitle"
      top="10vh"
      :visible.sync="visibleShowChart"
      width="80%">
      <line-chart v-if="visibleShowChart"
        :name="name"
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
import columnLineChart from './_components/columnLineChart';
import columnStyle from './_components/columnStyle';
import lineChart from './_components/lineChart';
import serviceMonitoringApi from '@/api/serviceMonitoring';
import ExportExcel from '@/components/ExportExcel/index';
import mixin from '@/utils/mixin';
export default {
  name: 'serviceInvokeMonitor',
  mixins: [mixin],
  components: {
    lineChart,
    ExportExcel
  },
  data() {
    return {
      listExcel: [],
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      columnSort: {
        prop: '',
        order: ''
      },
      serviceName: '',
      serviceNameTitle: '',
      visibleShowChart: false,
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
        // 表头数据
        { name: this.$t('views.serviceName'), prop: 'serviceName', width: 130 },
        {
          name: this.$t('views.total'),
          align: 'center',
          prop: 'total',
          sortable: 'custom',
          propsHandler({ col, row }) {
            return {
              col,
              row,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        {
          name: this.$t('views.success'),
          align: 'center',
          prop: 'success',
          sortable: 'custom',
          propsHandler({ col, row }) {
            return {
              col,
              row,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        {
          name: this.$t('views.fail'),
          align: 'center',
          prop: 'fail',
          sortable: 'custom',
          propsHandler({ col, row }) {
            return {
              col,
              row,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        {
          name: this.$t('views.successRate'),
          prop: 'successRate',
          align: 'center',
          sortable: 'custom',
          propsHandler({ col, row }) {
            return {
              col,
              row,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        {
          name: this.$t('views.invokeDay'),
          prop: 'invokeDay',
          sortable: 'custom',
          align: 'center'
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
    columnsHandler(cols) {
      const that = this;
      return cols.concat({
        width: 100,
        fixed: 'right',
        label: this.$t('views.operation'),
        align: 'center',
        component: columnLineChart,
        listeners: {
          'get-msg'(row) {
            that.getMsg(row.serviceName);
          }
        }
      });
    },
    getMsg(name) {
      this.name = name;
      this.serviceNameTitle = name;
      this.visibleShowChart = true;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.serviceName = '';
      this.initTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.serviceName = '';
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
            : this.columnSort.prop && this.columnSort.prop === 'successRate'
            ? 'success_rate'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        serviceName: this.serviceName
      };
      serviceMonitoringApi
        .serviceInvokeMonitor(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              if (item.total === 0) {
                item.total = 0;
              } else if (!item.total) {
                item.total = '-';
              }
              if (item.success === 0) {
                item.success = 0;
              } else if (!item.success) {
                item.success = '-';
              }
              if (item.fail === 0) {
                item.fail = 0;
              } else if (!item.fail) {
                item.fail = '-';
              }
              item.successRate = item.successRate + '%';
              return item;
            });
            this.listLoading = false;
          } else {
            this.total = 0;
            this.list = [];
            this.listLoading = false;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    // 导出数据请求
    initExcelList() {
      const data = {
        prop:
          this.columnSort.prop === 'invokeDay'
            ? 'invoke_day'
            : this.columnSort.prop && this.columnSort.prop === 'successRate'
            ? 'success_rate'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        startDate: this.startDate,
        endDate: this.endDate,
        serviceName: this.serviceName
      };
      serviceMonitoringApi
        .serviceInvokeMonitor(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.listExcel = res.robj.items.map(item => {
              if (item.total === 0) {
                item.total = 0;
              } else if (!item.total) {
                item.total = '-';
              }
              if (item.success === 0) {
                item.success = 0;
              } else if (!item.success) {
                item.success = '-';
              }
              if (item.fail === 0) {
                item.fail = 0;
              } else if (!item.fail) {
                item.fail = '-';
              }
              item.successRate = item.successRate + '%';
              return item;
            });
          } else {
            this.$message.warning('数据为空,不能执行导出操作');
            this.$refs.exportExcelChild.downloadLoading = false;
          }
        })
        .catch(res => {
          this.$message.error('导出数据请求失败!');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
