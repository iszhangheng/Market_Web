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
import productApi from '@/api/product';
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
          data: ['微信', 'QQ', 'APP', '小程序', '公众号']
        },
        xAxis: {
          name: '日期',
          data: []
        },
        yAxis: {
          name: '交易数量'
        },
        series: [
          {
            name: '微信',
            type: 'line',
            data: []
          },
          {
            name: 'QQ',
            type: 'line',
            data: []
          },
          {
            name: 'APP',
            type: 'line',
            data: []
          },
          {
            name: '小程序',
            type: 'line',
            data: []
          },
          {
            name: '公众号',
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
        date: ''
      };
      if (item.channel === '微信') {
        data.weChat = item.sucTotal + item.failTotal;
      }
      if (item.channel === 'APP') {
        data.app = item.sucTotal + item.failTotal;
      }
      if (item.channel === 'QQ') {
        data.qq = item.sucTotal + item.failTotal;
      }
      if (item.channel === '小程序') {
        data.applet = item.sucTotal + item.failTotal;
      }
      if (item.channel === '公众号') {
        data.public = item.sucTotal + item.failTotal;
      }
      data.date = item.date;
      return data;
    },
    getData(old, item) {
      const data = {
        weChat: old.weChat + item.weChat,
        qq: old.qq + item.qq,
        app: old.app + item.app,
        applet: old.applet + item.applet,
        public: old.public + item.public,
        date: old.date
      };
      return data;
    },
    init() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        groupStr: ['date', 'channel']
      };
      productApi
        .depositsBuy(data)
        .then(res => {
          const list = [];
          const temp = [];
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            res.robj.items.forEach(item => {
              if (temp.indexOf(item.date) === -1) {
                temp.push(item.date);
                list.push(this.createColumns(item));
              } else {
                list.forEach((ele, index) => {
                  if (item.date === ele.date) {
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
            this.loading = false;
            this.dataShow = true;
          }
          const listDate = this.list;
          if (listDate.length > 0) {
            for (let i = 0; i < listDate.length - 1; i++) {
              for (let j = i + 1; j < listDate.length; j++) {
                if (parseInt(listDate[i].date) > parseInt(listDate[j].date)) {
                  const temp = listDate[i];
                  listDate[i] = listDate[j];
                  listDate[j] = temp;
                }
              }
            }
            this.list = listDate;
          } else {
            this.list = [];
            this.dataShow = true;
            this.loading = false;
          }
          const publicData = []; // 公众号
          const appData = []; // APP
          const appletData = []; // 小程序
          const weChatData = []; // 微信
          const qqData = []; // QQ
          const chartData = [];
          if (this.list.length > 0) {
            this.list.forEach(element => {
              chartData.push(element.date);
              weChatData.push(element.weChat);
              qqData.push(element.qq);
              appData.push(element.app);
              appletData.push(element.applet);
              publicData.push(element.public);
            });
            // chartData = this.showDataSort(chartData);
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
    }
    // showDataSort(chartData) {
    //   for (let i = 0; i < chartData.length - 1; i++) {
    //     for (let j = i + 1; j < chartData.length; j++) {
    //       let temp = [];
    //       if (chartData[i] > chartData[j]) {
    //         temp = chartData[i];
    //         chartData[i] = chartData[j];
    //         chartData[j] = temp;
    //       }
    //     }
    //   }
    //   return chartData;
    // }
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
