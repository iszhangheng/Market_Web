<template>
  <div>
    <div class="page"
      v-if="dataShow">
      <p>暂无数据</p>
    </div>
    <!-- 折线图 -->
    <line-marker v-else
      v-loading="loading"
      element-loading-text="Loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 255)"
      :data='lineOption'></line-marker>
  </div>
</template>

<script>
import lineMarker from '@/components/Charts/lineMarker';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  props: ['date'],
  components: { lineMarker },
  data() {
    return {
      timeData: [
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 }
      ],
      dataShow: false,
      loading: true,
      lineOption: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        legend: {
          data: ['用户数量']
        },
        xAxis: {
          name: '时间',
          boundaryGap: false,
          data: [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00'
          ]
        },
        yAxis: {
          name: '用户数量'
        },
        series: [
          {
            name: '用户数量',
            type: 'line',
            data: []
          }
        ]
      }
    };
  },
  watch: {
    date() {
      this.timeData = [
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 }
      ];
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
        .userLoginSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            res.robj.items.map(item => {
              if (item.time === '00') {
                this.timeData[0].num = item.num;
              }
              if (item.time === '01') {
                this.timeData[1].num = item.num;
              }
              if (item.time === '02') {
                this.timeData[2].num = item.num;
              }
              if (item.time === '03') {
                this.timeData[3].num = item.num;
              }
              if (item.time === '04') {
                this.timeData[4].num = item.num;
              }
              if (item.time === '05') {
                this.timeData[5].num = item.num;
              }
              if (item.time === '06') {
                this.timeData[6].num = item.num;
              }
              if (item.time === '07') {
                this.timeData[7].num = item.num;
              }
              if (item.time === '08') {
                this.timeData[8].num = item.num;
              }
              if (item.time === '09') {
                this.timeData[8].num = item.num;
              }
              if (item.time === '10') {
                this.timeData[10].num = item.num;
              }
              if (item.time === '11') {
                this.timeData[11].num = item.num;
              }
              if (item.time === '12') {
                this.timeData[12].num = item.num;
              }
              if (item.time === '13') {
                this.timeData[13].num = item.num;
              }
              if (item.time === '14') {
                this.timeData[14].num = item.num;
              }
              if (item.time === '15') {
                this.timeData[15].num = item.num;
              }
              if (item.time === '16') {
                this.timeData[16].num = item.num;
              }
              if (item.time === '17') {
                this.timeData[17].num = item.num;
              }
              if (item.time === '18') {
                this.timeData[18].num = item.num;
              }
              if (item.time === '19') {
                this.timeData[19].num = item.num;
              }
              if (item.time === '20') {
                this.timeData[20].num = item.num;
              }
              if (item.time === '21') {
                this.timeData[21].num = item.num;
              }
              if (item.time === '22') {
                this.timeData[22].num = item.num;
              }
              if (item.time === '23') {
                this.timeData[23].num = item.num;
              }
            });
            this.lineOption.series[0].data = [
              this.timeData[0].num,
              this.timeData[1].num,
              this.timeData[2].num,
              this.timeData[3].num,
              this.timeData[4].num,
              this.timeData[5].num,
              this.timeData[6].num,
              this.timeData[7].num,
              this.timeData[8].num,
              this.timeData[9].num,
              this.timeData[10].num,
              this.timeData[11].num,
              this.timeData[12].num,
              this.timeData[13].num,
              this.timeData[14].num,
              this.timeData[15].num,
              this.timeData[16].num,
              this.timeData[17].num,
              this.timeData[18].num,
              this.timeData[19].num,
              this.timeData[20].num,
              this.timeData[21].num,
              this.timeData[22].num,
              this.timeData[23].num
            ];
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
