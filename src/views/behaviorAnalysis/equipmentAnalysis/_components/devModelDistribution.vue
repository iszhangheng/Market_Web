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
import behaviorApi from '@/api/behavior';
import mixin from '@/utils/mixin';
import pieMarker from '@/components/Charts/pieMarker';
export default {
  name: 'devModelDistribution',
  mixins: [mixin],
  props: ['date'],
  components: {
    pieMarker
  },
  data() {
    return {
      dataShow: true,
      loading: true,
      pieOption: {
        title: {
          text: '用户设备型号的分布情况', // 待传值
          subtext: '数量比例' // 待传值
          // x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b} 人数: {c}人 占比({d}%)'
        },
        legend: {
          orient: 'horizontal',
          x: 'left',
          y: 'bottom',
          data: [] // 待传值
        },
        series: [
          {
            name: '用户设备型号(半径模式)', // 待传值
            type: 'pie',
            radius: [20, 110],
            // center: ['25%', '50%'],
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
      behaviorApi
        .deviceModel(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            const pieTypeData = [];
            res.robj.items.map(item => {
              if (item.mobile === null || item.mobile === undefined) {
                item.mobile = '未知';
              }
              pieTypeData.push({ value: item.deviceNum, name: item.mobile });
            });
            this.pieOption.legend.data = this.pieOption_legend_data(pieTypeData);
            this.pieOption.series[0].data = pieTypeData;
            this.dataShow = false;
            this.loading = false;
          } else {
            this.dataShow = true;
            this.loading = false;
          }
        })
        .catch(error => {
           console.log(error);
        });
    },
    pieOption_legend_data(pieTypeData) {
      const pie = [];
      for (let i = 0; i < pieTypeData.length; i++) {
        let tager = true;
        for (let j = 0; j < pie.length; j++) {
          if (pie[j] === pieTypeData[i].name) {
            tager = false;
          }
        }
        if (tager) {
          pie.push(pieTypeData[i].name);
        }
      }
      return pie;
    }
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
