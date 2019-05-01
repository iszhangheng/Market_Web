<template>
  <div>
    <span>
      <el-button @click="change()"
        size="mini" type="text"
        circle>{{this.$t('table.modify')}}</el-button>
    </span>
    <!-- <span>
      <el-button @click="delect()"
        size="mini" type="text"
        circle>{{this.$t('table.delete')}}</el-button>
    </span> -->
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  methods: {
    change() {
      this.$emit('modify-msg', this.row);
    }
    // delect() {
    //   this.$emit('delect-msg', this.row);
    // }
  }
};
</script>

<style lang="scss" scoped>
.content {
  height: 600px;
  padding: 0 20px;
  overflow: auto;
}
</style>
