<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.performanceIndicators')}}</h3>
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
      <!-- 筛选条件 -->
      <el-form-item :label="this.$t('networkTime.filter')"
        prop="name">
        <el-select v-model="filter"
          clearable
          placeholder="请选择筛选条件">
          <el-option v-for="item in filterList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="rule"
          clearable
          placeholder="请选择比较规则">
          <el-option v-for="item in ruleList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-form-item label="">
          <el-input v-model="compareValue"
            placeholder="只能输入整数或小数"
            @keyup.enter.native="query()"
            clearable></el-input>
        </el-form-item>
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      :current-page="currentPage">
    </el-pagination>
  </div>
</template>
<script>
import performanceApi from '@/api/performance';
import ExportExcel from '@/components/ExportExcel/index';
import mixin from '@/utils/mixin';
export default {
  name: 'performanceIndicators',
  mixins: [mixin],
  components: {
    ExportExcel
  },
  data() {
    return {
      listExcel: [],
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      // columnSort: {
      //   prop: '',
      //   order: ''
      // },
      filterList: [
        {
          value: 'avgFrames',
          label: '平均帧率'
        },
        {
          value: 'avgMemory',
          label: '平均内存占用'
        },
        {
          value: 'avgCpu',
          label: '平均CPU占用'
        },
        {
          value: 'avgFlow',
          label: '流量均值'
        }
      ],
      filter: '',
      ruleList: [
        {
          value: '<',
          label: '小于'
        },
        {
          value: '<=',
          label: '小于等于'
        },
        {
          value: '==',
          label: '等于'
        },
        {
          value: '>=',
          label: '大于等于'
        },
        {
          value: '>',
          label: '大于'
        }
      ],
      rule: '',
      compareValue: '',
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
          name: this.$t('views.appVersion'),
          align: 'center',
          prop: 'appVersion'
        },
        {
          name: this.$t('views.appResourceVersion'),
          align: 'center',
          prop: 'resVersion'
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
          name: this.$t('performanceIndicators.fps'),
          prop: 'avgFrames',
          align: 'center'
          // sortable: 'custom'
        },
        {
          name: this.$t('performanceIndicators.memory'),
          prop: 'avgMemory',
          align: 'center'
        },
        {
          name: this.$t('performanceIndicators.cpu'),
          prop: 'avgCpu',
          align: 'center'
        },
        {
          name: this.$t('performanceIndicators.rateFlow'),
          prop: 'avgFlow',
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    // sortChange(column) {
    //   this.columnSort.prop = column.prop;
    //   this.columnSort.order = column.order;
    //   if (this.total <= 0) {
    //     return;
    //   }
    //   this.init();
    // },
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
        return val.toFixed(2);
      }
    },
    init() {
      // 查询表格信息
      if (
        (this.filter === '' && this.rule === '' && this.compareValue === '') ||
        (this.filter !== '' && this.rule !== '' && this.compareValue !== '')
      ) {
        if (this.filter !== '' || this.rule !== '') {
          if (
            !/^[0-9]{1,}[.][0-9]+$/.test(this.compareValue) &&
            !/^[0-9]+$/.test(this.compareValue)
          ) {
            this.$message.warning('只能输入整数或小数');
            return null;
          }
        }
        this.listLoading = true;
        const data = {
          startDate: this.startDate,
          endDate: this.endDate,
          pageNo: (this.currentPage - 1) * this.pageSize,
          pageSize: this.pageSize,
          condition: this.filter,
          rule: this.rule,
          compareValue: this.compareValue
          // prop: this.columnSort.prop,
          // order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC'
        };
        performanceApi
          .performanceIndicators(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
              this.total = res.robj.total;
              this.list = res.robj.items.map(item => {
                item.appVersion = this.modify(item.appVersion);
                item.resVersion = this.modify(item.resVersion);
                item.system = this.modify(item.system);
                item.systemVersion = this.modify(item.systemVersion);
                item.mobile = this.modify(item.mobile);
                item.mobileVersion = this.modify(item.mobileVersion);
                item.avgFrames = this.change(item.avgFrames) + 'fps';
                item.avgMemory = this.change(item.avgMemory) + 'MB';
                item.avgCpu = this.change(item.avgCpu) + '%';
                item.avgFlow = this.change(item.avgFlow) + 'MB';
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
      } else {
        this.$message.warning('条件缺失,无法查询,请保证筛选条件的完整!');
        return null;
      }
    },
    // 导出表格数据
    initExcelList() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        condition: this.filter.name,
        rule: this.rule,
        compareValue: this.compareValue
        // prop: this.columnSort.prop,
        // order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC'
      };
      if (this.total <= 0) {
        this.$message.warning('数据为空,不能执行导出操作');
        this.$refs.exportExcelChild.downloadLoading = false;
      } else {
        performanceApi
          .performanceIndicators(data)
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
</style>
