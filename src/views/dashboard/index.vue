<template>
  <div class="dashboard-content">
    <h2>移动应用统计分析</h2>
    <p>帮助移动开发者收集、处理、分析第一方数据。<br />透析全面运营指标，掌握用户行为，改善产品设计</p>
    <b><img src="./../../assets/images/pic-weApp.png" /></b>
    <ul>
      <li>服务监控</li>
      <li>用户行为分析</li>
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
