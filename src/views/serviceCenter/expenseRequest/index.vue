<template>
  <div class="tiny-container"
    style="hight:300px">
    <h3 class="page-title">出差报销</h3>
    <!-- 请假表头 -->
    <el-form ref="form"
      class="leftHeader"
      :model="form"
      size="mini"
      label-width="120px">
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="单据号：">
            <el-input v-model="form.formId"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="申请日期：">
            <el-input v-model="form.requestDate"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="申请人：">
            <el-input v-model="form.employeeName"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="部门：">
            <el-input v-model="form.deptName"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="标题：">
            <el-input v-model="form.formTitle"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="收款银行卡号：">
            <el-input v-model="form.bankId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="总金额：">
            <el-input v-model="form.money"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="20">
          <el-form-item label="项目罗列：">
            <el-input type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              size="mini"
              placeholder="请输入内容"
              v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">&nbsp;</el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary"
              @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import store from '@/store';
import serviceCenterApi from '@/api/serviceCenter';
export default {
  name: 'pageAccess',
  data() {
    return {
      form: {
        formId: '', // 流程ID
        requestDate: '', // 申请日期
        employeeName: '', // 员工姓名
        deptName: '', // 部门名
        formTitle: '', // 标题
        bankId: '', // 银行卡号
        money: '', // 金额
        remark: '' // 备注
      }
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    init() {
      this.listLoading = true;
      const data = {
        formId: this.form.formId,
        requestDate: this.form.requestDate,
        employeeId: store.getters.authId,
        employeeName: this.form.employeeName,
        employeePost: store.getters.postId,
        deptName: this.form.deptName,
        formTitle: this.form.formTitle,
        bankId: this.form.bankId,
        money: this.form.money,
        remark: this.form.remark
      };
      serviceCenterApi
        .addBuyInfo(data)
        .then(res => {
          if (res.robj.addStatus) {
            this.$message.success('保存成功!');
          } else {
            this.$message.error('保存失败!');
          }
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
          this.listLoading = false;
        });
    },
    // 保存请假单
    onSubmit() {
      this.init();
      this.initForm();
    },
    initForm() {
      var myDate = new Date();
      this.form.formId = 'CCBX' + myDate.getTime();
      this.form.requestDate = this.myFormatDate(myDate);
      this.form.employeeName = store.getters.name;
      this.form.deptName = store.getters.deptName;
      this.form.formTitle = store.getters.name + '的报销流程';
      this.form.bankId = '';
      this.form.money = '';
      this.form.remark = '';
    },
    myFormatDate(date) {
      var strDate = date.getFullYear() + '-';
      const month = date.getMonth() + 1;
      strDate += (month < 10 ? '0' + month : month) + '-';
      const day = date.getDate();
      strDate += day < 10 ? '0' + day : day;
      return strDate;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

