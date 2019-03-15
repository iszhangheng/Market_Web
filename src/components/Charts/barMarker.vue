<template>
  <div :class="className"
    :id="chartId"
    :style="{height:height,width:width}"></div>
</template>

<script>
import _ from 'lodash';
import echarts from 'echarts';
import resize from './mixins/resize';
const defaultBar = {
  title: {
    text: '行为分析'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
      type: 'bar',
      name: 'name',
      data: []
    }
  ]
};
export default {
  mixins: [resize],
  data() {
    return {
      timer: '',
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
    this.initChart();
  },
  methods: {
    // 初始化
    initChart: function() {
      this.option = _.merge({}, defaultBar, this.option);
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.chart.setOption(this.option, true);
    }
  }
};
</script>
