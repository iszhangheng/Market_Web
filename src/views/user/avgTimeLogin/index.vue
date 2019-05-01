<template>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id主键"
        width="180">
      </el-table-column>
      <el-table-column
        prop="dateType"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="avgLoginTime"
        label="平均登录时长">
      </el-table-column>
      <el-table-column
        prop="num"
        label="用户数量">
      </el-table-column>
    </el-table>
  </template>
<script>
import { IavgTimeLogin } from '@/api/tinyuba';
export default {
  name: 'avgTimeLogin',
  data() {
    return {
      tableData: []
    };
  },
  created() {
    IavgTimeLogin().then(res => {
      const arr = [];
      var msgList = res.robj.msg;
      for (let i = 0; i < msgList.length; i++) {
        arr.push(msgList[i]);
      }
      this.tableData = arr;
    });
  }
};
</script>
<style lang="scss" scoped>
// ...
</style>
