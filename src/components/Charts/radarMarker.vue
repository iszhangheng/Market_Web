<template>
  <div :class="className"
    :id="chartId"
    :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
import resize from './mixins/resize';

export default {
  mixins: [resize],
  data() {
    return {
      chart: null,
      option: this.data
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.chart.setOption(this.option);
    }
  }
};
</script>
