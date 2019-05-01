<template>
  <div>
    <div class="elForm">
      <el-form class="search-form"
        :inline="true"
        size="mini">
        <!-- 时间选择 -->
        <el-form-item prop="name"
          :label="this.$t('views.dateType')">
          <el-date-picker v-model="date"
            type="daterange"
            align="center"
            unlink-panels
            :start-placeholder="this.$t('date.start')"
            :end-placeholder="this.$t('date.end')"
            :default-time="['00:00:00', '23:59:59']"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <!-- 地区选择 -->
        <!-- <el-form-item :label="this.$t('date.area')">
          <v-distpicker class="el-area"
            name="Area"
            @province="onChangeProvince"
            @city="onChangeCity"
            @area="onChangeArea">
          </v-distpicker>
        </el-form-item> -->
      </el-form>
    </div>
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
  mixins: [mixin],
  components: {
    mapMarker
  },
  data() {
    return {
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      dataShow: false,
      loading: true,
      // condition: {
      //   dataProvince: '',
      //   dataCity: '',
      //   dataArea: ''
      // },
      mapOption: {
        title: {
          text: '用户手机号归属地', // 待传值
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
        endDate: this.endDate,
        pageNo: 0,
        pageSize: 10,
        province: '',
        city: '',
        area: ''
      };
      userApi
        .userMobileAreaSum(data)
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
.elForm {
  text-align: right;
}
</style>
