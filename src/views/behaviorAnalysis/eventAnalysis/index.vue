<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.eventAnalysis')}}</h3>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 查询框 -->
      <el-form-item :label="this.$t('views.pageName')"
        prop="name">
        <el-input v-model="pageName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('please.pageName')"
          clearable></el-input>
      </el-form-item>
      <!-- 时间选择 -->
      <el-form-item prop="name"
        :label="this.$t('views.date')">
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
      <!-- 导出模块 -->
      <el-form-item label="">
        <export-excel id="test"
          ref="exportExcelChild"
          :columns='columns'
          :list='listExcel'
          @initExcelList='initExcelList'></export-excel>
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
      :columns-handler="columnsHandler"
      :data="list"
      :columns="columns">
    </egrid>
    <!-- 表格分页 -->
    <el-pagination v-if="total !== 0"
      class="tiny-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 40]"
      :current-page="currentPage">
    </el-pagination>
    <!-- 事件详情 -->
    <el-dialog :title="eventDetailsTitle"
      top="10vh"
      :visible.sync="visibleShow"
      width="80%">
      <table-form v-if="visibleShow"
        :newdate="date"
        :url="pageUrl"></table-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleShow = false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import columnEventDetails from './_components/columnEventDetails';
import behaviorApi from '@/api/behavior';
import tableForm from './_components/tableForm';
import mixin from '@/utils/mixin';
import ExportExcel from '@/components/ExportExcel/index';
export default {
  name: 'eventAnalysis',
  mixins: [mixin],
  components: {
    ExportExcel,
    tableForm
  },
  data() {
    return {
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      pageName: '',
      pageUrl: '',
      eventDetailsTitle: '',
      visibleShow: false,
      listExcel: [],
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
          name: this.$t('views.pageAddress'),
          prop: 'pageUrl',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.pageName'),
          prop: 'pageName',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.clickNum'),
          align: 'center',
          prop: 'pageClickTimes'
        }
      ];
    }
  },
  created() {
    this.init();
  },
  methods: {
    columnsHandler(cols) {
      const _that = this;
      return cols.concat({
        width: 100,
        fixed: 'right',
        label: this.$t('views.eventDetails'),
        align: 'center',
        component: columnEventDetails,
        listeners: {
          'get-detail'(row) {
            _that.getDetail(row);
          }
        }
      });
    },
    getDetail(row) {
      this.pageUrl = row.pageUrl;
      this.eventDetailsTitle =
        row.pageName === ''
          ? row.pageUrl + ' ' + this.$t('views.eventDetails')
          : row.pageName + ' ' + this.$t('views.eventDetails');
      this.visibleShow = true;
    },
    query() {
      this.currentPage = 1;
      this.init();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    modify(val) {
      if (val === '' || val === null || val === undefined) {
        return 'noUrl';
      } else {
        return val;
      }
    },
    change(val) {
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
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        pageName: this.pageName
      };
      behaviorApi
        .eventTable(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.pageUrl = this.modify(item.pageUrl);
              item.pageName = this.modify(item.pageName);
              item.pageClickTimes = this.change(item.pageClickTimes);
              return item;
            });
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.total = 0;
            this.list = [];
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    initExcelList() {
      // 导出表格数据
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageName: this.pageName
      };
      if (this.total <= 0) {
        this.$message.warning('数据为空,不能执行导出操作');
        this.$refs.exportExcelChild.downloadLoading = false;
      } else {
        behaviorApi
          .eventTable(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
              this.listExcel = res.robj.items;
            } else {
              this.listExcel = [];
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// ...
</style>
