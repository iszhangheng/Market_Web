<template>
  <div>
    <el-tabs v-model="activeName">
      <!-- 链路图 -->
      <el-tab-pane :label="this.$t('urlInformation.links')"
        name="first">
        <div v-if="G6ViewShow">暂无数据</div>
        <div v-else
          id="mountNode">
        </div>
      </el-tab-pane>
      <!-- 子页面 -->
      <el-tab-pane :label="this.$t('urlInformation.child')"
        name="second">
        <egrid border
          fit
          highlight-current-row
          :column-key-map="{ label: 'name' }"
          :data="nextPageList"
          :columns="columnsChild">
        </egrid>
      </el-tab-pane>
      <!-- 父页面 -->
      <el-tab-pane :label="this.$t('urlInformation.father')"
        name="third">
        <egrid border
          fit
          highlight-current-row
          :column-key-map="{ label: 'name' }"
          :data="lastPageList"
          :columns="columnsFather">
        </egrid>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import G6 from '@antv/g6';
import '@antv/g6/build/plugin.tool.tooltip';
import behaviorApi from '@/api/behavior';
export default {
  props: ['url', 'name'],
  data() {
    return {
      activeName: 'first',
      treeG6: null,
      G6ViewShow: false,
      nextPageList: [],
      lastPageList: []
    };
  },
  computed: {
    columnsChild() {
      return [
        // 表头数据
        {
          name: this.$t('views.pageName'),
          prop: 'pageName',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.pageJump'),
          prop: 'pageJump',
          align: 'center'
        },
        {
          name: this.$t('views.deviceJump'),
          prop: 'deviceJump',
          align: 'center'
        }
      ];
    },
    columnsFather() {
      return [
        // 表头数据
        {
          name: this.$t('views.pageName'),
          prop: 'pageName',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.pageJump'),
          prop: 'pageJump',
          align: 'center'
        },
        {
          name: this.$t('views.deviceJump'),
          prop: 'deviceJump',
          align: 'center'
        }
      ];
    }
  },
  watch: {
    url() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.treeG6 = null;
  },
  methods: {
    init() {
      this.G6ViewShow = false;
      const data = {
        pageUrl: this.url
      };
      behaviorApi
        .pageTowards(data)
        .then(res => {
          this.nextPageList = res.robj.nextPageList.map(item => {
            return {
              pageName: item.pageName === '' ? item.pageUrl : item.pageName,
              pageJump: item.pageJumpTimes + ' | ' + item.pageJumpPercent,
              deviceJump: item.deviceJumpTimes + ' | ' + item.deviceJumpPercent
            };
          });
          this.lastPageList = res.robj.lastPageList.map(item => {
            return {
              pageName: item.pageName === '' ? item.pageUrl : item.pageName,
              pageJump: item.pageJumpTimes + ' | ' + item.pageJumpPercent,
              deviceJump: item.deviceJumpTimes + ' | ' + item.deviceJumpPercent
            };
          });
          if (this.nextPageList.length > 0 && this.lastPageList.length > 0) {
            this.G6ViewShow = false;
          } else {
            this.G6ViewShow = true;
          }
          this.initG6(this.nextPageList, this.lastPageList, this.G6ViewShow);
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    initG6(nextPageList, lastPageList, G6ViewShow) {
      if (G6ViewShow) return;
      const _that = this;
      const data = {
        name: _that.name === '' ? _that.url : _that.name,
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
      nextPageList.forEach(item => {
        const obj = {
          name: item.pageName + ' (' + item.pageJump + ')',
          pageJump: item.pageJump,
          deviceJump: item.deviceJump
        };
        data.children[0].children.push(obj);
      });
      lastPageList.forEach(item => {
        const obj = {
          name: item.pageName + ' (' + item.pageJump + ')',
          pageJump: item.pageJump,
          deviceJump: item.deviceJump
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
          if (!model.pageJump || !model.deviceJump) {
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
                              color: #fff;">页面跳转(次数|占比)：${
                                model.pageJump
                              }<br/>设备跳转(次数|占比)：${
            model.deviceJump
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

      _that.treeG6.on('afterchange', function() {
        _that.treeG6.getNodes().forEach(function(node) {
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
