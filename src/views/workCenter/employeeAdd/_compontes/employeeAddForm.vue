<template>
  <div>
    <el-row>
      <el-col :span="4">&nbsp;</el-col>
      <el-col :span="12">
        <el-form :model="employeeInfo"
          :rules="rules"
          ref="employeeForm"
          label-width="100px"
          label-suffix="："
          class="demo-employeeForm">
          <el-form-item label="登录账号"
            prop="account">
            <el-input v-model="employeeInfo.account"></el-input>
          </el-form-item>
          <el-form-item label="员工姓名"
            prop="employeeName">
            <el-input v-model="employeeInfo.employeeName"></el-input>
          </el-form-item>
          <el-form-item label="性别"
            prop="sex">
            <el-select v-model="employeeInfo.sex">
              <el-option label="男"
                value="男"></el-option>
              <el-option label="女"
                value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门/岗位"
            prop="deptPost">
            <el-cascader :options="deptPost"
              v-model="selectedOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="电话"
            prop="phone">
            <el-input v-model="employeeInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证号"
            prop="idCard">
            <el-input v-model="employeeInfo.idCard"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              @click="submitForm('employeeInfo')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import workCenterApi from '@/api/workCenter';
import { deptPostList } from '@/utils/baseTools';
export default {
  name: 'employeeAddForm',
  data() {
    return {
      selectedOptions: [],
      deptPost: deptPostList,
      employeeInfo: {
        employeeId: '',
        employeeName: '',
        account: '',
        sex: '',
        idCard: '',
        deptPost: '',
        phone: ''
      },
      rules: {
        employeeName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入员工登录账号', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择员工性别', trigger: 'blur' }],
        idCard: [{ required: true, message: '请输入身份证', trigger: 'blur' }],
        deptPost: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入员工电话', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    submitForm() {
      const data = {
        employeeId: this.employeeInfo.employeeId,
        account: this.employeeInfo.account,
        name: this.employeeInfo.employeeName,
        sex: this.employeeInfo.sex,
        phone: this.employeeInfo.phone,
        idCard: this.employeeInfo.idCard,
        dept: this.selectedOptions[0],
        post: this.selectedOptions[1]
      };
      workCenterApi
        .addEmployee(data)
        .then(res => {
          if (res.robj.addStatus) {
            this.$message.success('添加成功');
          } else {
            this.$message.error('添加成功');
          }
        })
        .catch(res => {
          this.$message.error('码表数据请求失败!');
        });
      this.initForm();
    },
    initForm() {
      this.employeeInfo.employeeId = new Date().getTime();
      this.employeeInfo.account = '';
      this.employeeInfo.sex = '';
      this.employeeInfo.idCard = '';
      this.employeeInfo.deptPost = '';
      this.employeeInfo.phone = '';
      this.employeeInfo.employeeName = '';
      this.selectedOptions.length = 0;
    }
  }
};
</script>