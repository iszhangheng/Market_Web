<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.crashLogs')}}</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 模糊查询框 -->
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
      <!-- 操作系统选择 -->
      <el-form-item :label="this.$t('equipment.os')"
        prop="name">
        <el-select v-model="os"
          clearable
          placeholder="请选择操作系统">
          <el-option v-for="item in osList"
            :key="item.key"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 错误类型选择 -->
      <el-form-item :label="this.$t('views.errorType')"
        v-if="errorTypeShow"
        prop="name">
        <el-select v-model="errorTypeObj.name"
          clearable
          placeholder="请选择错误类型">
          <el-option v-for="item in errorTypeObj.list"
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
      layout="total, prev, sizes, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 40]"
      :current-page="currentPage">
    </el-pagination>
    <!-- 崩溃日志弹窗 -->
    <el-dialog :title="this.$t('views.exception')"
      :visible.sync="dialogVisible"
      width="60%">
      <div class="content"
        v-html="detailVal"></div>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          size="small"
          @click="dialogVisible = false">{{this.$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import columnStyle from './_components/columnStyle';
import columnException from './_components/columnException';
import performanceApi from '@/api/performance';
import ExportExcel from '@/components/ExportExcel/index';
import mixin from '@/utils/mixin';
export default {
  name: 'crashLogs',
  mixins: [mixin],
  components: {
    ExportExcel
  },
  data() {
    return {
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      errorTypeObj: {
        name: '',
        list: []
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
      os: 'ios',
      errorTypeShow: true,
      result: '',
      dialogVisible: false,
      detailVal: '',
      list: [],
      listExcel: [],
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
      const that = this;
      return [
        {
          name: this.$t('views.appVersion'),
          align: 'center',
          prop: 'appVersion'
        },
        {
          name: this.$t('views.appResourceVersion'),
          align: 'center',
          prop: 'appResourceVersion'
        },
        {
          name: this.$t('views.system'),
          align: 'center',
          prop: 'system'
        },
        {
          name: this.$t('views.systemVersion'),
          align: 'center',
          prop: 'systemVersion'
        },
        {
          name: this.$t('views.root'),
          align: 'center',
          prop: 'root'
        },
        {
          name: this.$t('views.deviceModel'),
          align: 'center',
          prop: 'mobile'
        },
        {
          name: this.$t('views.devVersion'),
          align: 'center',
          prop: 'mobileVersion'
        },
        {
          name: this.$t('views.errorType'),
          align: 'center',
          prop: 'exceptionReason',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.crashLogs'),
          prop: 'crashLog',
          width: 110,
          align: 'center',
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnException,
          listeners: {
            'get-logs'(val) {
              that.getLogs(val);
            }
          }
        }
        // {
        //   name: this.$t('views.crashDate'),
        //   align: 'center',
        //   prop: 'crashDate',
        //   'show-overflow-tooltip': true
        //   // propsHandler({ col, row, column }) {
        //   //   return {
        //   //     col,
        //   //     row,
        //   //     column,
        //   //     val: row[col.prop]
        //   //   };
        //   // },
        //   // component: columnStyle
        // }
      ];
    }
  },
  watch: {
    os() {
      if (this.os === 'ios') {
        this.errorTypeShow = true;
      } else {
        this.errorTypeShow = false;
      }
    }
  },
  created() {
    const data = {};
    performanceApi.exceptionList(data).then(res => {
      this.errorTypeObj.list = res.robj.exceptionReason;
    });
  },
  mounted() {
    this.init();
  },
  methods: {
    getLogs(val) {
      this.result = JSON.stringify(val);
      this.result = this.result.replace(/\\r\\n\\t/g, '<br/>');
      this.result = this.result.replace(/\\r\\n/g, '<br/>');
      this.result = this.result.replace(/\\n\\t/g, '<br/>');
      this.detailVal = this.result;
      this.dialogVisible = true;
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
        return '未知';
      } else {
        return val;
      }
    },
    init() {
      // 查询表格信息
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        system: this.os,
        exceptionReason: this.errorTypeObj.name
      };
      performanceApi
        .crashLogs(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.appVersion = this.modify(item.appVersion);
              item.appResourceVersion = this.modify(item.appResourceVersion);
              item.system = this.modify(item.system);
              item.systemVersion = this.modify(item.systemVersion);
              item.mobile = this.modify(item.mobile);
              item.mobileVersion = this.modify(item.mobileVersion);
              item.exceptionReason = this.modify(item.exceptionReason);
              return item;
            });
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
    },
    initExcelList() {
      // 导出表格数据
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        system: this.os,
        exceptionReason: this.errorTypeObj.name
      };
      if (this.total <= 0) {
        this.$message.warning('数据为空,不能执行导出操作');
        this.$refs.exportExcelChild.downloadLoading = false;
      } else {
        performanceApi
          .crashLogs(data)
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
.content {
  height: 400px;
  padding: 0 20px;
  overflow: auto;
}
</style>
