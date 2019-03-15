<template>
  <div>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :column-key-map="{ label: 'name' }"
      :data="list"
      :columns-schema="columnsSchema"
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
import operationApi from '@/api/operation';
import { yhtRouterFilter } from '@/filters';

export default {
  name: 'tableChart',
  data() {
    return {
      columnsProps: {
        // columnsProps 用于定义所有 columns 公共的属性
        sortable: true
      },
      list: [],
      total: 0,
      listLoading: false,
      currentPage: 1, // 当前页码
      pageSize: 10, // 页面大小
      columnsSchema: {
        当前页面: {
          align: 'left',
          formater(row, col) {
            return yhtRouterFilter(row[col.prop]);
          }
        },
        'Current Url': {
          align: 'left',
          formater(row, col) {
            return yhtRouterFilter(row[col.prop]);
          }
        },
        上一个页面: {
          align: 'left',
          formater(row, col) {
            return yhtRouterFilter(row[col.prop]);
          }
        },
        'Prev Url': {
          align: 'left',
          formater(row, col) {
            return yhtRouterFilter(row[col.prop]);
          }
        }
      }
    };
  },
  computed: {
    columns() {
      return [
        // 表头数据
        {
          name: this.$t('views.h5CurrentUrl'),
          prop: 'h5CurrentUrl',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.h5SourceUrl'),
          prop: 'h5SourceUrl',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.entryTimes'),
          prop: 'entryTimes',
          width: 200,
          align: 'center'
        },
        {
          name: this.$t('views.users'),
          prop: 'userNum',
          width: 200,
          align: 'center'
        },
        {
          name: this.$t('views.dataTime'),
          prop: 'dataTime',
          width: 200,
          align: 'center'
        }
      ];
    }
  },
  mounted() {
    this.initTableData();
  },
  methods: {
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.initTableData();
    },
    initTableData() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      operationApi.urlUsersCount(data)
        .then(res => {
          this.total = res.robj.total;
          this.list = res.robj.items;
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>