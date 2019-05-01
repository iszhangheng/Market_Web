<template>
  <div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <span @click="chartCut('piechart')"
        :class="{current:groupItem ==='piechart'}">
        <svg-icon icon-class="pieCharts" /></span>
    </div>
    <div v-show="groupItem === 'table'">
      <!-- 表格展示模块 -->
      <egrid v-loading.body="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :column-key-map="{ label: 'name' }"
        :column-type="['index']"
        :column-type-props="columnTypeProps"
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
    <div v-if="groupItem === 'piechart'">
      <pie-chart :date="date"></pie-chart>
    </div>
  </div>
</template>
<script>
import pieChart from './_components/pieChart';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  name: 'devVersion',
  mixins: [mixin],
  props: ['date'],
  components: { pieChart },
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
        { name: this.$t('views.dateType'), prop: 'dateType' },
        { name: this.$t('views.devVersion'), prop: 'devVersion' },
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
        .devVersion(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
          this.list = res.robj.items;
          this.listLoading = false;
          } else {
            this.listLoading = false;
            this.total = 0;
            this.list = [];
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>
