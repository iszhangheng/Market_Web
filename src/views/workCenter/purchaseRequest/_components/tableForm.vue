<template>
  <div>
    <el-form ref="form"
      :model="productInfo"
      size="mini"
      label-suffix="："
      label-width="100px">
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="12">
          <el-form-item label="商品编号">
            <el-input v-model="productInfo.productId"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item label="商品名">
            <el-input v-model="productInfo.productName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品类别">
            <el-input v-model="productInfo.productType"></el-input>
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
            <el-input v-model="productInfo.unitPrice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item label="单位">
            <el-input v-model="productInfo.unit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="进购数量">
            <el-input v-model="productInfo.byNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item label="生产日期">
            <el-input v-model="productInfo.expirationDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="保质期">
            <el-input v-model="productInfo.expirationDate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="12">
          <el-form-item label="供货商">
            <el-input v-model="productInfo.company"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item label="联系人">
            <el-input v-model="productInfo.people"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电话">
            <el-input v-model="productInfo.phone"></el-input>
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
// import { deptPostList } from '@/utils/baseTools';
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
        unit: '',
        byNum: '',
        expirationDate: '',
        company: '',
        people: '',
        phone: ''
      }
    };
  },
  mounted() {
    // this.initForm();
  },
  methods: {
    onSubmit() {
      this.onSubmit();
    },
    addproductInfo() {
      const data = {
        employeeId: this.productInfo.employeeId,
        name: this.productInfo.name,
        sex: this.productInfo.sex,
        phone: this.productInfo.phone,
        idCard: this.productInfo.idCard,
        dept: this.selectedOptions[0],
        post: this.selectedOptions[1]
      };
      console.log(data);
      // dictionaryApi
      //   .pageList(data)
      //   .then(res => {
      //     this.options = res.robj.items;
      //     this.initTableData();
      //   })
      //   .catch(res => {
      //     this.$message.error('数据请求失败');
      //   });
    },
    initForm() {
      this.productInfo.employeeId = new Date().getTime();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
