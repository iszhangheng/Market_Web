<template>
  <div>
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
  props: ['date'],
  mixins: [mixin],
  components: { barMarker },
  data() {
    return {
      dataShow: true,
      loading: true,
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
          data: ['银行编号', '用户数量'],
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
            name: '',
            type: 'value',
            data: []
          }
        ],
        yAxis: [
          {
            name: '日期',
            type: 'category',
            data: []
          }
        ],
        series: [
          {
            name: '银行编号',
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
        .userNotinBank(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const bankNoData = []; // 银行编号
            const bankUserData = []; // 用户人数
            let chartData = [];
            res.robj.items.forEach(item => {
              if (item.bankNo === null || item.bankNo === undefined) {
                item.bankNo === '未知';
              }
              chartData.push(item.dateType);
              bankNoData.push(item.bankNo);
              bankUserData.push(item.num);
            });
            chartData = this.showDataSort(chartData);
            this.barOption.yAxis[0].data = chartData;
            this.barOption.series[0].data = bankNoData;
            this.barOption.series[1].data = bankUserData;
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
