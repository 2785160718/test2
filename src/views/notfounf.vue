<template>
  <div>
    <div class="center">
      <img src="../assets/images/404.png" alt srcset />
      <div class="content">
        <h1>Page Not Find</h1>
        <h2>Error</h2>
      </div>
    </div>
    <div class="brn">
      <Button type="primary" @click="back()" shape="circle">返回首页</Button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.push("/home");
    },
  },
};
</script>

<style lang="css" scoped>
img {
  width: 200px;
  height: 200px;
}
.center {
  text-align: center;
  display: flex;
  width: 40%;
  height: 300px;
  justify-content: space-around;
  align-items: center;
  margin: 0 auto;
}
.brn {
  width: 40%;
  text-align: center;
  margin: 0 auto;
}
@media screen and (max-width: 568px) {
  .center {
    flex-direction: column;
    width: 90%;
  }
}
</style>