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
import productApi from '@/api/product';
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  props: ['date'],
  components: { barMarker },
  data() {
    return {
      dataShow: true,
      loading: true,
      list: [],
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
          data: ['交易笔数', '成交笔数', '交易失败笔数']
        },
        xAxis: [
          {
            name: '日期',
            type: 'category',
            axisTick: { show: false },
            data: []
          }
        ],
        yAxis: [
          {
            name: '交易数量',
            type: 'value'
          }
        ],
        series: [
          {
            name: '交易笔数',
            // barGap: 0,
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                fontSize: 16,
                rich: {
                  name: {
                    textBorderColor: '#fff'
                  }
                }
              }
            },
            data: []
          },
          {
            name: '成交笔数',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                fontSize: 16,
                rich: {
                  name: {
                    textBorderColor: '#fff'
                  }
                }
              }
            },
            data: []
          },
          {
            name: '交易失败笔数',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                fontSize: 16,
                rich: {
                  name: {
                    textBorderColor: '#fff'
                  }
                }
              }
            },
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
      productApi
        .dataSummary(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            for (let i = 0; i < res.robj.items.length - 1; i++) {
              for (let j = i + 1; j < res.robj.items.length; j++) {
                if (
                  parseInt(res.robj.items[i].date) >
                  parseInt(res.robj.items[j].date)
                ) {
                  const temp = res.robj.items[i];
                  res.robj.items[i] = res.robj.items[j];
                  res.robj.items[j] = temp;
                }
              }
            }
            this.list = res.robj.items;
            this.dataShow = false;
            this.loading = false;
          } else {
            this.list = [];
            this.dataShow = true;
            this.loading = false;
          }
          const tradData = []; // 交易笔数
          const dealData = []; // 成交笔数
          const tradFailData = []; // 交易失败笔数
          const chartData = [];
          if (this.list.length > 0) {
            res.robj.items.forEach(item => {
              chartData.push(item.date);
              tradData.push(item.sumTotal);
              dealData.push(item.sucTotal);
              tradFailData.push(item.failTotal);
            });
            this.barOption.xAxis[0].data = chartData;
            this.barOption.series[0].data = tradData;
            this.barOption.series[1].data = dealData;
            this.barOption.series[2].data = tradFailData;
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
