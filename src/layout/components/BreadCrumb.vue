<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-if="breadcrumbList[0].name!='Home'">
      <router-link to="/">首页</router-link>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  computed: {
    breadcrumbList() {
      return this.$route.matched
    }
  },
  mounted() {
    console.log(this.$route)
  }
}
</script>

<style scoped>

</style>
