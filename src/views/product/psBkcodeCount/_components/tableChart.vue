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
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage">
    </el-pagination>
  </div>
</template>

<script>
import productApi from '@/api/product';
import mixin from '@/utils/mixin';
export default {
  name: 'tableChart',
  mixins: [mixin],
  props: ['date'],
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
        {
          name: this.$t('views.ubaMsg'),
          width: 250,
          prop: 'ubaMsg',
          'show-overflow-tooltip': true
        },
        { name: this.$t('views.bkcode'), prop: 'bkcode' },
        { name: this.$t('views.issuccess'), prop: 'issuccess' },
        { name: this.$t('views.count'), prop: 'count' },
        { name: this.$t('views.sumCuapam'), prop: 'sumCuapam' },
        { name: this.$t('views.crcycd'), prop: 'crcycd' },
        { name: this.$t('views.statisticDate'), prop: 'date' }
      ];
    }
  },
  watch: {
    // date() {
    //   this.init();
    // }
  },
  mounted() {
    this.init();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    init() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      productApi
        .psBkcodeCount(data)
        .then(res => {
          res.robj.items.forEach(item => {
            if (item.ubaMsg === undefined || item.ubaMsg === null) {
              item.ubaMsg = '未知';
            }
          });
          res.robj.items.forEach(item => {
            if (item.issuccess === 0) {
              item.issuccess = '成功';
            } else {
              item.issuccess = '失败';
            }
          });
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