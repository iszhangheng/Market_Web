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
  name: 'gather',
  mixins: [mixin],
  props: ['date', 'name', 'condition', 'lpCode', 'bkCode', 'bkName', 'usName', 'mobile'],
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
        { name: this.$t('views.channel'), prop: 'channel' },
        { name: this.$t('depositsToBuy.area'), prop: 'area' },
        { name: this.$t('depositsToBuy.userPhone'), prop: 'mobile' },
        { name: this.$t('views.userName'), prop: 'userName' },
        { name: this.$t('views.LegalPersonCode'), prop: 'trcorp' },
        { name: this.$t('views.bankCode'), prop: 'bkcode' },
        { name: this.$t('views.bankName'), prop: 'bkname' },
        { name: this.$t('accountService.successfulAccount'), prop: 'sucTotal' },
        { name: this.$t('accountService.failedAccount'), prop: 'failTotal' },
        { name: this.$t('views.successRate'), prop: 'sucPercent' },
        { name: this.$t('views.statisticDate'), prop: 'date' }
      ];
    },
    verify() {
      return JSON.stringify(this.condition);
    }
  },
  watch: {
    date() {
      this.init();
    },
    condition: {
      deep: true,
      handler() {
        this.condition = this.condition;
        this.init();
      }
    },
    name() {
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    init() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        groupStr: ['date', 'channel', 'loaction', 'bank', 'user'],
        province:
          this.condition.dataProvince === '省'
            ? ''
            : this.condition.dataProvince,
        city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
        area: this.condition.dataArea === '区' ? '' : this.condition.dataArea,
        channel: this.name,
        userName: this.usName,
        mobile: this.mobile,
        trcorp: this.lpCode,
        bkcode: this.bkCode,
        bkname: this.bkName
      };
      serviceApi
        .accountOopeningService(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.list = res.robj.items.map(item => {
              item.area = item.province + '—' + item.city + '—' + item.area;
              if (item.userName === null || item.userName === undefined) {
                item.userName = '未知';
              }
              if (item.bkcode === null || item.bkcode === undefined) {
                item.bkcode = '未知';
              }
              if (item.bkname === null || item.bkname === undefined) {
                item.bkname = '未知';
              }
              if (item.trcorp === null || item.trcorp === undefined) {
                item.trcorp = '未知';
              }
              if (item.mobile === null || item.mobile === undefined) {
                item.mobile = '未知';
              }
              return item;
            });
            this.total = res.robj.total;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.list = [];
            this.total = 0;
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
.el-area {
  select {
    font-size: 12px;
    padding: 0 5px;
    height: 28px !important;
    line-height: 28px !important;
  }
}
</style>
