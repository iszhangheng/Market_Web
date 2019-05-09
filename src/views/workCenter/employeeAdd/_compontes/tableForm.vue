<template>
  <div>
    <el-form ref="form"
      :model="employeeInfo"
      size="mini"
      label-suffix="："
      label-width="100px">
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="员工编号">
            <el-input v-model="employeeInfo.employeeId"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="4">
          <el-form-item label="姓名">
            <el-input v-model="employeeInfo.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="性别">
            <el-select v-model="employeeInfo.sex">
              <el-option label="男"
                value="男"></el-option>
              <el-option label="女"
                value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="部门/岗位">
            <el-cascader :options="deptPost"
              v-model="selectedOptions">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="电话">
            <el-input v-model="employeeInfo.phone"></el-input>
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
      </el-row>
      <el-row>
        <el-col :span="8">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary"
              @click="onSubmit">创建</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { deptPostList } from '@/utils/baseTools';
export default {
  data() {
    return {
      selectedOptions: [],
      deptPost: deptPostList,
      employeeInfo: {
        employeeId: '',
        name: '',
        sex: '',
        phone: '',
        idCard: ''
      }
    };
  },
  mounted() {
    this.initForm();
  },
  methods: {
    onSubmit() {
      this.onSubmit();
    },
    addEmployeeInfo() {
      const data = {
        employeeId: this.employeeInfo.employeeId,
        name: this.employeeInfo.name,
        sex: this.employeeInfo.sex,
        phone: this.employeeInfo.phone,
        idCard: this.employeeInfo.idCard,
        dept: this.selectedOptions[0],
        post: this.selectedOptions[1]
      };
      console.log(data);
      // dictionaryApi
      //   .pageList(data)
      //   .then(res => {
      //     this.options = res.robj.items;
      //     this.initTableData();
      //   })
      //   .catch(res => {
      //     this.$message.error('数据请求失败');
      //   });
    },
    initForm() {
      this.employeeInfo.employeeId = new Date().getTime();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
