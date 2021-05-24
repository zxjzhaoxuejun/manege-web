<template>
  <template v-for="menu in leftMenuList" :key="menu.path">
    <el-submenu v-if="menu.children&&menu.children.length>0&&menu.children[0].menuType==1" :index="menu.path">
      <template #title>
        <i :class="menu.icon" />
        <span>{{ menu.menuName }}</span>
      </template>
      <left-nav :left-menu-list="menu.children" />
    </el-submenu>
    <el-menu-item v-else-if="menu.menuType==1" :index="menu.path">
      <i :class="menu.icon" />
      <span>{{ menu.menuName }}</span>
    </el-menu-item>
  </template>
</template>

<script>
// "menuType":"1", //1菜单，2按钮

export default {
  name: 'TreeMenu',
  props: {
    leftMenuList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
