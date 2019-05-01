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
import columnStyle from '@/views/serve/taskException/_components/columnStyle';
import columnException from '@/views/serve/taskException/_components/columnException';
import serveApi from '@/api/serve';
export default {
  name: 'tableChart',
  props: {
    // date: {
    //   type: Date
    // }
  },
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
        创建时间: {
          // propsHandler 可用于转换传给自定义组件的 props
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        CreateTime: {
          // propsHandler 可用于转换传给自定义组件的 props
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        异常: {
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnException
        },
        Exception: {
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnException
        }
      }
    };
  },
  computed: {
    columns() {
      return [
        // 表头数据
        { name: this.$t('views.method'), width: 200, prop: 'method' },
        {
          name: this.$t('views.exception'),
          prop: 'exception'
        },
        {
          name: this.$t('views.params'),
          align: 'center',
          width: 150,
          prop: 'params',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.createTime'),
          width: 150,
          align: 'center',
          prop: 'createTime'
        }
      ];
    }
  },
  // watch: {
  //   date: function() {
  //     this.initTableData();
  //   }
  // },
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
        // date:
        //   this.date === null ? '' : this.$moment(this.date).format('YYYYMM'),
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      serveApi.taskException(data)
        .then(res => {
          this.list = res.robj.items.map(item => {
            if (item.exception === undefined || item.exception === null) {
              item.exception = '-';
            }
            return item;
          });
          this.total = res.robj.total;
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>