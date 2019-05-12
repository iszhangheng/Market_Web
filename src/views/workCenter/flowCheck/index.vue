<template>
  <div class="tiny-container">
    <h3 class="page-title">流程审批</h3>
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
    <!-- 审批弹窗 -->
    <el-dialog title="审批流程"
      top="10vh"
      :visible.sync="visibleCheckFlow"
      width="40%">
      <el-form ref="form"
        :model="checkFlowForm"
        label-suffix="："
        label-width="80px">
        <el-form-item label="审批流程">
          <el-select v-model="checkFlowForm.state"
            placeholder="审批">
            <el-option label="同意"
              value="true"></el-option>
            <el-option label="退回"
              value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="checkFlowForm.idea">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="updateFlowCurrent"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- 请假详情 -->
    <el-dialog top="10vh"
      :visible.sync="visibleRestForm"
      width="60%">
      <rest-form :formId="formId"
        v-if="visibleRestForm"></rest-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="visibleRestForm = false"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import columnTowards from './_components/columnTowards';
import columnLineChart from './_components/columnLineChart';
import restForm from './_components/restForm';
import workCenterApi from '@/api/workCenter';
import store from '@/store';
export default {
  name: 'productDetails',
  components: {
    restForm
  },
  data() {
    return {
      listLoading: false, // 加载动画开关
      total: 0, // 返回的表格数据总条数
      list: [], // 表格数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 页面大小
      formId: '', // 详情页查询数据需要的ID
      visibleRestForm: false, // 请假信息组件显隐
      visibleCheckFlow: false, // 审批弹框组件显隐
      checkFlowForm: {
        formId: '',
        requestDate: '',
        employeeId: '',
        employeeName: '',
        employeePost: '',
        formTitle: '',
        flowName: '',
        currentStep: '',
        idea: '同意',
        state: 'true',
        name: ''
      }
    };
  },
  computed: {
    columns() {
      return [
        {
          name: '单据号',
          align: 'center',
          prop: 'formId'
        },
        {
          name: '标题',
          align: 'center',
          prop: 'formTitle'
        },
        {
          name: '申请人',
          align: 'center',
          prop: 'employeeName'
        },
        {
          name: '申请时间',
          align: 'center',
          prop: 'requestDate'
        },
        {
          name: '流程名称',
          align: 'center',
          prop: 'flowName'
        }
      ];
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 查询表格信息
      this.listLoading = true;
      const data = {
        employeeId: store.getters.authId,
        employeePost: store.getters.postId
      };
      workCenterApi
        .checkFlow(data)
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
    getDetail(row) {
      this.formId = row.formId;
      if (row.flowName === '请休假申请') {
        this.visibleRestForm = true;
      }
    },
    updateFlowCurrent() {
      workCenterApi
        .updateFlow(this.checkFlowForm)
        .then(res => {
          if (res.robj.updateStatus) {
            this.$message.success('保存成功!');
            this.init(); // 更新表格
          }
          this.visibleCheckFlow = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
          this.visibleCheckFlow = false;
        });
    },
    getMsg(row) {
      this.checkFlowForm.employeeId = row.employeeId;
      this.checkFlowForm.employeeName = row.employeeName;
      this.checkFlowForm.employeePost = row.employeePost;
      this.checkFlowForm.requestDate = row.requestDate;
      this.checkFlowForm.formId = row.formId;
      this.checkFlowForm.formTitle = row.formTitle;
      this.checkFlowForm.flowName = row.flowName;
      this.checkFlowForm.currentStep = row.currentStep;
      this.checkFlowForm.name = store.getters.name;
      this.visibleCheckFlow = true;
    },
    // 右侧功能栏
    columnsHandler(cols) {
      const that = this;
      return cols.concat(
        {
          width: 80,
          fixed: 'right',
          label: '详情',
          align: 'center',
          component: columnTowards,
          // listeners 可用于监听自定义组件内部 $emit 出的事件
          listeners: {
            'get-detail'(row) {
              that.getDetail(row);
            }
          }
        },
        {
          width: 80,
          fixed: 'right',
          label: '审批',
          align: 'center',
          component: columnLineChart,
          listeners: {
            'get-check'(row) {
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