<template>
<div>
  <div class="date">
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 时间选择 -->
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
    <!-- 柱状图 -->
    <bar-marker v-else
      v-loading="loading"
      element-loading-text="Loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 255)" 
     :data='barOption'></bar-marker>
 </div>
</template>

<script>
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
import barMarker from '@/components/Charts/barMarker';
export default {
  name: 'numDevChange',
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
      loading: true,
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
            name: '更换次数'
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
    date() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      userApi.numDevChangeSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
          let chartData = [];
          res.robj.items.forEach(item => {
            chartData.push([item.devChangeNum, item.num]);
          });
          chartData = this.showDataSort(chartData);
          this.barOption.series[0].data = [];
          this.barOption.xAxis[0].data = [];
          chartData.forEach(item => {
            this.barOption.series[0].data.push(item[1]);
            this.barOption.xAxis[0].data.push(item[0]);
            this.dataShow = false;
            this.loading = false;
          });
          } else {
            this.dataShow = true;
            this.loading = true;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
  showDataSort: function(chartData) {
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
.page {
  padding: 20px 0;
  p {
    color: #999;
    font-size: 16px;
    text-align: center;
  }
}
.elForm {
  text-align: right;
}
</style>