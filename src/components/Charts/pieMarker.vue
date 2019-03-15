<template>
  <div :class="className"
    :id="chartId"
    :style="{height:height,width:width}"></div>
</template>

<script>
import _ from 'lodash';
import echarts from 'echarts';
import resize from './mixins/resize';
const defaultPie = {
  title: {
    text: '行为分析', // 待传值
    subtext: '模板', // 待传值
    x: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '<br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    x: 'left',
    data: [] // 待传值
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '55%'],
      data: [] // 待传值
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
    this.initChart();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.option = _.merge({}, defaultPie, this.option);
      this.chart.setOption(this.option, true);
    }
  }
};
</script>
