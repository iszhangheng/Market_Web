<template>
  <div>
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
// import behaviorApi from '@/api/behavior';
import mixin from '@/utils/mixin';
export default {
  props: {
    retainedList: {
      type: Array,
      default: []
    }
  },
  mixins: [mixin],
  components: {
    lineMarker
  },
  data() {
    return {
      dataShow: true,
      loading: true,
      list: [],
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
          data: ['留存人数']
        },
        xAxis: {
          name: '日期',
          data: [
            '第0天',
            '第1天',
            '第2天',
            '第3天',
            '第4天',
            '第5天',
            '第6天',
            '第7天'
          ]
        },
        yAxis: {
          name: '人数'
        },
        series: [
          {
            name: '留存人数',
            type: 'line',
            data: []
          }
        ]
      }
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init() {
        if (this.retainedList.length > 0 && this.retainedList[0] !== null) {
          this.lineOption.series[0].data = this.retainedList;
          this.dataShow = false;
          this.loading = false;
        } else {
          this.dataShow = true;
          this.loading = false;
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