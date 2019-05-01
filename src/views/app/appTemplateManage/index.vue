<template>
  <div>
    <div class="tiny-container">
      <h3 class="page-title">{{this.$t('route.templateManage')}}</h3>
      <!-- 功能模块 -->
      <el-form class="search-form"
        :inline="true"
        size="mini">
        <!-- 模板名称查询 -->
        <el-form-item :label="this.$t('views.templateName')"
          prop="name">
          <el-input v-model="templateName"
            @keyup.enter.native="query()"
            :placeholder="this.$t('please.templateName')"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="query()"
            type="primary"
            icon="el-icon-search">{{$t('table.query')}}</el-button>
        </el-form-item>
        <el-form-item label="">
          <!-- 新增按钮 -->
          <el-button-group style="margin-bottom:10px;">
            <el-button type="primary"
              icon="el-icon-plus"
              @click="addMsg()">{{this.$t('table.add')}}</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!-- 表格展示模块 -->
      <egrid v-loading.body="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :column-type="['index']"
        :column-type-props="columnTypeProps"
        :column-key-map="{ label: 'name' }"
        :data="list"
        :columns-handler="columnsHandler"
        :columns="columns">
      </egrid>
      <!-- 表格分页 -->
      <el-pagination v-if="total !== 0"
        class="tiny-pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 40]"
        :current-page="currentPage">
      </el-pagination>
      <!-- 功能内容调用 -->
      <el-dialog :title="dialogMesg.edit ? $t('table.edit') : $t('table.add')"
        top="5vh"
        width="80%"
        :append-to-body="true"
        :visible.sync="dialogMesg.visible">
        <table-form ref="formItem"
          :appUrl="appUrl"
          v-if="dialogMesg.visible"
          :mesgId="dialogMesg.id"
          :isEdit="dialogMesg.edit"></table-form>
        <div slot="footer"
          class="dialog-footer">
          <el-button size="small"
            @click="dialogMesg.visible = false">{{this.$t('table.cancel')}}</el-button>
          <el-button size="small"
            :disabled="dialogMesg.disabled"
            @click="submitForm('formItem')"
            type="primary">{{this.$t('table.confirm')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import tableForm from '@/views/app/appTemplateManage/_components/tableForm';
import columnTowards from '@/views/app/appTemplateManage/_components/columnTowards';
import appApi from '@/api/app';
import dictionaryApi from '@/api/dictManage';
export default {
  name: 'appTemplateManage',
  components: {
    tableForm
  },
  data() {
    return {
      appUrl: [],
      dialogMesg: {
        visible: false,
        disabled: false,
        edit: false,
        id: ''
      },
      templateObj: {
        list: []
      },
      templateName: '',
      listLoading: false,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    columnTypeProps() {
      return {
        index: {
          fixed: 'left',
          label: this.$t('views.index'),
          width: 50,
          align: 'center'
        }
      };
    },
    columns() {
      return [
        {
          name: this.$t('views.templateName'),
          prop: 'templateName',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.instructions'),
          prop: 'templateExplain',
          'show-overflow-tooltip': true
        }
      ];
    }
  },
  created() {
    const data = {
      startDate: '',
      endDate: ''
    };
    appApi.appTemplateInfo(data).then(res => {
      this.templateObj.list = res.robj.items;
    });
  },
  mounted() {
    this.getUrl();
  },
  methods: {
    getUrl() {
      const data = {
        pageType: 'APP'
      };
      dictionaryApi
        .pageList(data)
        .then(res => {
          this.appUrl = res.robj.items;
          this.init();
        })
        .catch(res => {
          this.$message.error('数据请求失败');
        });
    },
    columnsHandler(cols) {
      const that = this;
      return cols.concat({
        width: 200,
        fixed: 'right',
        label: this.$t('views.operation'),
        align: 'center',
        component: columnTowards,
        listeners: {
          'delect-msg'(row) {
            that.delectMsg(row.templateId);
          },
          'modify-msg'(row) {
            that.modifyMsg(row.templateId);
          }
        }
      });
    },
    modifyMsg(id) {
      this.dialogMesg.visible = true;
      this.dialogMesg.edit = true;
      this.dialogMesg.id = id;
    },
    delectMsg(id) {
      this.$confirm(this.$t('prompt.delete'), this.$t('prompt.prompt'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'error'
      }).then(() => {
        const data = {
          templateId: id
        };
        appApi
          .appTemplateInfoDelete(data)
          .then(res => {
            if (res.robj.msg === true) {
              this.$message.success('删除成功!');
              this.init();
            } else {
              this.$message.error('删除失败!');
            }
          })
          .catch(res => {
            this.$message.error('删除请求失败!');
          });
      });
    },
    addMsg() {
      this.dialogMesg.visible = true;
      this.dialogMesg.edit = false;
      this.dialogMesg.id = '';
    },
    query() {
      this.currentPage = 1;
      this.init();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    yhtRouterFilter(url) {
      let result = '';
      this.appUrl.forEach(item => {
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
      this.appUrl.forEach(item => {
        if (item.pageName === title) {
          result = item.pageUrl;
        }
      });
      return result;
    },
    // compare(formItem, name) {
    //   this.templateObj.list.forEach(item => {
    //     if (
    //       this.$refs[formItem].postForm.name === item.templateName &&
    //       this.$refs[formItem].postForm.name !== name
    //     ) {
    //       this.$message.warning('模板名称不能相同');
    //       this.dialogMesg.visible = false;
    //       this.dialogMesg.disabled = false;
    //       return;
    //     }
    //   });
    // },
    // 请求表格数据
    init() {
      this.listLoading = true;
      const data = {
        currentPage: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        templateName: this.templateName
      };
      appApi
        .appTemplateInfo(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
            this.list = res.robj.items;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.total = 0;
            this.list = [];
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败');
        });
    },
    submitForm(formItem) {
      this.$refs[formItem].$refs.postForm.validate(valid => {
        if (valid) {
          const links = [];
          this.$refs.formItem.postForm.graphOption.series[0].links.forEach(
            item => {
              links.push({
                source: this.yhtTitleFilter(item.source),
                target: this.yhtTitleFilter(item.target)
              });
              return item;
            }
          );
          this.$refs.formItem.postForm.graphOption.series[0].links = links;
          const dataList = [];
          this.$refs.formItem.postForm.graphOption.series[0].data.forEach(
            item => {
              dataList.push({
                name: this.yhtTitleFilter(item.name),
                x: item.x,
                y: item.y
              });
              return item;
            }
          );
          this.$refs.formItem.postForm.graphOption.series[0].data = dataList;
          // const data = this.$refs[formItem].postForm;
          this.dialogMesg.disabled = true;
          // const _that = this;
          if (
            JSON.stringify(this.$refs[formItem].postForm.graphOption).length >
            5000
          ) {
            this.$message.warning('节点长度超过5000,无法写入数据库');
            this.dialogMesg.visible = false;
            this.dialogMesg.disabled = false;
            return;
          }
          const data = {
            templateName: this.$refs[formItem].postForm.name,
            templateType: 'APP',
            templateExplain: this.$refs[formItem].postForm.explain,
            nodeDetail: JSON.stringify(
              this.$refs[formItem].postForm.graphOption
            )
          };
          if (this.dialogMesg.edit) {
            data.templateId = this.dialogMesg.id;
            appApi
              .appTemplateInfoUpdate(data)
              .then(res => {
                if (res.robj.msg === true) {
                  this.$message.success('修改成功');
                  this.init();
                  this.dialogMesg.disabled = false;
                  this.dialogMesg.visible = false;
                } else {
                  this.$message.error('修改失败');
                }
              })
              .catch(error => {
                console.log(error);
                this.dialogMesg.disabled = false;
              });
          } else {
            appApi
              .appTemplateInfoAdd(data)
              .then(res => {
                if (res.robj.msg === true) {
                  this.$message.success('新增成功');
                  this.init();
                  this.dialogMesg.id = 'newChange';
                  this.dialogMesg.disabled = false;
                  this.dialogMesg.visible = false;
                } else {
                  this.$message.error('新增失败');
                }
              })
              .catch(error => {
                console.log(error);
                this.dialogMesg.disabled = false;
              });
          }
        } else {
          return false;
        }
      });
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
