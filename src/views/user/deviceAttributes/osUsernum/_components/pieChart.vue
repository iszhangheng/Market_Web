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
  name: 'osUserNum',
  mixins: [mixin],
  props: ['date'],
  components: {
    pieMarker
  },
  data() {
    return {
      pieData: [
        { value: 0, name: 'Android' },
        { value: 0, name: 'iOS' },
        { value: 0, name: '其他' }
      ],
      dataShow: false,
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
          data: ['Android', 'iOS', '其他'] // 待传值
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
        { value: 0, name: 'Android' },
        { value: 0, name: 'iOS' },
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
      userApi
        .osUserNumSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            res.robj.items.map(item => {
              this.pieData[0].value = item.android;
              this.pieData[1].value = item.ios;
              this.pieData[2].value = item.other;
            });
            this.pieOption.series[0].data = this.pieData;
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
    // pieOption_legend_data(pieData) {
    //   const pie = [];
    //   for (let i = 0; i < pieData.length; i++) {
    //     let tager = true;
    //     for (let j = 0; j < pie.length; j++) {
    //       if (pie[j] === pieData[i].name) {
    //         tager = false;
    //       }
    //     }
    //     if (tager) {
    //       pie.push(pieData[i].name);
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
.elForm {
  text-align: right;
}
</style>
