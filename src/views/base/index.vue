<template>
  <div class="base-mode">
    <div class="l-text">
      <h3 class="title-3">欢迎体验</h3>
      <h2 class="title-2">SIEIA通用后台管理系统</h2>
    </div>
    <img src="../../assets/welcome/welcome.png">
  </div>
</template>

<script>

export default {
  name: 'Welcome',
  created() {
    console.log(this.$store.state.user.userInfo)
  },
  mounted() {
    // this.$stroage.setItem('list', "{age:'32',name:'top'}")

  },
  methods: {
    goLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="scss">
.base-mode{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content:space-around;

    .title-3{
        color: $baseFont;
        padding: 15px 0;
    }

    .title-2{
        color: $blueText;
    }
}
</style>
