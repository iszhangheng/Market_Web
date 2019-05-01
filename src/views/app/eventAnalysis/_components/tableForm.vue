<template>
  <div>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 时间选择 -->
      <el-form-item prop="name">
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
    </el-form>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :column-type="['index']"
      :column-type-props="columnTypeProps"
      :column-key-map="{ label: 'name' }"
      :data="list"
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
  </div>
</template>

<script>
import appApi from '@/api/app';
import mixin from '@/utils/mixin';
export default {
  name: 'tableForm',
  mixins: [mixin],
  props: ['newdate', 'url'],
  data() {
    return {
      date: this.newdate,
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
        {
          name: this.$t('views.controlId'),
          align: 'center',
          prop: 'controlId'
        },
        {
          name: this.$t('views.controlTag'),
          align: 'center',
          prop: 'controlTag'
        },
        {
          name: this.$t('views.controlValue'),
          align: 'center',
          prop: 'controlValue'
        }
      ];
    }
  },
  watch: {
    error() {
      this.init();
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
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    init() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        pageUrl: this.url,
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      appApi
        .appControlDetail(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
            this.list = res.robj.items;
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>