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
      ageData: [
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 },
        { num: 0 }
      ],
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
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          // data: ['<19', '19-25', '26-35', '36-45', '46-55', '>55', '未知']
          // normal: {
          //   show: true,
          //   // formatter: '{c} {name|{a}}',
          //   rich: {
          //     name: {
          //       textBorderColor: '#fff'
          //     }
          //   }
          // }
        },
        xAxis: [
          {
            name: '年龄段',
            type: 'category',
            data: ['<19', '19-25', '26-35', '36-45', '46-55', '>55', '未知']
          }
        ],
        yAxis: [
          {
            name: '人数',
            type: 'value'
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            data: []
          }
        ]
      }
    };
  },
  watch: {
    date() {
      this.ageData = [
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
        .registerAgeSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            res.robj.items.map(item => {
              if (item.age < 19) {
                this.ageData[0].num = item.num;
              }
              if (item.age >= 19 && item.age <= 25) {
                this.ageData[1].num = item.num;
              }
              if (item.age >= 26 && item.age <= 35) {
                this.ageData[2].num = item.num;
              }
              if (item.age >= 36 && item.age <= 45) {
                this.ageData[3].num = item.num;
              }
              if (item.age >= 46 && item.age <= 55) {
                this.ageData[4].num = item.num;
              }
              if (item.age > 55) {
                this.ageData[5].num = item.num;
              }
              if (
                item.age === null ||
                item.age === undefined ||
                item.age === '未知'
              ) {
                this.ageData[6].num = item.num;
              }
            });
            this.barOption.series[0].data = [
              this.ageData[0].num,
              this.ageData[1].num,
              this.ageData[2].num,
              this.ageData[3].num,
              this.ageData[4].num,
              this.ageData[5].num,
              this.ageData[6].num
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
