<template>
  <div>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <el-form-item prop="name">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="page"
      v-if="dataShow">
      <p>暂无数据</p>
    </div>
    <line-marker v-else
      v-loading="loading"
      element-loading-text="Loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 255)"
      :data='lineOption'></line-marker>
  </div>
</template>

<script>
import lineMarker from '@/components/Charts/lineMarker';
// import performanceApi from '@/api/performance';
import mixin from '@/utils/mixin';
export default {
  props: {
    avgQueryTime: {
      type: Number,
      default: 0
    },
    maxQueryTime: {
      type: Number,
      default: 0
    },
    minQueryTime: {
      type: Number,
      default: 0
    }
  },
  mixins: [mixin],
  components: { lineMarker },
  data() {
    return {
      dataShow: true,
      loading: true,
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      lineOption: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        legend: {
          right: 10,
          top: 10,
          bottom: 10,
          data: ['请求平均耗时', '请求最长耗时', '请求最短耗时']
        },
        xAxis: {
          name: '日期',
          data: ['1']
        },
        yAxis: {
          name: ''
        },
        series: [
          {
            name: '请求平均耗时',
            type: 'line',
            data: []
          },
          {
            name: '请求最长耗时',
            type: 'line',
            data: []
          },
          {
            name: '请求最短耗时',
            type: 'line',
            data: []
          }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (
        (this.avgQueryTime && this.maxQueryTime && this.minQueryTime) === ''
      ) {
        this.loading = false;
        this.dataShow = true;
      } else {
        this.lineOption.series[0].data = this.avgQueryTime;
        this.lineOption.series[1].data = this.maxQueryTime;
        this.lineOption.series[2].data = this.minQueryTime;
        this.loading = false;
        this.dataShow = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  padding: 20px 0;
  p {
    color: #999;
    font-size: 16px;
    text-align: center;
  }
}
</style>
