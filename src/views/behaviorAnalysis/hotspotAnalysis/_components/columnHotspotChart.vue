<template>
  <div>
    <a class="charts-alink" href="javascript:"
      @click="clickTo">
      <svg-icon icon-class="hotspotCharts" />
    </a>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  methods: {
    clickTo() {
      this.$emit('get-msg', this.row);
    }
  }
};
</script>
