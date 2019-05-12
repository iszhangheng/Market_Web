<template>
  <div class="tiny-container"
    style="hight:300px">
    <h3 class="page-title">请休假申请</h3>
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
              disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="申请日期：">
            <el-input v-model="form.requestDate"
              disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="申请人：">
            <el-input v-model="form.employeeName"
              disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="部门：">
            <el-input v-model="form.deptName"
              disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="标题：">
            <el-input v-model="form.formTitle" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="休假类型：">
            <el-input v-model="form.restType" disabled ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="工作代理人：">
            <el-input v-model="form.replaceName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话：">
            <el-input v-model="form.phone" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="20">
          <el-form-item label="备注：">
            <el-input type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              size="mini"
              disabled
              placeholder="请输入内容"
              v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item prop="name"
            label="请假时间：">
            <el-date-picker v-model="form.date"
              type="daterange"
              align="center"
              unlink-panels
              disabled
              :start-placeholder="this.$t('date.start')"
              :end-placeholder="this.$t('date.end')"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="总天数：">
            <el-input v-model="form.sumDay"
              disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import serviceCenterApi from '@/api/serviceCenter';
export default {
  name: 'restForm',
  props: ['formId'],
  data() {
    return {
      form: {
        formId: '', // 流程ID
        requestDate: '', // 请假日期
        employeeName: '', // 员工姓名
        deptName: '', // 部门名
        formTitle: '', // 标题
        replaceName: '', // 工作代理人
        phone: '', // 代理人电话
        remark: '', // 备注
        date: [], // 请假时间段
        sumDay: '', // 总天数
        restType: '' // 请假类型
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const data = {
        formId: this.formId
      };
      serviceCenterApi
        .getRestInfo(data)
        .then(res => {
          const resultForm = res.robj.items[0];
          this.form.formId = resultForm.formId;
          this.form.requestDate = resultForm.requestDate;
          this.form.employeeName = resultForm.employeeName;
          this.form.deptName = resultForm.deptName;
          this.form.formTitle = resultForm.formTitle;
          this.form.replaceName = resultForm.replaceName;
          this.form.phone = resultForm.phone;
          this.form.remark = resultForm.remark;
          this.form.sumDay = resultForm.sumDay;
          this.form.restType = resultForm.restType;
          this.form.date = [
            new Date().setTime(resultForm.startDate),
            new Date().setTime(resultForm.endDate)
          ];
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>