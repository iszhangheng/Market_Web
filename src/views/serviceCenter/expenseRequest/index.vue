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
            <el-input v-model="form.restId"
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
            <el-input v-model="form.replaceName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="总金额：">
            <el-input v-model="form.phone"></el-input>
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
export default {
  name: 'pageAccess',
  data() {
    return {
      form: {
        restId: '',
        requestDate: '',
        employeeName: '',
        deptName: '',
        formTitle: '',
        replaceName: '',
        phone: '',
        remark: '',
        date: [],
        sumDay: ''
      }
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    // 保存请假单
    onSubmit() {
      this.$message.success('提交成功!');
      this.initForm();
    },
    computeSumDay() {
      if (this.form.date != null) {
        this.form.sumDay = Math.round(
          (this.form.date[1] - this.form.date[0]) / (3600 * 1000 * 24)
        );
      } else {
        this.form.sumDay = 0;
      }
    },
    initForm() {
      var myDate = new Date();
      this.form.restId = 'CCBX' + myDate.getTime();
      this.form.requestDate = this.myFormatDate(myDate);
      this.form.employeeName = '张三';
      this.form.deptName = '销售部';
      this.form.formTitle = '张三' + '的报销流程';
      this.form.replaceName = '';
      this.form.phone = '';
      this.form.remark = '';
      this.form.sumDay = 1;
      this.form.date = [
        new Date(),
        new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 1)
      ];
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

