<template>
  <div>
    <div class="date">
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
    </div>
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
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  components: { lineMarker },
  data() {
    return {
      dataShow: false,
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
          data: ['用户数量']
        },
        xAxis: {
          name: '首次注册日',
          data: []
        },
        yAxis: {
          name: ''
        },
        series: [
          {
            name: '用户数量',
            type: 'line',
            data: []
          }
        ]
      }
    };
  },
  watch: {
    date() {
      this.initViewData();
    }
  },
  mounted() {
    this.initViewData();
  },
  methods: {
    initViewData() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      userApi
        .userRegistTime(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const fristUserNumData = []; // 人数
            let chartData = [];
            res.robj.items.forEach(item => {
              chartData.push(item.registTime);
              fristUserNumData.push(item.num);
            });
            chartData = this.showDataSort(chartData);
            this.lineOption.xAxis.data = chartData;
            this.lineOption.series[0].data = fristUserNumData;
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
.date {
  text-align: right;
}
</style>
