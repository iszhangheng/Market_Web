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
  name: 'devVersionDistribution',
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
          text: '用户设备版本的分布情况', // 待传值
          subtext: '数量比例' // 待传值
          // x: 'right'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b} 人数: {c}人 占比({d}%)'
        },
        legend: {
          orient: 'horizontal',
          x: 'right',
          y: 'bottom',
          data: [] // 待传值
        },
        series: [
          {
            name: '用户设备版本(面积模式)', // 待传值
            type: 'pie',
            radius: [30, 110],
            // center: ['75%', '50%'],
            roseType: 'area',
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
        .deviceVersion(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            const pieVersionData = [];
            res.robj.items.map(item => {
              pieVersionData.push({
                value: item.deviceNum,
                name: item.mobileVersion
              });
            });
            this.pieOption.legend.data = this.pieOption_legend_data(pieVersionData);
            this.pieOption.series[0].data = pieVersionData;
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
    pieOption_legend_data(pieVersionData) {
      const pie = [];
      for (let i = 0; i < pieVersionData.length; i++) {
        let tager = true;
        for (let j = 0; j < pie.length; j++) {
          if (pie[j] === pieVersionData[i].name) {
            tager = false;
          }
        }
        if (tager) {
          pie.push(pieVersionData[i].name);
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
