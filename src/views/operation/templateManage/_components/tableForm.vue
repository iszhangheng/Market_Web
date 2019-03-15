<template>
  <el-form class="form-container"
    size="mini"
    ref="postForm"
    :model="postForm"
    :rules="rules"
    label-width="100px">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item :label="this.$t('views.templateName')"
          prop="name">
          <el-input :placeholder="this.$t('please.name')"
            v-model="postForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="this.$t('views.templateInstructions')"
          prop="explain">
          <el-input :rows="2"
            type="textarea"
            :placeholder="this.$t('please.instructions')"
            v-model="postForm.explain">
          </el-input>
        </el-form-item>
        <el-form-item :label="this.$t('views.pageSelection')">
          <el-select style="width:100%;"
            v-model="postForm.pages"
            @change="changePages"
            filterable
            multiple
            :placeholder="this.$t('please.selection')">
            <el-option v-for="item in options"
              :key="item.pageUrl"
              :label="item.pageName"
              :value="item.pageUrl">
            </el-option>
          </el-select>
        </el-form-item>
        <h4 v-if="selectData.length > 0">{{this.$t('views.linkRelation')}}</h4>
        <el-form-item class="link-relation"
          v-show="selectData.length > 0"
          v-for="(item,i) in selectData"
          :key="i"
          :label="item.title">
          <el-select style="width:100%"
            @change="urlChange"
            v-model="item.result"
            multiple
            placeholder="请选择">
            <el-option v-for="arr in item.list"
              :key="arr.url"
              :label="arr.title"
              :value="arr.url">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <graph-chart :height="graphHeight + 'px'"
          v-if="isLoading && selectData.length > 0"
          :data="postForm.graphOption"></graph-chart>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import operationApi from '@/api/operation';
import graphChart from '@/components/Charts/graphMarker';
const defaultForm = {
  name: '',
  explain: '',
  pages: [],
  graphHeight: '',
  graphOption: {
    title: {
      text: ''
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 50,
        roam: true, // 是否开启鼠标缩放
        label: {
          normal: {
            show: true
          }
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          normal: {
            textStyle: {
              fontSize: 20
            }
          }
        },
        lineStyle: {
          normal: {
            opacity: 0.9,
            width: 2,
            curveness: 0.2
          }
        },
        data: [],
        links: []
      }
    ]
  }
};
export default {
  name: 'tableForm',
  components: { graphChart },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    mesgId: {
      default: false
    },
    options: {
      type: Array,
      default: []
    }
  },
  watch: {
    mesgId: 'init'
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      isLoading: false,
      selectData: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        explain: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 3,
            max: 300,
            message: '长度在 3 到 300 个字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.isEdit) {
        operationApi
          .templateManage({ templateId: this.mesgId })
          .then(res => {
            // 传值
            if (res.robj.items.length > 0) {
              this.postForm.name = res.robj.items[0].templateName;
              this.postForm.explain = res.robj.items[0].templateExplain;
              this.graphOption = JSON.parse(res.robj.items[0].nodeDetail);
              this.postForm.pages = [];
              this.graphOption.series[0].data.map(item => {
                this.postForm.pages.push(item.name);
              });
              // 获取selectData
              this.selectData = [];
              this.postForm.pages.map(item => {
                const result = [];
                this.graphOption.series[0].links.map(element => {
                  if (item === element.source) {
                    result.push(element.target);
                  }
                });
                const obj = {
                  list: this.pageListFilter(item),
                  result: result,
                  title: this.yhtRouterFilter(item),
                  url: item
                };
                this.selectData.push(obj);
              });
              this.fetchData();
            } else {
              this.postForm.name = [];
              this.postForm.explain = [];
              this.graphOption = [];
              this.postForm.pages = [];
              this.$message.warning('请求异常,数据为空!');
            }
          })
          .catch(err => {
            console.log(err);
            // this.$message.error('查询失败!');
          });
      } else {
        this.postForm = Object.assign({}, defaultForm);
        this.selectData = [];
        this.postForm.graphOption.series[0].data = [];
        this.postForm.graphOption.series[0].links = [];
      }
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate();
      });
    },
    changePages() {
      this.isLoading = false;
      const selectArr = this.selectData.map(item => {
        return item.url;
      });
      if (this.postForm.pages.length > this.selectData.length) {
        // 新增
        this.postForm.pages.forEach(item => {
          if (!selectArr.includes(item)) {
            const obj = {
              url: item,
              title: this.yhtRouterFilter(item),
              result: [],
              list: this.pageListFilter(item)
            };
            this.selectData.push(obj);
          }
        });
      } else {
        // 删除
        selectArr.forEach(removeItem => {
          if (!this.postForm.pages.includes(removeItem)) {
            this.selectData = this.selectData.filter(item => {
              item.result.forEach((page, index) => {
                if (page === removeItem) {
                  item.result.splice(index, 1);
                }
              });
              return removeItem !== item.url;
            });
          }
        });
      }
      this.selectData.forEach(item => {
        item.list = this.pageListFilter(item.url);
      });
      this.fetchData();
    },
    pageListFilter(url) {
      const list = [];
      this.options.forEach(item => {
        this.postForm.pages.forEach(page => {
          if (page === item.pageUrl && page !== url) {
            list.push({ url: item.pageUrl, title: item.pageName });
          }
        });
      });
      return list;
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
    yhtTitleFilter(title) {
      let result = '';
      this.options.forEach(item => {
        if (item.pageName === title) {
          result = item.pageUrl;
        }
      });
      return result;
    },
    urlChange() {
      this.fetchData();
    },
    fetchData() {
      this.postForm.graphOption.series[0].data = [];
      this.postForm.graphOption.series[0].links = [];
      this.postForm.graphOption.series[0].data = this.selectData.map(
        (item, index) => {
          let x = 200 + (index + 1) * 100;
          let y = 200 + (index + 1) * 100;
          if (index % 2 === 0) {
            x = x + 100;
            y = y - 100;
          }
          const obj = {
            name: item.title,
            x: x,
            y: y
          };
          return obj;
        }
      );
      const linkArr = [];
      this.selectData.forEach(item => {
        item.result.forEach(page => {
          const obj = {
            source: item.title,
            target: this.yhtRouterFilter(page)
          };
          linkArr.push(obj);
        });
      });
      this.postForm.graphOption.series[0].links = linkArr;
      this.graphHeight = window.innerHeight - 180;
      this.isLoading = true;
    }
  }
};
</script>
<style lang="scss">
.form-container {
  .el-form-item__label {
    padding: 0 12px 0 0 !important;
    line-height: 28px !important;
  }
  .link-relation {
    display: flex;
    align-items: center;
    .el-form-item__label {
      flex: 0 1 140px;
      line-height: 14px !important;
    }
    .el-form-item__content {
      flex: 1 0 auto;
      margin-left: 0px !important;
    }
  }
}
</style>
