<template>
  <div>
    <el-form ref="form"
      :model="employeeInfo"
      size="mini"
      label-suffix="："
      label-width="80px">
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="员工编号">
            <el-input v-model="employeeInfo.employeeId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话">
            <el-input v-model="employeeInfo.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="姓名">
            <el-input v-model="employeeInfo.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别">
            <el-input v-model="employeeInfo.sex"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="民族">
            <el-input v-model="employeeInfo.nation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="籍贯">
            <el-input v-model="employeeInfo.nativePlace"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="身份证号">
            <el-input v-model="employeeInfo.idCard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="住址">
            <el-input v-model="employeeInfo.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="部门">
            <el-input v-model="employeeInfo.deptName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="岗位">
            <el-input v-model="employeeInfo.postName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="出生日期">
            <el-input v-model="employeeInfo.dateBirth"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文化程度">
            <el-input v-model="employeeInfo.degree"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['employeeInfo'],
  data() {
    return {};
  },
  methods: {
    getUrl() {
      const data = {
        pageType: 'APP'
      };
      dictionaryApi
        .pageList(data)
        .then(res => {
          this.options = res.robj.items;
          this.initTableData();
        })
        .catch(res => {
          this.$message.error('数据请求失败');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
