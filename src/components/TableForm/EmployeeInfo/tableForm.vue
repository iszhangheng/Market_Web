<template>
  <div>
    <el-form ref="form"
      :model="employeeInfo"
      size="mini"
      label-suffix="："
      label-width="80px">
      <el-row>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="员工编号">
            <el-input v-model="employeeInfo.employeeId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="姓名">
            <el-input v-model="employeeInfo.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="电话">
            <el-input v-model="employeeInfo.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item label="部门/岗位"
            prop="deptPost">
            <el-cascader :options="deptPost"
              v-model="selectedOptions">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { deptPostList } from '@/utils/baseTools';
export default {
  props: ['employeeInfo'],
  data() {
    return {
      selectedOptions: [],
      deptPost: deptPostList
    };
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
