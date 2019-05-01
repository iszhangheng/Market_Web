<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.hotspotAnalysis')}}</h3>
    <!-- 功能模块 -->
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
      <el-form class="search-form"
        :inline="true"
        size="mini">
        <!-- 设备型号选择 -->
        <el-form-item :label="this.$t('views.deviceModel')"
          prop="name">
          <el-select v-model="deviceModelObj.name"
            clearable
            placeholder="请选择设备型号">
            <el-option v-for="item in deviceModelObj.list"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 设备版本选择 -->
        <el-form-item :label="this.$t('views.devVersion')"
          prop="name">
          <el-select v-model="devVersionObj.name"
            clearable
            placeholder="请选择设备版本">
            <el-option v-for="item in devVersionObj.list"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 查询按钮 -->
        <el-form-item label="">
          <el-button @click="query()"
            type="primary"
            icon="el-icon-search">{{this.$t('table.query')}}</el-button>
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
      :columns-handler="columnsHandler"
      :columns="columns">
    </egrid>
    <!-- 表格分页 -->
    <el-pagination v-if="total !== 0"
      class="tiny-pagination"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      :current-page="currentPage">
    </el-pagination>
    <!-- 热点图弹框 -->
    <el-dialog :title="hotspotTitle"
      top="10vh"
      :visible.sync="visibleShowChart"
      width="80%">
      <hotspot-chart v-if="visibleShowChart"
        :url="pageUrl"
        :newDate="dateTime"
        :devModel="devModel"
        :devVersion="devVersion"></hotspot-chart>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleShowChart=false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import behaviorApi from '@/api/behavior';
import hotspotChart from './_components/hotspotChart';
import columnHotspotChart from './_components/columnHotspotChart';
import ExportExcel from '@/components/ExportExcel/index';
import mixin from '@/utils/mixin';
export default {
  name: 'hotspotAnalysis',
  mixins: [mixin],
  components: {
    ExportExcel,
    hotspotChart
  },
  data() {
    return {
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      pageName: '',
      deviceModelObj: {
        name: '',
        list: []
      },
      devVersionObj: {
        name: '',
        list: []
      },
      list: [],
      listExcel: [],
      hotspotTitle: '热点图',
      pageUrl: '',
      dateTime: '',
      devModel: '',
      devVersion: '',
      visibleShowChart: false,
      listLoading: false,
      total: 0,
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
          name: this.$t('views.appVersion'),
          prop: 'appVersion',
          align: 'center'
        },
        {
          name: this.$t('views.appResourceVersion'),
          prop: 'resVersion',
          align: 'center'
        },
        {
          name: this.$t('views.pageName'),
          prop: 'pageName',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.clickNum'),
          prop: 'pageClickTimes',
          align: 'center'
        },
        {
          name: this.$t('views.deviceModel'),
          prop: 'mobile',
          align: 'center'
        },
        {
          name: this.$t('views.devVersion'),
          prop: 'mobileVersion',
          align: 'center'
        }
        // {
        //   name: this.$t('views.statisticDate'),
        //   prop: 'dateTime',
        //   align: 'center'
        // }
      ];
    }
  },
  created() {
    const data = {};
    behaviorApi.paramList(data).then(res => {
      this.deviceModelObj.list = res.robj.mobileList;
      this.devVersionObj.list = res.robj.mobileVersionList;
    });
  },
  mounted() {
    this.init();
  },
  methods: {
    query() {
      this.currentPage = 1;
      this.init();
    },
    columnsHandler(cols) {
      const _that = this;
      return cols.concat({
        width: 100,
        fixed: 'right',
        label: this.$t('views.operation'),
        align: 'center',
        component: columnHotspotChart,
        listeners: {
          'get-msg'(row) {
            _that.getMsg(row);
          }
        }
      });
    },
    getMsg(row) {
      this.pageUrl = row.pageUrl;
      // this.dateTime = row.dateTime;
      this.devModel = row.mobile;
      this.devVersion = row.mobileVersion;
      // this.visibleShowChart = true;
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
        return '未知';
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
        startDate: this.startDatem,
        endDate: this.endDate,
        pageName: this.pageName,
        mobile: this.deviceModelObj.name,
        mobileVersion: this.devVersionObj.name,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      behaviorApi
        .hotspotTable(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.appVersion = this.modify(item.appVersion);
              item.resVersion = this.modify(item.resVersion);
              item.pageName = this.modify(item.pageName);
              item.mobile = this.modify(item.mobile);
              item.mobileVersion = this.modify(item.mobileVersion);
              item.pageClickTimes = this.change(item.pageClickTimes);
              return item;
            });
            this.listLoading = false;
          } else {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    initExcelList() {
      // 导出表格数据
      const data = {
        startDate: this.startDatem,
        endDate: this.endDate,
        pageName: this.pageName,
        mobile: this.deviceModelObj.name,
        mobileVersion: this.devVersionObj.name,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      if (this.total <= 0) {
        this.$message.warning('数据为空,不能执行导出操作');
        this.$refs.exportExcelChild.downloadLoading = false;
      } else {
        behaviorApi
          .hotspotTable(data)
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