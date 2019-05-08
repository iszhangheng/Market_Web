<template>
  <div class="tiny-container">
    <h3 class="page-title">添加用工模块</h3>
    <table-form :employeeInfo="employeeInfo"></table-form>
  </div>
</template>

<script>
import workCenterApi from '@/api/workCenter';
import tableForm from './_compontes/tableForm';
export default {
  name: 'productDetails',
  components: {
    tableForm
  },
  data() {
    return {
      listLoading: false, // 加载动画开关
      employeeInfo: {}
    };
  },
  mounted() {
    // this.init();
  },
  methods: {
    init() {
      // 查询表格信息
      this.listLoading = true;
      const data = {};
      workCenterApi
        .employeeAdd(data)
        .then(res => {
          this.total = res.robj.total;
          this.list = res.robj.items;
          this.listLoading = false;
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