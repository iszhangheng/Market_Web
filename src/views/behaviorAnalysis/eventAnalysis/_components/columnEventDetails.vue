<template>
  <div>
    <span>
      <el-button @click="clickTo"
        size="mini"
        type="text"
        circle>{{this.$t('table.detail')}}</el-button>
    </span>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  data() {
    return {};
  },
  methods: {
    clickTo() {
      this.$emit('get-detail', this.row);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
