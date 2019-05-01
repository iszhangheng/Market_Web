<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="this.$t('urlInformation.links')"
        name="first">
        <div v-if="G6ViewShow">暂无数据</div>
        <div v-else
          id="mountNode">
        </div>
      </el-tab-pane>
      <el-tab-pane :label="this.$t('urlInformation.child')"
        name="second">
        <egrid border
          fit
          highlight-current-row
          :column-key-map="{ label: 'name' }"
          :data="belowUrlList"
          :columns="columns">
        </egrid>
      </el-tab-pane>
      <el-tab-pane :label="this.$t('urlInformation.father')"
        name="third">
        <egrid border
          fit
          highlight-current-row
          :column-key-map="{ label: 'name' }"
          :data="upUrlList"
          :columns="columns1">
        </egrid>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import G6 from '@antv/g6';
import '@antv/g6/build/plugin.tool.tooltip';
import appApi from '@/api/app';
import dictionaryApi from '@/api/dictManage';
// import { yhtRouterFilter } from '@/filters';
export default {
  props: ['url', 'name'],
  data() {
    return {
      activeName: 'first',
      treeG6: null,
      G6ViewShow: false,
      belowUrlList: [],
      upUrlList: []
      // columnsSchema: {
      //   下一个页面: {
      //     width: 140,
      //     fixed: 'left',
      //     align: 'left',
      //     formater(row, col) {
      //       return this.yhtRouterFilter(row[col.prop]);
      //     }
      //   },
      //   'The Next Page': {
      //     width: 140,
      //     fixed: 'left',
      //     align: 'left',
      //     formater(row, col) {
      //       return this.yhtRouterFilter(row[col.prop]);
      //     }
      //   },
      //   上一个页面: {
      //     width: 140,
      //     fixed: 'left',
      //     align: 'left',
      //     formater(row, col) {
      //       return this.yhtRouterFilter(row[col.prop]);
      //     }
      //   },
      //   h5SourceUrl: {
      //     width: 140,
      //     fixed: 'left',
      //     align: 'left',
      //     formater(row, col) {
      //       return this.yhtRouterFilter(row[col.prop]);
      //     }
      //   }
      // }
    };
  },
  computed: {
    columns() {
      return [
        // 表头数据
        {
          name: this.$t('views.pageName'),
          prop: 'Url',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.entryTimesInfo'),
          prop: 'entryTimesInfo',
          align: 'center'
        },
        {
          name: this.$t('views.userNumInfo'),
          prop: 'userNumInfo',
          align: 'center'
        }
      ];
    },
    columns1() {
      return [
        // 表头数据
        {
          name: this.$t('views.pageName'),
          prop: 'Url',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.entryTimesInfo'),
          prop: 'entryTimesInfo',
          align: 'center'
        },
        {
          name: this.$t('views.userNumInfo'),
          prop: 'userNumInfo',
          align: 'center'
        }
      ];
    }
  },
  watch: {
    url() {
      this.initTableData();
    }
  },
  mounted() {
    this.getUrl();
  },
  destroyed() {
    this.treeG6 = null;
  },
  methods: {
    getUrl() {
      const data = {
        pageType: 'APP'
      };
      dictionaryApi
        .pageList(data)
        .then(res => {
          this.options = res.robj.items;
          this.initTableData();
        })
        .catch(res => {
          this.$message.error('数据请求失败');
        });
    },
    yhtRouterFilter(url) {
      let result = '';
      this.options.forEach(item => {
        url =
          url.lastIndexOf('/') === url.length - 1
            ? url.substr(0, url.length - 1)
            : url;
        if (item.pageUrl === url) {
          result = item.pageName;
        }
      });
      return result;
    },
    initTableData() {
      this.G6ViewShow = false;
      const data = {
        pageUrl: this.url
      };
      appApi
        .appTowards(data)
        .then(res => {
          this.belowUrlList = res.robj.items.belowUrlList.map(item => {
            return {
              // Url: this.yhtRouterFilter(item.Url) === '' ? item.Url : this.yhtRouterFilter(item.Url),
              Url: item.pageName,
              entryTimesInfo:
                item.entryTimes + ' | ' + item.entryTimesPercent,
              userNumInfo: item.userNum + ' | ' + item.userNumPercent
            };
          });
          this.upUrlList = res.robj.items.upUrlList.map(item => {
            return {
              // Url: this.yhtRouterFilter(item.Url) === '' ? item.Url : this.yhtRouterFilter(item.Url),
              Url: item.pageName,
              entryTimesInfo:
                item.entryTimes + ' | ' + item.entryTimesPercent,
              userNumInfo: item.userNum + ' | ' + item.userNumPercent
            };
          });
          if (this.belowUrlList.length > 0 && this.belowUrlList.length > 0) {
            this.G6ViewShow = false;
          } else {
            this.G6ViewShow = true;
          }
          this.initG6(this.belowUrlList, this.upUrlList, this.G6ViewShow);
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    initG6(belowUrlList, upUrlList, G6ViewShow) {
      if (G6ViewShow) return;
      const _that = this;
      const data = {
        name: this.yhtRouterFilter(_that.url) === '' ? _that.url : this.yhtRouterFilter(_that.url),
        // name: _that.url,
        children: [
          {
            name: '跳转到',
            children: []
          },
          {
            name: '跳转到',
            children: []
          }
        ]
      };
      belowUrlList.forEach(item => {
        const obj = {
          name:
            ((item.Url)) +
            ' (' +
            item.entryTimesInfo +
            ')',
          entryTimesInfo: item.entryTimesInfo,
          userNumInfo: item.userNumInfo
        };
        data.children[0].children.push(obj);
      });
      upUrlList.forEach(item => {
        const obj = {
          name:
            ((item.Url)) +
            ' (' +
            item.entryTimesInfo +
            ')',
          entryTimesInfo: item.entryTimesInfo,
          userNumInfo: item.userNumInfo
        };
        data.children[1].children.push(obj);
      });
      G6.registerNode('treeNode', {
        anchor: [[0, 0.5], [1, 0.5]]
      });
      G6.registerEdge('smooth', {
        getPath: function getPath(item) {
          var points = item.getPoints();
          var start = points[0];
          var end = points[points.length - 1];
          var hgap = Math.abs(end.x - start.x);
          if (end.x > start.x) {
            return [
              ['M', start.x, start.y],
              [
                'C',
                start.x + hgap / 4,
                start.y,
                end.x - hgap / 2,
                end.y,
                end.x,
                end.y
              ]
            ];
          }
          return [
            ['M', start.x, start.y],
            [
              'C',
              start.x - hgap / 4,
              start.y,
              end.x + hgap / 2,
              end.y,
              end.x,
              end.y
            ]
          ];
        }
      });
      var layoutG6 = new G6.Layouts.Mindmap({
        direction: 'H', // 方向（LR/RL/H/TB/BT/V）
        getHGap: function getHGap() /* d */ {
          // 横向间距
          return 40;
        },
        getVGap: function getVGap() /* d */ {
          // 竖向间距
          return 3;
        }
      });
      const tooltip = new G6.Plugins['tool.tooltip']({
        getTooltip({ item }) {
          const model = item.getModel();
          if (!model.entryTimesInfo || !model.userNumInfo) {
            return;
          }
          return `<div style="border-radius: 4px;
                              padding: 10px;
                              z-index: 2000;
                              font-size: 12px;
                              line-height: 1.4;
                              min-width: 10px;
                              word-wrap: break-word;
                              background: #303133;
                              color: #fff;">页面跳转(次数|比率)：${
            model.entryTimesInfo
            }<br/>页面访问(人数|比率)：${
            model.userNumInfo
            }</div>`;
        }
      });
      _that.treeG6 = new G6.Tree({
        id: 'mountNode', // 容器ID
        // width: 900,
        height: window.innerHeight - 300, // 画布高
        layout: layoutG6,
        plugins: [tooltip],
        fitView: 'cc' // 自动缩放
      });

      _that.treeG6.node({
        shape: 'treeNode',
        size: 10,
        label: function label(model) {
          return model.name;
        }
      });
      _that.treeG6.edge({
        shape: 'smooth'
      });

      _that.treeG6.on('afterchange', function () {
        _that.treeG6.getNodes().forEach(function (node) {
          var model = node.getModel();
          var label = node.getLabel();
          var keyShape = node.getKeyShape();
          var parent = node.getParent();
          var box = keyShape.getBBox();
          var labelBox = label.getBBox();
          var dx =
            (box.maxX - box.minX + labelBox.maxX - labelBox.minX) / 2 + 8;
          var dy = (box.maxY - box.minY) / 2 + 8;
          if (parent) {
            var parentModel = parent.getModel();
            if (parentModel.x > model.x) {
              dx = -dx;
            }
            dy = 0;
          } else {
            dx = 0;
          }
          label.attr({
            x: dx,
            y: dy
          });
        });
        _that.treeG6.draw();
      });
      _that.treeG6.read({
        roots: [data]
      });
      //  _that.treeG6.zoom(0.5);
      // _that.treeG6.translate(_that.treeG6.getWidth() / 2, _that.treeG6.getHeight() / 2);
    }
  }
};
</script>
<style lang="scss" scoped>
.tipNode {
  border-radius: 4px;
  padding: 10px;
  z-index: 2000;
  font-size: 12px;
  line-height: 1.2;
  min-width: 10px;
  word-wrap: break-word;
  background: #303133;
  color: #fff;
}
</style>
