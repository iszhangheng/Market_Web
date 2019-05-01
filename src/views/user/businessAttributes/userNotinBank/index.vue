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
      <stat-chart></stat-chart>
    </div>
  </div>
</template>
<script>
import statChart from './_components/statChart';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  name: 'cardnumUser',
  mixins: [mixin],
  props: ['date'],
  components: { statChart },
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
        { name: this.$t('views.bankNo'), prop: 'bankNo' },
        { name: this.$t('views.num'), prop: 'num' }
      ];
    }
  },
  watch: {
    date() {
      this.init();
    }
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
        .userNotinBank(data)
        .then(res => {
          this.list = res.robj.items.map(item => {
            if (item.bankNo === undefined || item.bankNo === null) {
              item.bankNo = '未知';
            }
            return item;
          });
          this.total = parseInt(res.robj.total);
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>
