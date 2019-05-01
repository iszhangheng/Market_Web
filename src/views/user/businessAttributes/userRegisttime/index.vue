<template>
  <div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <span @click="chartCut('linechart')"
        :class="{current:groupItem ==='linechart'}">
        <svg-icon icon-class="lineCharts" /></span>
    </div>
    <div v-show="groupItem === 'table'">
      <!-- 表格展示模块 -->
      <egrid v-loading.body="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
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
    <div v-if="groupItem === 'linechart'">
      <line-chart></line-chart>
    </div>
  </div>
</template>
<script>
import lineChart from './_components/lineChart';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  name: 'userRegisttime',
  mixins: [mixin],
  props: ['date'],
  components: { lineChart },
  data() {
    return {
      groupItem: 'table',
      list: [],
      total: 0,
      listLoading: false,
      currentPage: 1, // 当前页码
      pageSize: 10 // 页面大小
    };
  },
  computed: {
    columns() {
      return [
        // 表头数据
        { name: this.$t('views.dateType'), prop: 'dateType' },
        { name: this.$t('views.registTime'), prop: 'registTime' },
        { name: this.$t('views.num'), prop: 'num' }
      ];
    }
  },
  watch: {
    // date() {
    //   this.init();
    // }
  },
  created() {
    this.init();
  },
  methods: {
    chartCut(name) {
      this.groupItem = name;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    init() {
      this.listLoading = true;
      // 查询数据库获取表格信息
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      userApi
        .userRegistTime(data)
        .then(res => {
          this.total = res.robj.total;
          this.list = res.robj.items;
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>
