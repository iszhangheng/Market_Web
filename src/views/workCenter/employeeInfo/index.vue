<template>
  <div class="tiny-container">
    <h3 class="page-title">员工信息</h3>
    <!-- 功能模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 请求名称或URL -->
      <el-form-item :label="this.$t('employeeInfo.name')"
        prop="name">
        <el-input v-model="name"
          @keyup.enter.native="query()"
          :placeholder="this.$t('employeeInfo.requestName')"
          clearable></el-input>
      </el-form-item>
      <el-form-item :label="this.$t('employeeInfo.deptName')"
        prop="name">
        <el-select v-model="deptName"
          clearable
          placeholder="请选择">
          <el-option v-for="item in deptList"
            :key="item.detpTag"
            :label="item.deptName"
            :value="item.deptTag">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="this.$t('employeeInfo.postName')"
        prop="name">
        <el-select v-model="postName"
          clearable
          placeholder="请选择">
          <el-option v-for="item in deptPostList"
            :key="item.postId"
            :label="item.postName"
            :value="item.postId">
          </el-option>
        </el-select>
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
      <table-form v-if="visibleEmShow"
        :employeeInfo="employeeInfo"></table-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleEmShow = false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗趋势图 -->
    <el-dialog title="test"
      top="10vh"
      :visible.sync="visibleShowChart"
      width="80%">
      <table-form v-if="visibleShowChart"
        :employeeInfo="employeeInfo"></table-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleShowChart=false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import workCenterApi from '@/api/workCenter';
import tableForm from '@/components/TableForm/EmployeeInfo/tableForm';
import columnTowards from '@/views/workCenter/employeeInfo/_components/columnTowards';
import columnLineChart from '@/views/workCenter/employeeInfo/_components/columnLineChart';

export default {
  name: 'employeeInfo',
  components: {
    tableForm
  },
  data() {
    return {
      listLoading: false, // 加载动画开关
      total: 0, // 返回的表格数据总条数
      list: [], // 表格数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 页面大小
      productName: '', // 商品名查询
      deptList: [],
      postList: [],
      deptPostList: [],
      deptName: '',
      postName: '',
      name: '',
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
    this.initTbInfo();
  },
  watch: {
    postName: function() {
      if (postName !== '') {
        this.postList.foreach(item => {
          if (item.postName === this.postName) {
            this.deptName = item.deptName;
            return;
          }
        });
      }
    },
    deptName: function() {
      if (deptName !== '') {
        this.deptPostList = [];
        this.postList.foreach(item => {
          if (item.deptName === this.deptName) {
            this.deptPostList.push(item);
          }
        });
      }
    }
  },
  methods: {
    // 查询表格信息
    init() {
      this.listLoading = true;
      const data = {
        pageSize: this.pageSize,
        pageNo: (this.currentPage - 1) * this.pageSize,
        deptName: this.deptName,
        postName: this.postName,
        name: this.name
      };
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
    // 获取字典数据
    initTbInfo() {
      workCenterApi
        .tbInfo()
        .then(res => {
          this.deptList = res.robj.deptList;
          this.postList = res.robj.postList;
          this.deptPostList = this.postList;
        })
        .catch(res => {
          this.$message.error('码表数据请求失败!');
        });
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
    }
  }
};
</script>
<style lang="scss" scoped>
</style>