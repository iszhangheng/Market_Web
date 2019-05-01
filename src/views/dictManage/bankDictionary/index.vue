<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.bankDictionary')}}</h3>
    <!-- <el-button-group style="margin-bottom:10px;">
      <el-button type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addMesg()">{{this.$t('table.add')}}</el-button>
    </el-button-group> -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <el-form-item :label="this.$t('views.bankName')"
        prop="name">
        <el-input v-model="searchName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('dictionary.bankName')"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{$t('table.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格展示模块 -->
    <!-- :columns-handler="columnsHandler" -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :column-type="['index']"
      :column-type-props="columnTypeProps"
      :column-key-map="{ label: 'name' }"
      :data="list"
      :columns="columns">
    </egrid>
    <!-- 表格分页 -->
    <el-pagination v-if="total !== 0"
      class="tiny-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 40]"
      :current-page="currentPage">
    </el-pagination>

    <!-- 弹窗 -->
    <el-dialog :title="dialogMesg.edit ? $t('table.edit') : $t('table.add')"
      top="5vh"
      width="50%"
      :append-to-body="true"
      :visible.sync="dialogMesg.visible">
      <table-form ref="formItem"
        :mesg="dialogMesg.mesg"
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
</template>
  
<script>
// import columnStyle from './_components/operate';
import tableForm from './_components/tableForm';
import dictionaryApi from '@/api/dictManage';

export default {
  name: 'dictManage',
  components: {
    tableForm
  },
  data() {
    return {
      dialogMesg: {
        visible: false,
        disabled: false,
        edit: false,
        mesg: '',
        id: ''
      },
      searchName: '',
      list: [],
      total: 0,
      listLoading: false,
      currentPage: 1, // 当前页码
      pageSize: 10 // 页面大小
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
        // 表头数据
        {
          name: this.$t('views.LegalPersonCode'),
          prop: 'trcorp',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.bankCode'),
          prop: 'bkcode'
        },
        {
          name: this.$t('views.bankName'),
          prop: 'bkname'
        }
      ];
    }
  },

  created() {
    // this.init();
  },
  methods: {
    query() {
      this.currentPage = 1;
      // this.init();
    },
    init() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        bkName: this.searchName
      };
      dictionaryApi
        .bankList(data)
        .then(res => {
          this.list = res.robj.items;
          this.total = res.robj.total;
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    columnsHandler(cols) {
      const that = this;
      return cols.concat({
        width: 200,
        fixed: 'right',
        label: this.$t('views.operation'),
        align: 'center',
        component: columnStyle,
        listeners: {
          'delect-msg'(row) {
            that.delectMsg(row.trcorp);
          },
          'change-msg'(row) {
            that.changeMsg(row);
          }
        }
      });
    },
    changeMsg(row) {
      this.dialogMesg.visible = true;
      this.dialogMesg.edit = true;
      this.dialogMesg.mesg = row;
    },
    delectMsg(id) {
      this.$confirm(this.$t('prompt.delete'), this.$t('prompt.prompt'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'error'
      }).then(() => {
        const data = {
          trCorp: id
        };
        dictionaryApi
          .bankRemove(data)
          .then(res => {
            if (res.robj.msg === true) {
              this.$message.success('删除成功!');
              this.init();
            } else {
              this.$message.error('删除失败!');
            }
          })
          .catch(res => {
            this.$message.error('请求失败!');
          });
      });
    },
    addMesg() {
      this.dialogMesg.visible = true;
      this.dialogMesg.edit = false;
      this.dialogMesg.mesg = '';
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    submitForm(formItem) {
      this.$refs[formItem].$refs.postForm.validate(valid => {
        if (valid) {
          this.dialogMesg.disabled = true;
          // const data = this.$refs[formItem].postForm;
          const data = {
            jsonArray: [
              {
                trCorp: this.$refs[formItem].postForm.LegaPpersonCode,
                bkCode: this.$refs[formItem].postForm.bankCode,
                bkName: this.$refs[formItem].postForm.bankName
              }
            ]
          };
          const update = {
            trCorp: this.$refs[formItem].postForm.LegaPpersonCode,
            bkCode: this.$refs[formItem].postForm.bankCode,
            bkName: this.$refs[formItem].postForm.bankName
          };
          if (this.dialogMesg.edit) {
            dictionaryApi
              .bankUpdate(update)
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
            dictionaryApi
              .bankAdd(data)
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
  } // methods
};
</script>