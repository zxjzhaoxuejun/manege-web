<template>
  <el-submenu v-if="menu.children&&menu.children.length>0" :index="menuPath(menu.path)">
    <template #title>
      <i :class="menu.meta.icon" />
      <span>{{ generateTitle(menu.meta.title) }}</span>
    </template>
    <left-nav
      v-for="child in menu.children"
      :key="child.path"
      :menu="child"
      :is-nest="true"
      :base-path="menuPath(child.path)"
    />
  </el-submenu>
  <el-menu-item v-else :index="onlyMenuPath(menu.path)">
    <i :class="menu.meta.icon" />
    <span>{{ generateTitle(menu.meta.title) }}</span>
  </el-menu-item>
</template>

<script>
// "menuType":"1", //1菜单，2按钮
import { generateTitle } from '@/utils/routeI18n'
export default {
  name: 'TreeMenu',
  props: {
    menu: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  methods: {
    menuPath(routePath) {
      const basePaths = this.basePath === '/' ? '' : this.basePath
      const resPath = basePaths + '/' + routePath
      return resPath
    },
    generateTitle,
    onlyMenuPath(routePath) {
      return this.isNest ? this.basePath : routePath
    }
  }
}
</script>

<style scoped>

</style>
