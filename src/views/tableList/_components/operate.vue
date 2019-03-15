<template>
  <div>
    <el-button @click="removeMesg"
      type="text">删除</el-button>
    <el-button @click="updataMesg"
      type="text">修改</el-button>
  </div>
</template>

<script>
export default {
  props: ['row', 'column'],
  methods: {
    removeMesg() {
      this.$emit('remove-mesg', this.row);
    },
    updataMesg() {
      this.$emit('updata-mesg', this.row);
    }
  }
};
</script>