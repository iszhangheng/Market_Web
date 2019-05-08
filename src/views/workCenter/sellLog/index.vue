<template>
  <div class="tiny-container">
    <h3 class="page-title">商品销售列表</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 请求名称或URL -->
      <el-form-item :label="this.$t('sellLog.sellDate')"
        prop="name">
        <el-date-picker v-model="value1"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="this.$t('sellLog.productName')"
        prop="name">
        <el-input v-model="productName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('sellLog.request')"
          clearable></el-input>
      </el-form-item>
      <!-- 筛选条件 -->
      <!-- 查询按钮 -->
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{this.$t('table.query')}}</el-button>
      </el-form-item>
      <!-- 导出模块 -->
      <!-- <el-form-item label="">
        <export-excel id="test"
          ref="exportExcelChild"
          :columns='columns'
          :list='listExcel'
          @initExcelList='initExcelList'></export-excel>
      </el-form-item> -->
    </el-form>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
  </div>
</template>

<script>
import workCenterApi from '@/api/workCenter';
export default {
  name: 'sellLog',
  data() {
    return {
      listLoading: false, // 加载动画开关
      total: 4, // 返回的表格数据总条数
      list: [
        {
          sellId: '1235645678',
          productId: '1254682313',
          productName: '牙膏',
          sellPrice: '售价',
          unit: '管',
          num: '10',
          discount: '_',
          sellDate: '2019-05-08'
        },
        {
          sellId: '1235645679',
          productId: '1254682314',
          productName: '牙刷',
          sellPrice: '12',
          unit: '支',
          num: '10',
          discount: '_',
          sellDate: '2019-05-08'
        },
        {
          sellId: '1235645680',
          productId: '1254682315',
          productName: '奶糖',
          sellPrice: '100',
          unit: '盒',
          num: '10',
          discount: '_',
          sellDate: '2019-05-08'
        },
        {
          sellId: '1235645681',
          productId: '12546823145',
          productName: '雪糕',
          sellPrice: '3',
          unit: '块',
          num: '10',
          discount: '_',
          sellDate: '2019-05-08'
        }
      ], // 表格数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 页面大小
      productName: '' // 商品名查询
    };
  },
  computed: {
    columns() {
      return [
        {
          name: '销售单号',
          align: 'center',
          prop: 'sellId'
        },
        {
          name: '商品编号',
          align: 'center',
          prop: 'productId'
        },
        {
          name: '商品名称',
          align: 'center',
          prop: 'productName'
        },
        {
          name: '售价',
          align: 'center',
          prop: 'sellPrice'
        },
        {
          name: '单位',
          align: 'center',
          prop: 'unit'
        },
        {
          name: '数量',
          align: 'center',
          prop: 'num'
        },
        {
          name: '折扣',
          align: 'center',
          prop: 'discount'
        },
        {
          name: '时间',
          align: 'center',
          prop: 'sellDate'
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
      const data = {};
      workCenterApi
        .sellLog(data)
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
    }
  }
};
</script>
<style lang="scss" scoped>
</style>