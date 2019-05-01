<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.appCrash')}}</h3>
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
import columnStyle from '@/views/app/appCrash/_components/columnStyle';
import columnException from '@/views/app/appCrash/_components/columnException';
import appApi from '@/api/app';

export default {
  name: 'appCrash',
  data() {
    return {
      result: '',
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
      const that = this;
      return [
        // 表头数据
        {
          name: this.$t('views.appVersion'),
          align: 'center',
          prop: 'appVersion'
        },
        {
          name: this.$t('views.appResouceVersion'),
          align: 'center',
          prop: 'appResouceVersion'
        },
        {
          name: this.$t('views.system'),
          align: 'center',
          prop: 'system'
        },
        {
          name: this.$t('views.root'),
          align: 'center',
          prop: 'root'
        },
        {
          name: this.$t('views.mobile'),
          align: 'center',
          prop: 'mobile'
        },
        {
          name: this.$t('views.mobileVersion'),
          align: 'center',
          prop: 'mobileVersion'
        },
        {
          name: this.$t('views.crashLog'),
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
            'get-mesg'(val) {
              that.getMesg(val);
            }
          }
        },
        {
          name: this.$t('views.appTime'),
          align: 'center',
          prop: 'appTime'
        },
        {
          name: this.$t('views.createTime'),
          align: 'center',
          prop: 'createTime',
          'show-overflow-tooltip': true,
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnStyle
        }
      ];
    }
  },
  created() {
    this.initTableData();
  },
  methods: {
    getMesg(val) {
      this.result = JSON.stringify(val);
      this.result = this.result.replace(/\\r\\n\\t/g, '<br/>');
      this.result = this.result.replace(/\\r\\n/g, '<br/>');
      this.result = this.result.replace(/\\n\\t/g, '<br/>');
      this.detailVal = this.result;
      this.dialogVisible = true;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.initTableData();
    },
    initTableData() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      appApi
        .appCrash(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.appTime = item.appTime.replace(
                /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                '$1-$2-$3 $4:$5:$6'
              );
              // parseInt(item.appTime / 1000 / 1000 / 1000 / 10) +
              // '-' +
              // (parseInt((item.appTime / 10000 / 10000) % 100) < 10
              //   ? '0' + parseInt((item.appTime / 10000 / 10000) % 100)
              //   : parseInt((item.appTime / 10000 / 10000) % 100)) +
              // '-' +
              // (parseInt((item.appTime / 1000 / 1000) % 100) < 10
              //   ? '0' + parseInt((item.appTime / 1000 / 1000) % 100)
              //   : parseInt((item.appTime / 1000 / 1000) % 100)) +
              // ' ' +
              // (parseInt((item.appTime / 100 / 100) % 100) < 10
              //   ? '0' + parseInt((item.appTime / 100 / 100) % 100)
              //   : parseInt((item.appTime / 100 / 100) % 100)) +
              // ':' +
              // (parseInt((item.appTime / 10 / 10) % 100) < 10
              //   ? '0' + parseInt((item.appTime / 10 / 10) % 100)
              //   : parseInt((item.appTime / 10 / 10) % 100)) +
              // ':' +
              // (parseInt(item.appTime % 100) < 10
              //   ? '0' + parseInt(item.appTime % 100)
              //   : parseInt(item.appTime % 100));
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
