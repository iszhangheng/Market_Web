<template>
  <div>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 时间选择 -->
      <el-form-item prop="name">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          :start-placeholder="this.$t('date.start')"
          :end-placeholder="this.$t('date.end')"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <!-- 查询按钮 -->
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{$t('table.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage">
    </el-pagination>
  </div>
</template>

<script>
import behaviorApi from '@/api/behavior';
import mixin from '@/utils/mixin';
export default {
  name: 'tableForm',
  mixins: [mixin],
  props: ['newdate', 'url'],
  data() {
    return {
      date: this.newdate,
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
        {
          name: this.$t('control.uiType'),
          align: 'center',
          prop: 'uiType'
        },
        {
          name: this.$t('control.uiLabel'),
          align: 'center',
          prop: 'uiLabel'
        },
        {
          name: this.$t('control.uiValue'),
          align: 'center',
          prop: 'uiValue'
        },
        {
          name: this.$t('control.uiClickTimes'),
          align: 'center',
          prop: 'uiClickTimes'
        }
      ];
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    query() {
      this.currentPage = 1;
      this.init();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    modify(val) {
      if (val === '' || val === null || val === undefined) {
        return '-';
      } else {
        return val;
      }
    },
    init() {
      // 查询表格数据
      this.listLoading = true;
      const data = {
        pageUrl: this.url,
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      behaviorApi
        .eventDetail(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.uiType = this.modify(item.uiType);
              item.uiLabel = this.modify(item.uiLabel);
              item.uiValue = this.modify(item.uiValue);
              item.uiClickTimes = this.modify(item.uiClickTimes);
              return item;
            });
            this.listLoading = false;
          } else {
            this.total = 0;
            this.list = [];
            this.listLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>