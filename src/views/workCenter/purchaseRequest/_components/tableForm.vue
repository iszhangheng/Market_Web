<template>
  <div>
    <el-form ref="form"
      :model="productInfo"
      label-suffix="："
      label-width="100px">
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="12">
          <el-form-item label="商品编号">
            <el-input v-model="productInfo.productId"
              disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="12">
          <el-form-item label="商品名">
            <el-input v-model="productInfo.productName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="12">
          <el-form-item label="商品类别">
            <el-select v-model="productInfo.productType"
              placeholder="商品类别">
              <el-option label="食品"
                value="食品"></el-option>
              <el-option label="药品"
                value="药品"></el-option>
              <el-option label="服装"
                value="服装"></el-option>
              <el-option label="日用品"
                value="日用品"></el-option>
              <el-option label="其他"
                value="其他"></el-option>
              <el-option label="五金"
                value="五金"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item label="进价">
            <el-input v-model="productInfo.unitPrice"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="售价">
            <el-input v-model="productInfo.sellPrice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="12">
          <el-form-item label="单位">
            <el-select v-model="productInfo.unit"
              filterable>
              <el-option label="个"
                value="个"></el-option>
              <el-option label="瓶"
                value="瓶"></el-option>
              <el-option label="条"
                value="条"></el-option>
              <el-option label="斤"
                value="斤"></el-option>
              <el-option label="块"
                value="块"></el-option>
              <el-option label="箱"
                value="箱"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="7">
          <el-form-item label="进购数量">
            <el-input v-model="productInfo.num"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="12">
          <el-form-item label="生产日期">
            <el-date-picker v-model="productInfo.createDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="12">
          <el-form-item label="保质期">
            <el-date-picker v-model="productInfo.expirationDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">&nbsp;</el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary"
              @click="onSubmit">创建</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import workCenterApi from '@/api/workCenter';
export default {
  data() {
    return {
      // selectedOptions: [],
      // deptPost: deptPostList,
      productInfo: {
        productId: '',
        productName: '',
        productType: '',
        unitPrice: '',
        sellPrice: '',
        unit: '',
        num: '',
        createDate: '',
        expirationDate: '',
        discount: '1'
      },
      rules: {
        employeeName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入员工登录账号', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择员工性别', trigger: 'blur' }],
        idCard: [{ required: true, message: '请输入身份证', trigger: 'blur' }],
        deptPost: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入员工电话', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.productInfo.productId = new Date().getTime();
  },
  methods: {
    onSubmit() {
      this.addproductInfo();
    },
    addproductInfo() {
      const data = {
        productId: this.productInfo.productId,
        productName: this.productInfo.productName,
        productType: this.productInfo.productType,
        unitPrice: this.productInfo.unitPrice,
        sellPrice: this.productInfo.sellPrice,
        unit: this.productInfo.unit,
        num: this.productInfo.num,
        createDate: this.myFormatDate(this.productInfo.createDate),
        expirationDate: this.myFormatDate(this.productInfo.expirationDate),
        discount: this.productInfo.discount
      };
      workCenterApi
        .addProduct(data)
        .then(res => {
          if (res.robj.addStatus) {
            this.$message.success('添加成功');
          } else {
            this.$message.error('添加成功');
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
          this.listLoading = false;
        });
      this.initForm();
    },
    initForm() {
      this.productInfo.productId = new Date().getTime();
      this.productInfo.productName = '';
      this.productInfo.productType = '';
      this.productInfo.unitPrice = '';
      this.productInfo.sellPrice = '';
      this.productInfo.unit = '';
      this.productInfo.num = '';
      this.productInfo.createDate = '';
      this.productInfo.expirationDate = '';
      this.productInfo.discount = '1';
    },
    myFormatDate(date) {
      var strDate = date.getFullYear() + '-';
      const month = date.getMonth() + 1;
      strDate += (month < 10 ? '0' + month : month) + '-';
      const day = date.getDate();
      strDate += day < 10 ? '0' + day : day;
      return strDate;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
