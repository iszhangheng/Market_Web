<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.equipmentAnalysis')}}</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
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
      <!-- 地区选择 -->
      <el-form-item :label="this.$t('date.area')"
        v-if="groupItem === 'table'">
        <v-distpicker class="el-area"
          name="Area"
          @province="onChangeProvince"
          @city="onChangeCity"
          @area="onChangeArea">
        </v-distpicker>
      </el-form-item>
      <!-- 查询按钮 -->
      <el-form-item label=""
        v-if="groupItem === 'table'">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{this.$t('table.query')}}</el-button>
      </el-form-item>
      <!-- 导出模块 -->
      <el-form-item label=""
        v-if="groupItem === 'table'">
        <export-excel id="test"
          ref="exportExcelChild"
          :columns='columns'
          :list='listExcel'
          @initExcelList='initExcelList'></export-excel>
      </el-form-item>
      <el-form class="search-form"
        :inline="true"
        size="mini">
        <!-- 设备型号选择 -->
        <el-form-item v-if="groupItem === 'table'"
          :label="this.$t('views.deviceModel')"
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
        <el-form-item v-if="groupItem === 'table'"
          :label="this.$t('views.devVersion')"
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
        <!-- 操作系统选择 -->
        <el-form-item v-if="groupItem === 'table'"
          :label="this.$t('equipment.os')"
          prop="name">
          <el-select v-model="os"
            clearable
            placeholder="请选择">
            <el-option v-for="item in osList"
              :key="item.key"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form>
    <!-- 表格图形显隐 -->
    <div class="uba-content">
      <div class="charts-cut">
        <span @click="chartCut('table')"
          :class="{current:groupItem ==='table'}">
          <svg-icon icon-class="tableCharts" /></span>
        <span @click="chartCut('devCharts')"
          :class="{current:groupItem ==='devCharts'}">
          <svg-icon icon-class="pieCharts" /></span>
        <span @click="chartCut('osCharts')"
          :class="{current:groupItem ==='osCharts'}">
          <svg-icon icon-class="pieCharts" /></span>
      </div>
    </div>
    <div v-show="groupItem === 'table'">
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
        @size-change="handleSizeChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 40]"
        :page-size="pageSize"
        :current-page="currentPage">
      </el-pagination>
    </div>
    <!-- 设备信息分布情况 -->
    <div v-if="groupItem === 'devCharts'"
      class="pie">
      <div class="pieModel">
        <dev-model-distribution :date="date"></dev-model-distribution>
      </div>
      <div class="pieVersion">
        <dev-version-distribution :date="date"></dev-version-distribution>
      </div>
    </div>
    <!-- 操作系统分布情况 -->
    <div v-if="groupItem === 'osCharts'">
      <div>
        <os-distribution :date="date"></os-distribution>
      </div>
    </div>
  </div>
</template>
<script>
import devModelDistribution from './_components/devModelDistribution';
import devVersionDistribution from './_components/devVersionDistribution';
import osDistribution from './_components/osDistribution';
import behaviorApi from '@/api/behavior';
import mixin from '@/utils/mixin';
import VDistpicker from 'v-distpicker';
import ExportExcel from '@/components/ExportExcel/index';
export default {
  name: 'equipmentAnalysis',
  mixins: [mixin],
  components: {
    devModelDistribution,
    devVersionDistribution,
    osDistribution,
    ExportExcel,
    VDistpicker
  },
  data() {
    return {
      groupItem: 'table',
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      deviceModelObj: {
        name: '',
        list: []
      },
      devVersionObj: {
        name: '',
        list: []
      },
      condition: {
        dataProvince: '',
        dataCity: '',
        dataArea: ''
      },
      osList: [
        {
          key: '1',
          value: 'ios'
        },
        {
          key: '2',
          value: 'android'
        },
        {
          key: '3',
          value: '其他'
        }
      ],
      os: '',
      list: [],
      listExcel: [],
      total: 0,
      listLoading: false,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    verify() {
      return JSON.stringify(this.condition);
    },
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
          name: this.$t('views.province'),
          prop: 'province',
          align: 'center'
        },
        {
          name: this.$t('views.city'),
          prop: 'city',
          align: 'center'
        },
        {
          name: this.$t('views.area'),
          prop: 'area',
          align: 'center'
        },
        {
          name: this.$t('views.appVersion'),
          prop: 'appVersion',
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
        },
        {
          name: this.$t('equipment.os'),
          prop: 'system',
          align: 'center'
        },
        {
          name: this.$t('views.deviceNum'),
          prop: 'deviceNum',
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
    query() {
      this.currentPage = 1;
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
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        province:
          this.condition.dataProvince === '省'
            ? ''
            : this.condition.dataProvince,
        city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
        area: this.condition.dataArea === '区' ? '' : this.condition.dataArea,
        mobile: this.deviceModelObj.name,
        mobileVersion: this.devVersionObj.name,
        system: this.os
      };
      behaviorApi
        .deviceTable(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.province = this.modify(item.province);
              item.city = this.modify(item.city);
              item.area = this.modify(item.area);
              item.appVersion = this.modify(item.appVersion);
              item.mobile = this.modify(item.mobile);
              item.mobileVersion = this.modify(item.mobileVersion);
              item.system = this.modify(item.system);
              item.deviceNum = this.change(item.deviceNum);
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
    },

    initExcelList() {
      // 导出表格数据
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        province:
          this.condition.dataProvince === '省'
            ? ''
            : this.condition.dataProvince,
        city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
        area: this.condition.dataArea === '区' ? '' : this.condition.dataArea,
        mobile: this.deviceModelObj.name,
        mobileVersion: this.devVersionObj.name,
        system: this.os
      };
      if (this.total <= 0) {
        this.$message.warning('数据为空,不能执行导出操作');
        this.$refs.exportExcelChild.downloadLoading = false;
      } else {
        behaviorApi
          .deviceTable(data)
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
    },
    onChangeProvince(data) {
      this.condition.dataProvince = data.value;
    },
    onChangeCity(data) {
      this.condition.dataCity = data.value;
    },
    onChangeArea(data) {
      this.condition.dataArea = data.value;
    }
  }
};
</script>

<style lang="scss">
.pie {
  width: 100%;
  height: 400px;
}
.pieModel {
  width: 49%;
  float: left;
}
.pieVersion {
  width: 49%;
  float: right;
}
.el-area {
  select {
    font-size: 12px;
    padding: 0 5px;
    height: 28px !important;
    line-height: 28px !important;
  }
}
</style>