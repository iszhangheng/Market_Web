<template>
  <div>
    <span>
      <el-button @click="clickTo"
        size="mini" type="text"
        circle>{{this.$t('table.detail')}}</el-button>
    </span>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  methods: {
    clickTo() {
      this.$emit('get-towards', this.row);
    }
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
