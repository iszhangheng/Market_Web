<template>
  <div class="tiny-container">
    <h3 class="page-title">商品销售列表</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 请求名称或URL -->
      <!-- 时间查询 -->
      <el-form-item prop="name"
        :label="this.$t('date.label')">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          change="computeSumDay"
          :start-placeholder="this.$t('date.start')"
          :end-placeholder="this.$t('date.end')"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="this.$t('sellLog.productName')"
        prop="name">
        <el-input v-model="productName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('sellLog.request')"
          clearable></el-input>
      </el-form-item>
      <!-- 查询按钮 -->
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{this.$t('table.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :columns-handler="columnsHandler"
      :column-type="['index']"
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
    <!-- 弹窗趋势图 -->
    <el-dialog title="销售记录"
      top="10vh"
      :visible.sync="visibleShowChart"
      width="80%">
      <line-chart v-if="visibleShowChart"
        :productName="lineName"></line-chart>
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
import workCenterApi from '@/api/workCenter';
import columnTowards from './_components/columnTowards';
import lineChart from './_components/lineChart';
export default {
  name: 'sellLog',
  components: {
    lineChart
  },
  data() {
    return {
      date: [],
      visibleShowChart: false,
      listLoading: false, // 加载动画开关
      total: 4, // 返回的表格数据总条数
      list: [], // 表格数据
      currentPage: 1, // 当前页码
      lineName: '',
      pageSize: 10, // 页面大小
      productName: '' // 商品名查询
    };
  },
  computed: {
    columns() {
      return [
        {
          name: '商品名称',
          align: 'center',
          prop: 'productName'
        },
        {
          name: '平均价',
          align: 'center',
          prop: 'avgPrice'
        },
        {
          name: '单位',
          align: 'center',
          prop: 'unit'
        },
        {
          name: '数量',
          align: 'center',
          prop: 'count'
        },
        {
          name: '金额',
          align: 'center',
          prop: 'sumMoney'
        }
      ];
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 查询表格信息
      this.listLoading = true;
      const data = {
        productName: this.productName,
        startDate: this.date !== null ? this.date[0] : '',
        endDate: this.date !== null ? this.date[1] : '',
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      workCenterApi
        .getProductSellList(data)
        .then(res => {
          this.total = res.robj.total;
          this.list = res.robj.items;
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
          this.listLoading = false;
        });
    },
    query() {
      this.currentPage = 1;
      this.init();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    update(row) {
      this.lineName = row.productName;
      this.visibleShowChart = true;
    },
    // 右侧功能栏
    columnsHandler(cols) {
      const that = this;
      return cols.concat({
        width: 80,
        fixed: 'right',
        label: '趋势',
        align: 'center',
        component: columnTowards,
        listeners: {
          'get-table'(row) {
            that.update(row);
          }
        }
      });
    },
    myFormatDate(date) {
      var strDate = date.getFullYear() + '-';
      const month = date.getMonth() + 1;
      strDate += (month < 10 ? '0' + month : month) + '-';
      const day = date.getDate();
      strDate += day < 10 ? '0' + day : day;
      return strDate;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>