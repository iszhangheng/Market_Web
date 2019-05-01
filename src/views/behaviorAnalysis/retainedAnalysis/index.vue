<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.retainedAnalysis')}}</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
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
          icon="el-icon-search">{{this.$t('table.query')}}</el-button>
      </el-form-item>
      <!-- 导出模块 -->
      <el-form-item label="">
        <export-excel id="test"
          ref="exportExcelChild"
          :columns="columns"
          :list="listExcel"
          @initExcelList="initExcelList"></export-excel>
      </el-form-item>
    </el-form>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loadng"
      border
      fit
      highlight-current-row
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
    <el-dialog :title="retainedTitle"
      top="10vh"
      :visible.sync="visibleShowChart"
      width="80%">
      <line-chart v-if="visibleShowChart"
        :retainedList="retainedList"></line-chart>
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
import lineChart from './_components/lineChart';
import behaviorApi from '@/api/behavior';
import ExportExcel from '@/components/ExportExcel/index';
import mixin from '@/utils/mixin';
export default {
  name: 'retainedAnalysis',
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
      retainedTitle: '',
      retainedList: [],
      visibleShowChart: false,
      list: [],
      total: 0,
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
          name: this.$t('retained.initDate'),
          prop: 'initDate',
          align: 'center'
        },
        {
          name: this.$t('retained.sumDevice'),
          prop: 'sumDevice',
          align: 'center'
        },
        {
          name: this.$t('retained.oneDay'),
          prop: 'oneDay',
          align: 'center'
        },
        {
          name: this.$t('retained.twoDay'),
          prop: 'twoDay',
          align: 'center'
        },
        {
          name: this.$t('retained.threeDay'),
          prop: 'threeDay',
          align: 'center'
        },
        {
          name: this.$t('retained.fourDay'),
          prop: 'fourDay',
          align: 'center'
        },
        {
          name: this.$t('retained.fiveDay'),
          prop: 'fiveDay',
          align: 'center'
        },
        {
          name: this.$t('retained.sixDay'),
          prop: 'sixDay',
          align: 'center'
        },
        {
          name: this.$t('retained.sevenDay'),
          prop: 'sevenDay',
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
      return cols.concat({
        width: 100,
        fixed: 'right',
        label: this.$t('views.operation'),
        align: 'center',
        component: columnLineChart,
        listeners: {
          'get-msg'(row) {
            _that.getMsg(row);
          }
        }
      });
    },
    getMsg(row) {
      this.retainedTitle = '初始登入日期为' + row.initDate + '的留存趋势图';
      this.retainedList = [
        row.sumDevice,
        row.oneDay,
        row.twoDay,
        row.threeDay,
        row.fourDay,
        row.fiveDay,
        row.sixDay,
        row.sevenDay
      ];
      this.visibleShowChart = true;
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
      // 查询表格数据
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageSize: this.pageSize,
        pageNo: (this.currentPage - 1) * this.pageSize
      };
      behaviorApi
        .retained(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.total = res.robj.total;
            this.list = res.robj.items;
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
    // 导出数据请求
    initExcelList() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      if (this.total <= 0) {
        this.$message.warning('数据为空,不能执行导出操作');
        this.$refs.exportExcelChild.downloadLoading = false;
      } else {
        behaviorApi
          .retained(data)
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