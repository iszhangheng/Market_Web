<template>
  <div>
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
</template>

<script>
import serviceApi from '@/api/service';
import mixin from '@/utils/mixin';
export default {
  name: 'user',
  mixins: [mixin],
  props: ['date', 'usName', 'mobile'],
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
    columns() {
      return [
        // 表头数据
        { name: this.$t('depositsToBuy.userPhone'), prop: 'mobile' },
        { name: this.$t('views.userName'), prop: 'userName' },
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
    usName() {
      this.init();
    },
    mobile() {
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
    init() {
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        groupStr: ['user'],
        userName: this.usName,
        mobile: this.mobile,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      serviceApi
        .accountOopeningService(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.list = res.robj.items;
            this.total = res.robj.total;
            this.listLoading = false;
          } else {
            this.list = [];
            this.total = 0;
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
