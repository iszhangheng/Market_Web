<template>
  <div>
    <a href="javascript:" class="chartBtn"
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

<style lang="scss" scoped>
.chartBtn {
  font-size: 20px;
  cursor: pointer;
  &:hover{
    color: #3b87f2;
  }
}
</style>
