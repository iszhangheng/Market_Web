<template>
  <div class="tiny-container">
    <h3 class="page-title">添加员工模块</h3>
    <employee-add-form></employee-add-form>
  </div>
</template>
<script>
import employeeAddForm from './_compontes/employeeAddForm';
export default {
  name: 'productDetails',
  components: {
    employeeAddForm
  }
};
</script>
<style lang="scss" scoped>
</style>