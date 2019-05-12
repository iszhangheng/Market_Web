<template>
  <div class="tiny-container">
    <h3 class="page-title">我的流程</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 流程名赛选 -->
      <el-form-item :label="this.$t('myHoliday.restType')"
        prop="name">
        <el-select v-model="restType"
          clearable
          placeholder="请选择">
          <el-option v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
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
import personDetailsApi from '@/api/personDetails';
import { restTypeList } from '@/utils/baseTools';
import store from '@/store';
export default {
  name: 'productDetails',
  data() {
    return {
      listLoading: false, // 加载动画开关
      total: 0, // 返回的表格数据总条数
      list: [], // 表格数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 页面大小
      restType: '', // 休假类型
      options: restTypeList
    };
  },
  computed: {
    columns() {
      return [
        {
          name: '请休假类型',
          align: 'center',
          prop: 'restType'
        },
        {
          name: '请休假时间',
          align: 'center',
          prop: 'time'
        },
        {
          name: '天数',
          align: 'center',
          prop: 'sumDay'
        },
        {
          name: '状态',
          align: 'center',
          prop: 'state'
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
        restType: this.restType,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        employeeId: store.getters.authId
      };
      personDetailsApi
        .myHoliday(data)
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