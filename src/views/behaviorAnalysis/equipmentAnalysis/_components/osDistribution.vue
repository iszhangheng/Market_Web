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
  name: 'osDistribution',
  mixins: [mixin],
  props: ['date'],
  components: {
    pieMarker
  },
  data() {
    return {
      pieData: [
        { value: 0, name: 'android' },
        { value: 0, name: 'ios' },
        { value: 0, name: '其他' }
      ],
      dataShow: true,
      loading: true,
      // 绘制饼图数据
      pieOption: {
        title: {
          text: '操作系统分布', // 待传值
          subtext: '数量比例' // 待传值
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b} 人数: {c}人 占比({d}%)'
        },
        legend: {
          data: ['android', 'ios', '其他'] // 待传值
        },
        series: [
          {
            name: '操作系统',
            data: [
              // { value: 0, name: 'Android总数' },
              // { value: 0, name: 'iOS总数' },
              // { value: 0, name: '其他' }
            ]
          }
        ]
      }
    };
  },
  watch: {
    date() {
      this.pieData = [
        { value: 0, name: 'android' },
        { value: 0, name: 'ios' },
        { value: 0, name: '其他' }
      ];
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
        .operatingSystem(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            res.robj.items.map(item => {
              if (item.system === 'android') {
                this.pieData[0].value += item.deviceNum;
              }
              if (item.system === 'ios') {
                this.pieData[1].value += item.deviceNum;
              }
              if (item.system === '其他') {
                this.pieData[2].value += item.deviceNum;
              }
            });
            this.pieOption.series[0].data = this.pieData;
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
