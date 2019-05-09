<template>
  <div class="tiny-container">
    <h3 class="page-title">采购清单</h3>
    <table-form></table-form>
  </div>
</template>
<script>
import tableForm from './_components/tableForm';
export default {
  name: 'purchaseRequest',
  components: {
    tableForm
  }
};
</script>
<style lang="scss" scoped>
</style>