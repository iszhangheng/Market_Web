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
import behaviorApi from '@/api/behavior';
import mixin from '@/utils/mixin';
export default {
  props: ['url', 'newDate'],
  mixins: [mixin],
  components: { lineMarker },
  data() {
    return {
      dataShow: true,
      loading: true,
      list: [],
      date: this.newDate,
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
          data: ['停留时间', '页面受访设备数', '页面访问次数']
        },
        xAxis: {
          name: '日期',
          data: []
        },
        yAxis: {
          name: ''
        },
        series: [
          {
            name: '停留时间',
            type: 'line',
            data: []
          },
          {
            name: '页面受访设备数',
            type: 'line',
            data: []
          },
          {
            name: '页面访问次数',
            type: 'line',
            data: []
          }
        ]
      }
    };
  },
  watch: {
    url() {
      this.initViewData();
    },
    date() {
      this.initViewData();
    }
  },
  created() {
    this.initViewData();
  },
  methods: {
    initViewData() {
      const data = {
        pageUrl: this.url,
        startDate: this.startDate,
        endDate: this.endDate
      };
      behaviorApi
        .pageTendency(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            for (let i = 0; i < res.robj.items.length - 1; i++) {
              for (let j = i + 1; j < res.robj.items.length; j++) {
                if (
                  parseInt(res.robj.items[i].dataTime) >
                  parseInt(res.robj.items[j].dataTime)
                ) {
                  const temp = res.robj.items[i];
                  res.robj.items[i] = res.robj.items[j];
                  res.robj.items[j] = temp;
                }
              }
            }
            this.list = res.robj.items;
          } else {
            this.list = [];
          }
          if (this.list.length > 0) {
            const sumTimeData = [];
            const countData = [];
            const deviceViewData = [];
            const chartData = [];
            res.robj.items.forEach(item => {
              chartData.push(item.dataTime);
              sumTimeData.push((item.sumTime / (60 * 60 * 1000)).toFixed(2));
              deviceViewData.push(item.deviceViewTimes);
              countData.push(item.pageViewTimes);
            });
            this.lineOption.xAxis.data = chartData;
            this.lineOption.series[0].data = sumTimeData;
            this.lineOption.series[1].data = deviceViewData;
            this.lineOption.series[2].data = countData;
            this.dataShow = false;
            this.loading = false;
          } else {
            this.dataShow = true;
            this.loading = false;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
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
