<template>
  <div>
    <h1>欢迎来到欢迎页</h1>
    <el-button type="primary" @click="goLogin">去登陆</el-button>
  </div>
</template>

<script>

export default {
  name: 'Welcome',
  created() {

  },
  mounted() {
    this.$stroage.setItem('list', "{age:'32',name:'top'}")
    console.log(this.$stroage.getItem('list'))
    this.$stroage.clearItem('name')
    this.$stroage.clearAll()
  },
  methods: {
    goLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
