<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-if="breadcrumbList[0].name!='Home'">
      <router-link to="/">首页</router-link>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">{{ generateTitle(item.meta.title) }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/routeI18n'
export default {
  computed: {
    breadcrumbList() {
      return this.$route.matched
    }
  },
  mounted() {
    // console.log(this.$route)
  },
  methods: {
    generateTitle
  }
}
</script>

<style scoped>

</style>
