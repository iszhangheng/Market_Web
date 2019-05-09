<template>
  <div>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 时间选择 -->
      <el-form-item prop="name">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          :start-placeholder="this.$t('date.start')"
          :end-placeholder="this.$t('date.end')"
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
import mixin from '@/utils/mixin';
export default {
  props: ['productId'],
  mixins: [mixin],
  components: { lineMarker },
  data() {
    return {
      dataShow: false,
      loading: true,
      // date: [
      //   new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
      //   new Date()
      // ],
      date: this.newdate,
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
          data: ['折扣']
        },
        xAxis: {
          name: '折扣',
          data: []
        },
        yAxis: {
          name: ''
        },
        series: [
          {
            name: '销售数量',
            type: 'line',
            data: []
          }
        ]
      }
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    initForm() {
      this.lineOption.xAxis.data = ['5', '6', '7', '8'];
      this.lineOption.series[0].data = [12, 64, 12, 24];
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
