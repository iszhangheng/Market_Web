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
import appApi from '@/api/app';
import mixin from '@/utils/mixin';
export default {
  props: ['url', 'newdate'],
  mixins: [mixin],
  components: { lineMarker },
  data() {
    return {
      dataShow: true,
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
          data: ['停留时间/h', '页面受访人数', '页面访问次数']
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
            name: '停留时间/h',
            type: 'line',
            data: []
          },
          {
            name: '页面受访人数',
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
      appApi
        .appLineChart(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const sumTimeData = [];
            const countData = [];
            const usersData = [];
            let chartData = [];
            res.robj.items.forEach(item => {
              chartData.push(item.dataTime);
              sumTimeData.push((item.sumTime / 1000 / 3600).toFixed(2));
              usersData.push(item.users);
              countData.push(item.count);
            });
            chartData = this.showDataSort(chartData);
            this.lineOption.xAxis.data = chartData;
            this.lineOption.series[0].data = sumTimeData;
            this.lineOption.series[1].data = usersData;
            this.lineOption.series[2].data = countData;
            this.dataShow = false;
            this.loading = false;
          } else {
            this.dataShow = true;
            this.loading = true;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    showDataSort(chartData) {
      for (let i = 0; i < chartData.length - 1; i++) {
        for (let j = i + 1; j < chartData.length; j++) {
          let temp = [];
          if (chartData[i] > chartData[j]) {
            temp = chartData[i];
            chartData[i] = chartData[j];
            chartData[j] = temp;
          }
        }
      }
      return chartData;
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
