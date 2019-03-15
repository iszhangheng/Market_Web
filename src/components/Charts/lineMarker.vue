<template>
  <div :class="className"
    :id="chartId"
    :style="{height:height,width:width}"></div>
</template>

<script>
import _ from 'lodash';
import echarts from 'echarts';
import resize from './mixins/resize';
const defaultLine = {
  title: {
    text: '行为分析'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'cross'
    }
  },
  legend: {
    data: ['legend']
  },
  xAxis: {
    type: 'category',
    name: 'name',
    data: []
  },
  yAxis: {
    type: 'value',
    name: 'name'
  },
  series: [
    {
      type: 'line',
      name: 'name',
      data: []
    }
  ]
};
export default {
  mixins: [resize],
  data() {
    return {
      chart: null,
      option: this.data
    };
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.option = this.data;
        this.initChart();
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.initChart();
    });
  },
  methods: {
    // 初始化
    initChart: function() {
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.option = _.merge({}, defaultLine, this.option);
      this.chart.setOption(this.option);
    }
  }
};
</script>
