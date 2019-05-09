<template>
  <div class="tiny-container">
    <h3 class="page-title">销售单</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 查询按钮 -->
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">添加商品</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">提交</el-button>
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
  </div>
</template>

<script>
import columnTowards from './_components/columnTowards';
export default {
  name: 'pageAccess',
  data() {
    return {
      listLoading: false, // 加载动画开关
      total: 0, // 返回的表格数据总条数
      visibleShowChart: false,
      productId: '',
      list: [
        {
          productId: '1648613486',
          productType: '食品',
          productName: '娃哈哈',
          unitPrice: '25',
          unit: '盒',
          sellNum: '10',
          keepNum: '50',
          discount: '_',
          money: 250
        },
        {
          productId: '1648613487',
          productType: '食品',
          productName: '橘子',
          unitPrice: '10',
          unit: '斤',
          sellNum: '18',
          keepNum: '60',
          discount: '_',
          money: 180
        },
        {
          productId: '1648613488',
          productType: '食品',
          productName: '苹果',
          unitPrice: '19',
          unit: '斤',
          sellNum: '10',
          keepNum: '62',
          discount: '_',
          money: 190
        },
        {
          productId: '1648613489',
          productType: '食品',
          productName: '香蕉',
          unitPrice: '25',
          unit: '斤',
          sellNum: '10',
          keepNum: '50',
          discount: '_',
          money: 250
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
          name: '名称',
          align: 'center',
          prop: 'productName'
        },
        {
          name: '单价',
          align: 'center',
          prop: 'unitPrice'
        },
        {
          name: '单位',
          align: 'center',
          prop: 'unit'
        },
        {
          name: '数量',
          align: 'center',
          prop: 'sellNum'
        },
        {
          name: '折扣',
          align: 'center',
          prop: 'discount'
        },
        {
          name: '金额',
          align: 'center',
          prop: 'money'
        }
      ];
    }
  },
  methods: {
    update(row) {
      // this.visibleShowChart = true;
    },
    // 右侧功能栏
    columnsHandler(cols) {
      const that = this;
      return cols.concat({
        width: 80,
        fixed: 'right',
        label: '操作',
        align: 'center',
        component: columnTowards,
        listeners: {
          'get-table'(row) {
            that.update(row);
          }
        }
      });
    },
    query() {}
  }
};
</script>
<style lang="scss" scoped>
</style>

