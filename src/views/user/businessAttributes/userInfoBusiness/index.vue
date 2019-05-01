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
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  name: 'userInfoBusiness',
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
        { name: this.$t('views.userId'), prop: 'userId' },
        { name: this.$t('views.userName'), prop: 'userName' },
        { name: this.$t('views.lastLoginTime'), prop: 'lastLoginTime' },
        { name: this.$t('views.registTime'), prop: 'registTime' },
        { name: this.$t('views.cardNum'), prop: 'bindCardNum' },
        { name: this.$t('views.bindBankNum'), prop: 'bindBankNum' },
        { name: this.$t('views.statisticDate'), prop: 'statisticDate' }
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
        .userInfo(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.list = res.robj.items.map(item => {
              if (item.bindBankNum === undefined || item.bindBankNum === null) {
                item.bindBankNum = '未知';
              }
              if (item.userName === undefined || item.userName === null) {
                item.userName = '未知';
              }
              if (
                item.lastLoginTime === undefined ||
                item.lastLoginTime === null
              ) {
                item.lastLoginTime = '未知';
              }
              if (item.registTime === undefined || item.registTime === null) {
                item.registTime = '未知';
              }
              if (item.bindCardNum === undefined || item.bindCardNum === null) {
                item.bindCardNum = '未知';
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
<style scoped>
</style>

