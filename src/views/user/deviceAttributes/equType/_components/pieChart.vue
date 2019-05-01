<template>
  <div>
    <div class="page"
      v-if="dataShow">
      <p>暂无数据</p>
    </div>
    <pie-marker v-else
      v-loading="loading"
      element-loading-text="Loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 255)"
      :data='pieOption'></pie-marker>
  </div>
</template>

<script>
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
import pieMarker from '@/components/Charts/pieMarker';
export default {
  name: 'devModel',
  mixins: [mixin],
  props: ['date'],
  components: {
    pieMarker
  },
  data() {
    return {
      dataShow: false,
      loading: true,
      pieOption: {
        title: {
          text: '用户设备版本的分布情况', // 待传值
          subtext: '数量比例' // 待传值
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b} 人数: {c}人 占比({d}%)'
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          y: 'bottom',
          data: [] // 待传值
        },
        series: [
          {
            name: '用户设备型号(半径模式)', // 待传值
            type: 'pie',
            radius: [20, 110],
            center: ['25%', '50%'],
            roseType: 'radius',
            // label: {
            //   normal: {
            //     show: false
            //   },
            //   emphasis: {
            //     show: true
            //   }
            // },
            data: [] // 待传值
          },
          {
            name: '用户设备版本(面积模式)', // 待传值
            type: 'pie',
            radius: [30, 110],
            center: ['75%', '50%'],
            roseType: 'area',
            data: [] // 待传值
          }
        ]
      }
    };
  },
  watch: {
    date: function() {
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
      userApi
        .devModelSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const pieTypeData = [];
            res.robj.items.map(item => {
              if (item.deviceModel === null || item.deviceModel === undefined) {
                item.deviceModel = '未知';
              }
              pieTypeData.push({ value: item.num, name: item.deviceModel });
            });
            userApi
              .devVersionSum(data)
              .then(res => {
                if (res.robj.items.length > 0) {
                  const pieVersionData = [];
                  res.robj.items.map(element => {
                    pieVersionData.push({
                      value: element.num,
                      name: element.devVersion
                    });
                  });
                  this.pieOption.legend.data = pieVersionData;
                  this.pieOption.series[1].data = pieVersionData;
                  this.dataShow = false;
                  this.loading = false;
                } else {
                  this.dataShow = true;
                  this.loading = true;
                }
              })
              .catch(res => {
                this.$message.error('数据请求失败');
              });
            this.pieOption.series[0].data = pieTypeData;
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
    }
    // pieOption_legend_data(pieTypeData) {
    //   const pie = [];
    //   for (let i = 0; i < pieTypeData.length; i++) {
    //     let tager = true;
    //     for (let j = 0; j < pie.length; j++) {
    //       if (pie[j] === pieTypeData[i].name) {
    //         tager = false;
    //       }
    //     }
    //     if (tager) {
    //       pie.push(pieTypeData[i].name);
    //     }
    //   }
    //   return pie;
    // }
  }
};
</script>

<style lang="scss">
.page {
  padding: 20px 0;
  p {
    color: #999;
    font-size: 16px;
    text-align: center;
  }
}
</style>
