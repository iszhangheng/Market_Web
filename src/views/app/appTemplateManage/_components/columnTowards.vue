<template>
  <div>
    <span>
      <el-button @click="modify()"
        size="mini"
        type="text"
        circle>{{this.$t('table.change')}}</el-button>
    </span>
    <span>
      <el-button @click="delect()"
        size="mini"
        type="text"
        circle>{{this.$t('table.delete')}}</el-button>
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
    modify() {
      this.$emit('modify-msg', this.row);
    },
    delect() {
      this.$emit('delect-msg', this.row);
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
