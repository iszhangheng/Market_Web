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
      @size-change="handleSizeChange"
      background
      layout="total, prev, sizes, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 40]"
      :current-page="currentPage">
    </el-pagination>
  </div>
</template>

<script>
import appApi from '@/api/app';
export default {
  name: 'webtatable',
  props: ['date', 'name'],
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
          name: this.$t('views.pageName'),
          width: 500,
          prop: 'pageName',
          'show-overflow-tooltip': true
        },
        { name: this.$t('views.pageView'), align: 'center', prop: 'pageView' },
        {
          name: this.$t('views.userNum'),
          align: 'center',
          prop: 'userNum',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.avgStandTime'),
          align: 'center',
          prop: 'avgStandTime',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.clickNum'),
          align: 'center',
          prop: 'clickNum',
          'show-overflow-tooltip': true
        }
      ];
    }
  },
  watch: {
    date() {
      this.initTableData();
    }
  },
  mounted() {
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
        pageSize: this.pageSize,
        pageName: this.name
      };
      appApi
        .appPageWeb(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.list = res.robj.items.map(item => {
              if (
                item.avgStandTime === undefined ||
                item.avgStandTime === null
              ) {
                item.avgStandTime = '-';
              }
              if (item.clickNum === undefined || item.clickNum === null) {
                item.clickNum = '-';
              }
              return item;
            });
            this.total = res.robj.total;
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