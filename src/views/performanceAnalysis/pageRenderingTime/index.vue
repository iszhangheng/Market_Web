<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.pageRenderingTime')}}</h3>
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
      <!-- 页面名称或URL -->
      <el-form-item :label="this.$t('views.divtPageName')"
        prop="name">
        <el-input v-model="pageConditions"
          @keyup.enter.native="query()"
          :placeholder="this.$t('dictionary.pageName')"
          clearable></el-input>
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
      :default-sort="columnSort"
      @sort-change="sortChange"
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
  name: 'pageRenderingTime',
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
      columnSort: {
        prop: '',
        order: ''
      },
      pageConditions: '',
      filterList: [
        {
          value: 'avgPageTime',
          label: '页面渲染平均时间'
        },
        {
          value: 'maxPageTime',
          label: '页面渲染最长时间'
        },
        {
          value: 'minPageTime',
          label: '页面渲染最短时间'
        },
        {
          value: 'avgCssTime',
          label: 'css加载平均时间'
        },
        {
          value: 'maxCssTime',
          label: 'css加载最长时间'
        },
        {
          value: 'minCssTime',
          label: 'css加载最短时间'
        },
        {
          value: 'avgJsTime',
          label: 'js加载平均时间'
        },
        {
          value: 'maxJsTime',
          label: 'js加载最长时间'
        },
        {
          value: 'minJsTime',
          label: 'js加载最短时间'
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
          name: this.$t('views.pageAddress'),
          prop: 'pageUrl',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.pageName'),
          prop: 'pageName',
          'show-overflow-tooltip': true
        },
        // {
        //   name: this.$t('pageRenderingTime.pageGuid'),
        //   align: 'center',
        //   prop: 'pageGuid'
        // },
        {
          name: this.$t('pageRenderingTime.avgPageTime'),
          align: 'center',
          prop: 'avgPageTime',
          sortable: 'custom'
        },
        {
          name: this.$t('pageRenderingTime.maxPageTime'),
          align: 'center',
          prop: 'maxPageTime',
          sortable: 'custom'
        },
        {
          name: this.$t('pageRenderingTime.minPageTime'),
          align: 'center',
          prop: 'minPageTime',
          sortable: 'custom'
        },
        {
          name: this.$t('pageRenderingTime.avgCssTime'),
          prop: 'avgCssTime',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('pageRenderingTime.maxCssTime'),
          prop: 'maxCssTime',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('pageRenderingTime.minCssTime'),
          prop: 'minCssTime',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('pageRenderingTime.avgJsTime'),
          prop: 'avgJsTime',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('pageRenderingTime.maxJsTime'),
          prop: 'maxJsTime',
          align: 'center',
          sortable: 'custom'
        },
        {
          name: this.$t('pageRenderingTime.minJsTime'),
          prop: 'minJsTime',
          align: 'center',
          sortable: 'custom'
        }
        // {
        //   name: this.$t('networkTime.requestDate'),
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
    sortChange(column) {
      this.columnSort.prop = column.prop;
      this.columnSort.order = column.order;
      if (this.total <= 0) {
        return;
      }
      this.init();
    },
    change(val) {
      if (val === '' || val === null || val === undefined) {
        return '-';
      } else {
        return val.toFixed(2);
      }
    },
    modify(val) {
      if (val === '' || val === null || val === undefined) {
        return 'noUrl';
      } else {
        return val;
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
          pageName: this.pageConditions,
          condition: this.filter,
          rule: this.rule,
          compareValue: this.compareValue,
          prop: this.columnSort.prop,
          order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC'
        };
        performanceApi
          .pageRenderingTime(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
              this.total = res.robj.total;
              this.list = res.robj.items.map(item => {
                item.pageUrl = this.modify(item.pageUrl);
                item.pageName = this.modify(item.pageName);
                item.avgPageTime = this.change(item.avgPageTime);
                item.maxPageTime = this.change(item.maxPageTime);
                item.minPageTime = this.change(item.minPageTime);
                item.avgCssTime = this.change(item.avgCssTime);
                item.maxCssTime = this.change(item.maxCssTime);
                item.minCssTime = this.change(item.minCssTime);
                item.avgJsTime = this.change(item.avgJsTime);
                item.maxJsTime = this.change(item.maxJsTime);
                item.minJsTime = this.change(item.minJsTime);
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
        pageName: this.pageConditions,
        condition: this.filter.name,
        rule: this.rule,
        compareValue: this.compareValue,
        prop: this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC'
      };
      if (this.total <= 0) {
        this.$message.warning('数据为空,不能执行导出操作');
        this.$refs.exportExcelChild.downloadLoading = false;
      } else {
        performanceApi
          .pageRenderingTime(data)
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
