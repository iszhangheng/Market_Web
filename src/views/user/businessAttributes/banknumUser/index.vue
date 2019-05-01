<template>
  <div>
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
import statChart from './_components/statChart';
import barChart from './_components/barChart';
import columnStyle from './_components/columnStyle';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  name: 'bankUserInfo',
  mixins: [mixin],
  props: ['date'],
  components: {
    statChart,
    barChart
  },
  data() {
    return {
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
        { name: this.$t('views.bankName'), prop: 'bkname', align: 'center' },
        { name: this.$t('views.num'), prop: 'num', align: 'center' },
        {
          name: this.$t('views.status'),
          prop: 'status',
          align: 'center',
          propsHandler({ col, row }) {
            return {
              col,
              row,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        {
          name: this.$t('views.statisticDate'),
          prop: 'dateType',
          align: 'center'
        }
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
    handleSizeChange(val) {
      this.pageSize = val;
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
        .bankUserInfo(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.list = res.robj.items.map(item => {
              if (item.bkname === null || item.bkname === undefined) {
                item.bkname = '未知';
              }
              return item;
            });
            this.total = res.robj.total;
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
