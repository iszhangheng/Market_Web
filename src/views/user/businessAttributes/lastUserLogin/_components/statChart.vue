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
import barMarker from '@/components/Charts/barMarker';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  components: { barMarker },
  data() {
    return {
      dataShow: true,
      loading: true,
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      barOption: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['最后登录时间', '用户数量'],
          normal: {
            show: true,
            formatter: '{c}  {name|{a}}',
            rich: {
              name: {
                textBorderColor: '#fff'
              }
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '最后登录时间',
            barGap: 0,
            type: 'bar',
            data: []
          },
          {
            name: '用户数量',
            type: 'bar',
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
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      userApi
        .lastUserLogin(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const lastLoginTimeData = []; // 最后登录时间
            const lastLoginNumData = []; // 用户人数
            let chartData = [];
            res.robj.items.forEach(item => {
              chartData.push(item.dateType);
              lastLoginTimeData.push(item.lastLoginTime);
              lastLoginNumData.push(item.num);
            });
            chartData = this.showDataSort(chartData);
            this.barOption.xAxis[0].data = chartData;
            this.barOption.series[0].data = lastLoginTimeData;
            this.barOption.series[1].data = lastLoginNumData;
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
