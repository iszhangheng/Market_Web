<template>
  <div>
    <div class="page"
      v-if="dataShow">
      <p>暂无数据</p>
    </div>
    <map-marker v-else
      v-loading="loading"
      element-loading-text="Loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 255)"
      :data='mapOption'></map-marker>
  </div>
</template>

<script>
import mapMarker from '@/components/Charts/mapMarker';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
import 'echarts/map/js/china.js';
export default {
  props: ['date'],
  mixins: [mixin],
  components: {
    mapMarker
  },
  data() {
    return {
      dataShow: false,
      loading: false,
      // condition: {
      //   dataProvince: '',
      //   dataCity: '',
      //   dataArea: ''
      // },
      mapOption: {
        title: {
          text: '用户注册地区分布', // 待传值
          subtext: '数量分布', // 待传值
          sublink: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['人数']
        },
        dataRange: {
          min: 0,
          max: 2500,
          x: 'left',
          y: 'bottom',
          text: ['高', '低'],
          calculable: true
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          x: 'right',
          y: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        roamController: {
          show: true,
          x: 'right',
          mapTypeControl: {
            china: true
          }
        },
        series: [
          {
            name: '人数',
            type: 'map',
            mapType: 'china',
            roam: false,
            itemStyle: {
              normal: {
                label: { show: true }
              },
              emphasis: {
                label: { show: true }
              }
            },
            data: []
          }
        ]
      }
    };
  },
  computed: {
    verify() {
      return JSON.stringify(this.condition);
    }
  },
  watch: {
    date() {
      this.init();
    },
    condition: {
      deep: true,
      handler() {
        this.condition = this.condition;
        this.init();
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      this.dataShow = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        province: '',
        city: '',
        area: ''
      };
      userApi
        .registAreaUserSum(data)
        .then(res => {
          const mapData = [];
          if (res.robj.items.length > 0) {
            res.robj.items.map(item => {
              mapData.push({
                name: item.province,
                value: item.num
              });
              this.mapOption.series[0].data = mapData;
            });
            // console.log(this.mapOption.series[0].data);
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
