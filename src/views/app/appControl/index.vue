<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.appControl')}}</h3>
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 40]"
      :current-page="currentPage">
    </el-pagination>
  </div>
</template>
<script>
import columnStyle from './_components/columnStyle';
import appApi from '@/api/app';

export default {
  name: 'appControl',
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
        {
          name: this.$t('views.diviceID'),
          width: 160,
          align: 'center',
          prop: 'diviceID',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.pageGuid'),
          width: 150,
          align: 'center',
          prop: 'pageGuid',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.controlTag'),
          align: 'center',
          prop: 'controlTag'
        },
        {
          name: this.$t('views.controlValue'),
          align: 'center',
          prop: 'controlValue'
        },
        {
          name: this.$t('views.controlType'),
          align: 'center',
          prop: 'controlType'
        },
        {
          name: this.$t('views.controlTime'),
          align: 'center',
          prop: 'controlTime',
          'show-overflow-tooltip': true
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
        .appControl(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
            this.list = res.robj.items;
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
// ...
</style>
