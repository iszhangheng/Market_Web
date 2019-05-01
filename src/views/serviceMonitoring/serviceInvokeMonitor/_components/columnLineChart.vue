<template>
  <div>
    <a class="charts-alink" href="javascript:"
      @click="clickTo">
      <svg-icon icon-class="lineCharts" />
    </a>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    clickTo() {
      this.$emit('get-msg', this.row);
    }
  }
};
</script>
