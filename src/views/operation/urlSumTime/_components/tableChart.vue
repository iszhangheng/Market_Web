<template>
  <div>
    <!-- 查询模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <el-form-item label="查询"
        prop="name">
        <el-input v-model="pageName" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{$t('table.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :column-key-map="{ label: 'name' }"
      :data="list"
      :columns-handler="columnsHandler"
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
import dictionaryApi from '@/api/dictManage';
// import { yhtRouterFilter } from '@/filters';
export default {
  name: 'tableChart',
  components: { tableForm, lineChart },
  data() {
    return {
      pageName: '',
      list: [],
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
    columns() {
      return [
        // 表头数据
        {
          name: this.$t('views.currentUrl'),
          prop: 'h5CurrentUrl',
          'show-overflow-tooltip': true,
          formater(row, col) {
            return yhtRouterFilter(row[col.prop]);
          }
        },
        {
          name: this.$t('views.Count'),
          prop: 'count',
          align: 'center'
        },
        {
          name: this.$t('views.users'),
          prop: 'users',
          align: 'center'
        },
        {
          name: this.$t('views.sumTime'),
          prop: 'sumTime',
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
          name: this.$t('views.leaveNum'),
          prop: 'leaveNumProportion',
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
      this.urlTitle = yhtRouterFilter(url) + '走向';
      this.visibleShow = true;
    },
    getMsg(url) {
      this.h5url = url;
      this.h5urlTitle = yhtRouterFilter(url) + '趋势图';
      this.visibleShowChart = true;
    },
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.initTableData();
    },
    initTableData() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        pageName: this.pageName,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      operationApi
        .urlSumTime(data)
        .then(res => {
          this.total = res.robj.total;
          this.list = res.robj.items.map(item => {
            item.count = item.count + ' | ' + item.countProportion;
            item.users = item.users + ' | ' + item.usersProportion;
            return item;
          });
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>

<style lang="scss">

</style>
