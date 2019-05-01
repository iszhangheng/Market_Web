<template>
 <div>
  <div class="date">
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
  name: 'userNotinBank',
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
            name: '用户数量'
          }
        ],
        yAxis: [
          {
            name: '银行编号',
            data: []
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
    userApi.userNotinBank(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
          let chartData = [];
          res.robj.items.forEach(item => {
            if (item.bankNo === null || item.bankNo === undefined) {
              item.bankNo = '未知';
            }
            chartData.push([item.bankNo, item.num]);
          });
          chartData = this.showDataSort(chartData);
          this.barOption.yAxis[0].data = [];
          this.barOption.series[0].data = [];
          chartData.forEach(item => {
            this.barOption.yAxis[0].data.push(item[0]);
            this.barOption.series[0].data.push(item[1]);
          });
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
