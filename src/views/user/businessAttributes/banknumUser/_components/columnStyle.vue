<template>
  <div>
    <el-tag v-if="col.prop === 'status' && row.status === '已入驻'"
      size="small"
      type="">{{val}}</el-tag>
    <el-tag v-if="col.prop === 'status' && row.status === '未入驻'"
      size="small"
      type="danger">{{val}}</el-tag>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'val'],
  data() {
    return {};
  }
};
</script>

