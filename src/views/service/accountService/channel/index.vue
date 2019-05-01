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
import serviceApi from '@/api/service';
import mixin from '@/utils/mixin';
export default {
  name: 'channel',
  mixins: [mixin],
  props: ['date', 'name'],
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
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
        { name: this.$t('views.channel'), prop: 'channel' },
        { name: this.$t('accountService.successfulAccount'), prop: 'sucTotal' },
        { name: this.$t('accountService.failedAccount'), prop: 'failTotal' },
        { name: this.$t('views.successRate'), prop: 'sucPercent' }
        // { name: this.$t('views.statisticDate'), prop: 'date' }
      ];
    }
  },
  watch: {
    date() {
      this.init();
    },
    name() {
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
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        groupStr: ['channel'],
        channel: this.name,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      serviceApi
        .accountOopeningService(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.list = res.robj.items.map(item => {
              if (item.channel === undefined || item.channel === null) {
                item.channel === '未知';
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

<style lang="scss">
</style>
