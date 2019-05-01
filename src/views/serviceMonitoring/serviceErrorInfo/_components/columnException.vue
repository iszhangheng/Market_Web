<template>
  <div>
    <el-button type="danger"
      size="mini"
      round
      @click="clickTo">
      {{val}}
    </el-button>
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
      this.$emit('custom-event', this.row);
    }
  }
};
</script>
