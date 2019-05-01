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
  mixins: [mixin],
  props: ['date'],
  components: { barMarker },
  data() {
    return {
      list: [],
      dataShow: false,
      loading: false,
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
          data: ['男用户数', '女用户数', '未知用户数']
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
            name: '用户数量',
            type: 'value'
          }
        ],
        series: [
          {
            name: '男用户数',
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
            name: '女用户数',
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
            name: '未知用户数',
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
      this.dataShow = true;
      this.loading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      userApi
        .registerSex(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            for (let i = 0; i < res.robj.items.length - 1; i++) {
              for (let j = i + 1; j < res.robj.items.length; j++) {
                if (
                  parseInt(res.robj.items[i].dateType) >
                  parseInt(res.robj.items[j].dateType)
                ) {
                  const temp = res.robj.items[i];
                  res.robj.items[i] = res.robj.items[j];
                  res.robj.items[j] = temp;
                }
              }
            }
            this.list = res.robj.items;
            const manData = [];
            const mysteryData = [];
            const womanData = [];
            const chartData = [];
            this.list.forEach(item => {
              chartData.push(item.dateType);
              manData.push(item.man);
              mysteryData.push(item.mystery);
              womanData.push(item.woman);
            });
            this.barOption.xAxis[0].data = chartData;
            this.barOption.series[0].data = manData;
            this.barOption.series[1].data = womanData;
            this.barOption.series[2].data = mysteryData;
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
