<template>
  <div class="dashboard-content">
    <h2>商场综合管理系统</h2>
    <p>帮助商场管理者方便，快捷，有效的管理企业。<br />透析全面销售信息，掌握客户购买倾向，改善商场经营</p>
    <b><img src="./../../assets/images/pic-weApp.png" /></b>
    <ul>
      <li>员工管理</li>
      <li>商品管理</li>
      <li>销售分析</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'dashboard'
};
</script>
<style lang="scss" scoped>
.dashboard-content {
  padding: 80px 0 160px 50px;
  margin: 0px auto;
  position: relative;
  z-index: 3;
  h2 {
    font-size: 28px;
    padding-bottom: 50px;
    color: #323757;
  }
  p {
    font-size: 18px;
    color: #5d626f;
    line-height: 36px;
  }
  ul {
    padding: 0 20px;
    margin: 80px 0;
    li {
      color: #5d626f;
      float: left;
      margin-right: 60px;
      font-size: 18px;
    }
  }
  b {
    position: absolute;
    height: 450px;
    z-index: -1;
    top: 50px;
    right: 20px;
    img {
      height: 100%;
    }
  }
}
</style>
