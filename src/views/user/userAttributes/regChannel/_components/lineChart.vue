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
// import { yhtChannelFilter } from '@/filters';
import lineMarker from '@/components/Charts/lineMarker';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  props: ['date'],
  components: { lineMarker },
  data() {
    return {
      dataShow: true,
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
          data: [
            '微信注册数',
            'QQ注册数',
            'APP注册数',
            '小程序注册数',
            '公众号注册数'
          ]
        },
        xAxis: {
          name: '日期',
          data: []
        },
        yAxis: {
          name: '用户数量'
        },
        series: [
          {
            name: '微信注册数',
            type: 'line',
            data: []
          },
          {
            name: 'QQ注册数',
            type: 'line',
            data: []
          },
          {
            name: 'APP注册数',
            type: 'line',
            data: []
          },
          {
            name: '小程序注册数',
            type: 'line',
            data: []
          },
          {
            name: '公众号注册数',
            type: 'line',
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
    createColumns(item) {
      const data = {
        weChat: 0,
        qq: 0,
        app: 0,
        applet: 0,
        public: 0,
        dateType: ''
      };
      if (item.channel === '微信') {
        data.weChat = item.num;
      }
      if (item.channel === 'APP') {
        data.app = item.num;
      }
      if (item.channel === 'QQ') {
        data.qq = item.num;
      }
      if (item.channel === '小程序') {
        data.applet = item.num;
      }
      if (item.channel === '公众号') {
        data.public = item.num;
      }
      data.dateType = item.dateType;
      return data;
    },
    getData(old, item) {
      const data = {
        weChat: old.weChat + item.weChat,
        qq: old.qq + item.qq,
        app: old.app + item.app,
        applet: old.applet + item.applet,
        public: old.public + item.public,
        dateType: old.dateType
      };
      return data;
    },
    init() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      userApi
        .userChannel(data)
        .then(res => {
          const list = [];
          const temp = [];
          if (res.robj.items.length > 0) {
            res.robj.items.forEach(item => {
              if (temp.indexOf(item.dateType) === -1) {
                temp.push(item.dateType);
                list.push(this.createColumns(item));
              } else {
                list.forEach((ele, index) => {
                  if (item.dateType === ele.dateType) {
                    const data = this.getData(ele, this.createColumns(item));
                    list.splice(index, 1, data);
                  }
                });
              }
            });
            this.list = list;
            this.loading = false;
            this.dataShow = false;
          } else {
            this.list = [];
            this.loading = true;
            this.dataShow = true;
          }
          const publicData = []; // 公众号注册数
          const appData = []; // APP注册数
          const appletData = []; // 小程序注册数
          const weChatData = []; // 微信注册数
          const qqData = []; // QQ注册数
          let chartData = [];
          if (this.list.length > 0) {
            this.list.forEach(element => {
            chartData.push(element.dateType);
            weChatData.push(element.weChat);
            qqData.push(element.qq);
            appData.push(element.app);
            appletData.push(element.applet);
            publicData.push(element.public);
          });
          chartData = this.showDataSort(chartData);
          this.lineOption.xAxis.data = chartData;
          this.lineOption.series[0].data = weChatData;
          this.lineOption.series[1].data = qqData;
          this.lineOption.series[2].data = appData;
          this.lineOption.series[3].data = appletData;
          this.lineOption.series[4].data = publicData;
          this.loading = false;
          this.dataShow = false;
          } else {
            this.loading = true;
            this.dataShow = true;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    showDataSort(chartData) {
      for (let i = 0; i < chartData.length - 1; i++) {
        for (let j = i + 1; j < chartData.length; j++) {
          let temp = [];
          if (chartData[i] > chartData[j]) {
            temp = chartData[i];
            chartData[i] = chartData[j];
            chartData[j] = temp;
          }
        }
      }
      return chartData;
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
