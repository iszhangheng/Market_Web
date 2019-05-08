<template>
  <div class="tiny-container">
    <h3 class="page-title">员工信息</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 请求名称或URL -->
      <el-form-item :label="this.$t('employeeInfo.name')"
        prop="name">
        <el-input v-model="name"
          :placeholder="this.$t('employeeInfo.requestName')"
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
  name: 'employeeInfo',
  data() {
    return {
      name: '',
      listLoading: false, // 加载动画开关
      total: 0, // 返回的表格数据总条数
      list: [], // 表格数据
      currentPage: 1, // 当前页码
      pageSize: 10 // 页面大小
    };
  },
  computed: {
    columns() {
      return [
        {
          name: '姓名',
          align: 'center',
          prop: 'name'
        },
        {
          name: '电话',
          align: 'center',
          prop: 'phone'
        }
      ];
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 查询表格信息
    init() {
      this.listLoading = true;
      const data = {
        pageSize: this.pageSize,
        pageNo: (this.currentPage - 1) * this.pageSize,
        name: this.name
      };
      workCenterApi
        .employeeInfo(data)
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
    // 发送请求
    query() {
      this.currentPage = 1;
      this.init();
    },
    // 调整页面大小
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