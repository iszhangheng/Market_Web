<template>
  <div>
    <div class="date">
      <el-form class="search-form"
        :inline="true"
        size="mini">
        <el-form-item prop="name"
        :label="this.$t('views.dateType')">
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
    <div>
      <bar-marker :data='barOption'></bar-marker>
    </div>
  </div>
</template>

<script>
import appApi from '@/api/app';
import mixin from '@/utils/mixin';
import barMarker from '@/components/Charts/barMarker';
export default {
  name: 'cycleDevChange',
  mixins: [mixin],
  components: {
    barMarker
  },
  data() {
    return {
     date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ], // 选中时间的值
      dataShow: false,
      // 绘制柱状图数据
      barOption: {
        // 柱状图参数
        title: {
          text: ''
        },
        legend: {
          data: ['用户数量']
        },
        xAxis: [
          {
            name: '更换周期'
          }
        ],
        yAxis: [
          {
            name: '用户数量'
          }
        ],
        series: [
          {
            name: ['用户数量'],
            data: []
          }
        ]
      }
    };
  },
  watch: {
    date: function () {
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init: function () {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      appApi.appPageDAE(data)
        .then(res => {
          const chartData = [];
          res.robj.items.forEach(item => {
            chartData.push([
              item.day,
              item.userNum
            ]);
          });
          this.barOption.series[0].data = [];
          this.barOption.xAxis[0].data = [];
          chartData.forEach(item => {
            this.barOption.series[0].data.push(item[1]);
            this.barOption.xAxis[0].data.push(item[0]);
          });
          this.tabLoading = true;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    showDataSort: function (chartData) {
      for (let i = 0; i < chartData.length - 1; i++) {
        for (let j = i + 1; j < chartData.length; j++) {
          let temp = [];
          if (chartData[i][0] > chartData[j][0]) {
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

<style lang="scss">
.date {
  text-align: right;
}
</style>
