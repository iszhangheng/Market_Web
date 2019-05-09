<template>
  <div class="tiny-container">
    <h3 class="page-title">个人信息</h3>
    <div class="employee-form">
      <el-form ref="form"
        :model="form"
        size="mini"
        label-width="80px">
        <el-row>
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="6">
            <el-form-item label="员工编号">
              <el-input v-model="employeeInfo.employeeId"
                disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电话">
              <el-input v-model="employeeInfo.phone"
                disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="employeeInfo.name"
                disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别">
              <el-input v-model="employeeInfo.sex"
                disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="6">
            <el-form-item label="身份证号">
              <el-input v-model="employeeInfo.idCard"
                disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-input v-model="employeeInfo.deptName"
                disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="岗位">
              <el-input v-model="employeeInfo.postName"
                disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import personDetailsApi from '@/api/personDetails';
export default {
  name: 'pageAccess',
  data() {
    return {
      employeeInfo: {
        employeeId: '',
        name: '',
        sex: '',
        nation: '',
        nativePlace: '',
        dateBirth: '',
        postName: '',
        deptName: '',
        degree: '',
        phone: '',
        idCard: '',
        address: ''
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 查询表格信息
      this.listLoading = true;
      personDetailsApi
        .myInfo()
        .then(res => {
          this.listLoading = false;
          this.employeeInfo = res.robj;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
          this.listLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

