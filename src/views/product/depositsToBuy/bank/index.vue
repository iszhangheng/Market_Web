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
import productApi from '@/api/product';
import mixin from '@/utils/mixin';
export default {
  name: 'bank',
  props: ['date', 'lpCode', 'bkCode', 'bkName'],
  mixins: [mixin],
  data() {
    return {
      listLoading: false,
      total: 0,
      list: [],
      currentPage: 1,
      pageSize: 10
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
        { name: this.$t('views.LegalPersonCode'), prop: 'trcorp' },
        { name: this.$t('views.bankCode'), prop: 'bkcode' },
        { name: this.$t('views.bankName'), prop: 'bkname' },
        { name: this.$t('transactions.numSuccess'), prop: 'sucTotal' },
        { name: this.$t('transactions.numFail'), prop: 'failTotal' },
        { name: this.$t('views.successRate'), prop: 'sucPercent' },
        { name: this.$t('transactions.successAmount'), prop: 'sucMoney' },
        { name: this.$t('transactions.failAmount'), prop: 'failMoney' }
        // { name: this.$t('views.statisticDate'), prop: 'date' }
      ];
    }
  },
  watch: {
    date() {
      this.init();
    },
    lpCode() {
      this.init();
    },
    bkCode() {
      this.init();
    },
    bkName() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    init() {
      // 根据条件向数据库请求数据，填充展示数组
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        groupStr: ['bank'],
        trcorp: this.lpCode,
        bkcode: this.bkCode,
        bkname: this.bkName,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      productApi
        .depositsBuy(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.list = res.robj.items;
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
<style lang="scss" scoped>
// ...
</style>

