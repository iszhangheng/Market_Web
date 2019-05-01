<template>
  <div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <span @click="chartCut('barchart')"
        :class="{current:groupItem ==='barchart'}">
        <svg-icon icon-class="barCharts" /></span>
    </div>
    <div v-show="groupItem === 'table'">
      <!-- 表格展示模块 -->
      <egrid v-loading.body="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :default-sort="columnSort"
        @sort-change="sortChange"
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
        @size-change="handleSizeChange"
        background
        layout="total, prev, sizes, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 40]"
        :current-page="currentPage">
      </el-pagination>
    </div>
    <div v-if="groupItem === 'barchart'">
      <bar-Chart></bar-Chart>
    </div>
  </div>
</template>
<script>
import appApi from '@/api/app';
import barChart from './_components/barChart';
// import columnStyle from './_components/columnStyle';
import mixin from '@/utils/mixin';
export default {
  name: 'appPage',
  mixins: [mixin],
  props: ['date', 'name'],
  components: {
    barChart
  },
  data() {
    return {
      columnSort: {
        prop: '',
        order: ''
      },
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
        // {
        //   name: this.$t('views.pageAddress'),
        //   prop: 'appCurrentUrl',
        //   'show-overflow-tooltip': true
        // },
        {
          name: this.$t('views.pageName'),
          prop: 'appCurrentName',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.Count'),
          prop: 'count',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('views.entryTimesProportion'),
          prop: 'countPercent',
          align: 'center'
        },
        {
          name: this.$t('views.users'),
          prop: 'users',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('views.userNumProportion'),
          prop: 'usersPercent',
          align: 'center'
        },
        {
          name: this.$t('views.sumTimes'),
          prop: 'sumTime',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('views.avgTimes'),
          prop: 'avgTime',
          align: 'center',
          sortable: 'custom'
          // propsHandler({ col, row, column }) {
          //   return {
          //     col,
          //     row,
          //     column,
          //     val: row[col.prop]
          //   };
          // },
          // component: columnStyle
        },
        {
          name: this.$t('views.leaveNum'),
          prop: 'leaveNum',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('views.leaveNumProportion'),
          prop: 'leaveNumPercent',
          align: 'center',
          sortable: 'custom'
        }
        // {
        //   name: this.$t('views.statisticDate'),
        //   prop: 'dataTime',
        //   align: 'center'
        // }
        // {
        //   name: this.$t('views.pageName'),
        //   width: 250,
        //   prop: 'pageName',
        //   'show-overflow-tooltip': true
        // },
        // {
        //   name: this.$t('views.diviceID'),
        //   width: 130,
        //   prop: 'diviceID',
        //   'show-overflow-tooltip': true
        // },
        // {
        //   name: this.$t('views.pageGuid'),
        //   width: 130,
        //   prop: 'pageGuid',
        //   'show-overflow-tooltip': true
        // },
        // {
        //   name: this.$t('views.pageId'),
        //   prop: 'pageId'
        // },
        // { name: this.$t('views.Channel'), align: 'center', prop: 'channel' },
        // {
        //   name: this.$t('views.isJailbreak'),
        //   align: 'center',
        //   prop: 'isJailbreak'
        // },
        // {
        //   name: this.$t('views.appVersion'),
        //   align: 'center',
        //   prop: 'appVersion'
        // },
        // {
        //   name: this.$t('views.appResouceVersion'),
        //   align: 'center',
        //   prop: 'appResouceVersion'
        // },
        // {
        //   name: this.$t('views.latitude'),
        //   width: 90,
        //   prop: 'latitude'
        // },
        // {
        //   name: this.$t('views.longitude'),
        //   width: 90,
        //   prop: 'longitude'
        // },
        // {
        //   name: this.$t('views.pageType'),
        //   align: 'center',
        //   prop: 'pageType'
        // },
        // {
        //   name: this.$t('views.pageTime'),
        //   width: 150,
        //   align: 'center',
        //   prop: 'pageTime',
        //   'show-overflow-tooltip': true,
        //   propsHandler({ col, row, column }) {
        //     return {
        //       col,
        //       row,
        //       column,
        //       val: row[col.prop]
        //     };
        //   },
        //   component: columnStyle
        // },
        // {
        //   name: this.$t('views.createTime'),
        //   width: 150,
        //   align: 'center',
        //   prop: 'createTime',
        //   'show-overflow-tooltip': true,
        //   propsHandler({ col, row, column }) {
        //     return {
        //       col,
        //       row,
        //       column,
        //       val: row[col.prop]
        //     };
        //   },
        //   component: columnStyle
        // }
      ];
    }
  },
  watch: {
    date() {
      this.initTableData();
    }
  },
  created() {
    this.initTableData();
  },
  methods: {
    chartCut(name) {
      this.groupItem = name;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.initTableData();
    },
    sortChange(column) {
      this.columnSort.prop = column.prop;
      this.columnSort.order = column.order;
      this.initTableData();
    },
    initTableData() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        prop:
          this.columnSort.prop === 'sumTime'
            ? 'sum_time'
            : this.columnSort.prop && this.columnSort.prop === 'avgTime'
            ? 'avg_time'
            : this.columnSort.prop && this.columnSort.prop === 'leaveNum'
            ? 'leave_num'
            : this.columnSort.prop && this.columnSort.prop === 'leaveNumPercent'
            ? 'leave_num_percent'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC',
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        pageName: this.name
      };
      appApi
        .appUrlSumTime(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.avgTime = item.avgTime + 'ms';
              item.sumTime = item.sumTime + 'ms';
              return item;
            });
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
<style lang="scss" scoped>
// ...
</style>


