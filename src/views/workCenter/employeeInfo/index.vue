<template>
  <div class="tiny-container">
    <h3 class="page-title">员工信息</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 请求名称或URL -->
      <el-form-item :label="this.$t('employeeInfo.name')">
        <el-input v-model="name"
          @keyup.enter.native="query()"
          :placeholder="this.$t('employeeInfo.requestName')"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="部门/岗位"
        prop="deptPost">
        <el-cascader :options="deptPost"
          change-on-select
          clearable
          v-model="selectedOptions">
        </el-cascader>
      </el-form-item>
      <!-- 查询按钮 -->
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{this.$t('table.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :column-type="['index']"
      :column-key-map="{ label: 'name' }"
      :columns-handler="columnsHandler"
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
    <!-- 弹窗走向详情 -->
    <el-dialog title="修改信息"
      top="10vh"
      :visible.sync="visibleEmShow"
      width="60%">
      <table-form :employeeInfo="employeeInfo"
        v-if="visibleEmShow"
        @closeForm="closeForm"
        @init="init"></table-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleEmShow = false"
          type="primary">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import workCenterApi from '@/api/workCenter';
import { deptPostList } from '@/utils/baseTools';
import tableForm from './_components/tableForm';
import columnTowards from '@/views/workCenter/employeeInfo/_components/columnTowards';
import columnLineChart from '@/views/workCenter/employeeInfo/_components/columnLineChart';

export default {
  name: 'employeeInfo',
  components: {
    tableForm
  },
  data() {
    return {
      selectedOptions: '',
      deptPost: deptPostList,
      name: '',
      listLoading: false, // 加载动画开关
      total: 0, // 返回的表格数据总条数
      list: [], // 表格数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 页面大小
      employeeInfo: {},
      visibleEmShow: false,
      visibleShowChart: false
    };
  },
  computed: {
    columns() {
      return [
        {
          name: '员工ID',
          align: 'center',
          prop: 'employeeId'
        },
        {
          name: '姓名',
          align: 'center',
          prop: 'name'
        },
        {
          name: '性别',
          align: 'center',
          prop: 'sex'
        },
        {
          name: '部门',
          align: 'center',
          prop: 'deptName'
        },
        {
          name: '岗位',
          align: 'center',
          prop: 'postName'
        },
        {
          name: '电话',
          align: 'center',
          prop: 'phone'
        }
      ];
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 查询表格信息
    init() {
      this.listLoading = true;
      const data = {
        pageSize: this.pageSize,
        pageNo: (this.currentPage - 1) * this.pageSize,
        deptName: this.getDeptName(this.selectedOptions),
        postName: this.getPostName(this.selectedOptions),
        name: this.name
      };
      console.log(this.selectedOptions);
      workCenterApi
        .employeeInfo(data)
        .then(res => {
          this.total = res.robj.total;
          this.list = res.robj.items;
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
          this.listLoading = false;
        });
    },
    // 发送请求
    query() {
      this.currentPage = 1;
      this.init();
    },
    // 调整页面大小
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    // 更新员工信息
    update(row) {
      this.employeeInfo = row;
      this.visibleEmShow = true;
    },
    closeForm() {
      this.visibleEmShow = false;
      this.init();
    },
    // 删除员工信息
    getMsg(row) {
      const data = {
        employeeId: row.employeeId
      };
      this.$confirm('此操作将禁止' + row.name + '登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          workCenterApi
            .deleteEmployee(data)
            .then(res => {
              if (res.robj.deleteStatus) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
            })
            .catch(res => {
              this.$message({
                type: 'success',
                message: '删除失败!'
              });
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 右侧功能栏
    columnsHandler(cols) {
      const that = this;
      return cols.concat(
        {
          width: 80,
          fixed: 'right',
          label: '修改',
          align: 'center',
          component: columnTowards,
          // listeners 可用于监听自定义组件内部 $emit 出的事件
          listeners: {
            'get-table'(row) {
              that.update(row);
            }
          }
        },
        {
          width: 80,
          fixed: 'right',
          label: '删除',
          align: 'center',
          component: columnLineChart,
          listeners: {
            'get-msg'(row) {
              that.getMsg(row);
            }
          }
        }
      );
    },
    getDeptName(st) {
      const str = st[0];
      if (str === 'XSB') {
        return '销售部';
      }
      if (str === 'CGB') {
        return '采购部';
      }
      if (str === 'CWB') {
        return '财务部';
      }
      if (str === 'RSB') {
        return '人事部';
      }
      return '';
    },
    getPostName(st) {
      const str = st[1];
      if (str === 'CGB1557217001013') {
        return '采购部经理';
      }
      if (str === 'CGB1557217001014') {
        return '采购员';
      }
      if (str === 'XSB1557217001015') {
        return '销售部经理';
      }
      if (str === 'XSB1557217001016') {
        return '销售员';
      }
      if (str === 'CWB1557217001020') {
        return '财务部经理';
      }
      if (str === 'RSB1557217001022') {
        return '人事部经理';
      }
      if (str === 'RSB1557217001021') {
        return '人事专员';
      }
      return '';
    }
  }
};
</script>
<style lang="scss" scoped>
</style>