<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.pageAccess')}}</h3>
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
    <el-dialog :title="urlTitle"
      top="10vh"
      :visible.sync="visibleShow"
      width="80%">
      <table-form v-if="visibleShow"
        :url="h5url"></table-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleShow = false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗趋势图 -->
    <el-dialog :title="h5urlTitle"
      top="10vh"
      :visible.sync="visibleShowChart"
      width="80%">
      <line-chart v-if="visibleShowChart"
        :url="h5url"></line-chart>
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
import tableForm from '@/views/operation/urlSumTime/_components/tableForm';
import lineChart from '@/views/operation/urlSumTime/_components/lineChart';
import columnTowards from '@/views/operation/urlSumTime/_components/columnTowards';
import columnLineChart from '@/views/operation/urlSumTime/_components/columnLineChart';
import columnStyle from '@/views/operation/urlSumTime/_components/columnStyle';
import operationApi from '@/api/operation';
import ExportExcel from '@/components/ExportExcel/index';
import dictionaryApi from '@/api/dictManage';
// import { yhtRouterFilter } from '@/filters';
export default {
  name: 'pageAccess',
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
      pageName: '',
      list: [],
      listExcel: [],
      total: 0,
      visibleShow: false,
      visibleShowChart: false,
      h5url: '',
      urlTitle: '',
      h5urlTitle: '',
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
          name: this.$t('views.currentUrl'),
          prop: 'h5CurrentName',
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
          width: 150,
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
          width: 150,
          align: 'center'
        },
        {
          name: this.$t('views.sumTimes'),
          prop: 'sumTime',
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
          name: this.$t('views.avgTimes'),
          prop: 'avgTime',
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
          name: this.$t('views.leaveNumProportion'),
          prop: 'leaveNumPercent',
          align: 'center',
          sortable: 'custom'
        }
      ];
    }
  },
  mounted() {
    this.getUrl();
  },
  methods: {
    query() {
      this.currentPage = 1;
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
            'get-mesg'(row) {
              that.getMesg(row.h5CurrentUrl);
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
              that.getMsg(row.h5CurrentUrl);
            }
          }
        }
      );
    },
    getMesg(url) {
      this.h5url = url;
      this.urlTitle =
        this.yhtRouterFilter(url) === ''
          ? url + '走向'
          : this.yhtRouterFilter(url) + '走向';
      this.visibleShow = true;
    },
    getMsg(url) {
      this.h5url = url;
      this.h5urlTitle =
        this.yhtRouterFilter(url) === ''
          ? url + '趋势图'
          : this.yhtRouterFilter(url) + '趋势图';
      this.visibleShowChart = true;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.pageName = '';
      this.initTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.pageName = '';
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
    getUrl() {
      const data = {
        pageType: 'H5'
      };
      dictionaryApi
        .pageList(data)
        .then(res => {
          this.options = res.robj.items;
          this.initTableData();
        })
        .catch(res => {
          this.$message.error('数据请求失败');
        });
    },
    yhtRouterFilter(url) {
      let result = '';
      this.options.forEach(item => {
        url =
          url.lastIndexOf('/') === url.length - 1
            ? url.substr(0, url.length - 1)
            : url;
        if (item.pageUrl === url) {
          result = item.pageName;
        }
      });
      return result;
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
            : this.columnSort.prop && this.columnSort.prop === 'leaveNumPercent'
            ? 'leave_num_percent'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        pageName: this.pageName,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      operationApi
        .urlSumTime(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.sumTime =
                (item.sumTime / (60 * 60 * 1000)).toFixed(2) + '/h';
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
    initExcelList() {
      // 导出数据请求
      const data = {
        prop:
          this.columnSort.prop === 'sumTime'
            ? 'sum_time'
            : this.columnSort.prop && this.columnSort.prop === 'avgTime'
            ? 'avg_time'
            : this.columnSort.prop && this.columnSort.prop === 'leaveNumPercent'
            ? 'leave_num_percent'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        pageName: this.pageName
      };
      operationApi
        .urlSumTime(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.listExcel = res.robj.items;
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

