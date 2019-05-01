<template>
  <div>
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
    <el-dialog :title="this.$t('views.response')"
      :visible.sync="dialogVisible"
      :append-to-body="true"
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
import columnError from '../_components/columnError';
import serviceMonitoringApi from '@/api/serviceMonitoring';
import mixin from '@/utils/mixin';
export default {
  name: 'tableForm',
  mixins: [mixin],
  props: ['error', 'date'],
  data() {
    return {
      dialogVisible: false,
      detailVal: '',
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
      const _that = this;
      return [
        // 表头数据
        {
          name: this.$t('views.errorMsg'),
          prop: 'errorMsg',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.operation'),
          align: 'center',
          width: 120,
          prop: 'response',
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnError,
          listeners: {
            'get-msg'(str) {
              _that.getMsg(str);
            }
          }
        },
        {
          name: this.$t('views.invokeDay'),
          width: 120,
          align: 'center',
          prop: 'invokeDay'
        }
      ];
    }
  },
  watch: {
    error() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    getMsg(str) {
      this.dialogVisible = true;
      this.detailVal = str;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    init() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        errorMsg: this.error,
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      serviceMonitoringApi
        .errorInfoDetail(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.errorMsg = item.errorMsg;
              item.response = item.response;
              item.invokeDay = item.invokeDay;
              return item;
            });
            this.listLoading = false;
          } else {
            this.total = 0;
            this.list = [];
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

<style lang="scss" scoped>
.content {
  word-break: break-all;
  padding: 0 20px;
  overflow: auto;
};
.page {
  padding: 20px 0;
  p {
    color: #999;
    font-size: 16px;
    text-align: center;
  }
}
</style>