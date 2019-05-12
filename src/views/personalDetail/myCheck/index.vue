<template>
  <div class="tiny-container">
    <h3 class="page-title">我的考勤</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 考勤状态赛选 -->
      <el-form-item :label="this.$t('myCheck.checkState')"
        prop="name">
        <el-select v-model="value"
          clearable
          placeholder="请选择">
          <el-option v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 筛选条件 -->
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
import personDetailsApi from '@/api/personDetails';
export default {
  name: 'WorkLog',
  data() {
    return {
      listLoading: false, // 加载动画开关
      total: 0, // 返回的表格数据总条数
      list: [], // 表格数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 页面大小
      productName: '', // 商品名查询
      options: [
        {
          value: '迟到',
          label: '迟到'
        },
        {
          value: '早退',
          label: '早退'
        },
        {
          value: '未打卡',
          label: '未打卡'
        }
      ],
      value: ''
    };
  },
  computed: {
    columns() {
      return [
        {
          name: '日期',
          align: 'center',
          prop: 'logDate'
        },
        {
          name: '上班打卡时间',
          align: 'center',
          prop: 'inWorkDate'
        },
        {
          name: '上班状态',
          align: 'center',
          prop: 'inState'
        },
        {
          name: '下班打卡时间',
          align: 'center',
          prop: 'outWorkDate'
        },
        {
          name: '下班状态',
          align: 'center',
          prop: 'outState'
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
        state: this.value,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      personDetailsApi
        .myCheck(data)
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