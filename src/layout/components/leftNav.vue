<template>
  <el-submenu v-if="menu.children&&menu.children.length>0&&menu.children[0].menuType==1" :index="menuPath(menu._id)">
    <template #title>
      <i :class="menu.icon" />
      <span>{{ menu.menuName }}</span>
    </template>
    <left-nav
      v-for="child in menu.children"
      :key="child.path"
      :menu="child"
      :is-nest="true"
      :base-path="menuPath(child.path)"
    />
  </el-submenu>
  <el-menu-item v-else-if="menu.menuType==1" :index="onlyMenuPath(menu.path)">
    <i :class="menu.icon" />
    <el-badge :value="count" type="danger" class="item" :max="99" v-if="menu.path==='/approve'&&!!count">
      <span>{{ menu.menuName }}</span>
    </el-badge>
    <span v-else>{{ menu.menuName }}</span>
  </el-menu-item>
</template>

<script>
// "menuType":"1", //1菜单，2按钮
import { generateTitle } from '@/utils/routeI18n'
import {mapGetters} from 'vuex'
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
  computed:{
    ...mapGetters(['count']),
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    menuPath(routePath) {
      const basePaths = this.basePath === '/' ? '' : ""
      const resPath = basePaths + routePath
      return resPath
    },
    generateTitle,
    onlyMenuPath(routePath) {
      return this.isNest ? this.basePath : routePath
    },
  }
}
</script>

<style scoped lang="scss">
:deep(.el-badge__content){
  border: none;
  font-size: 12px;
}
:deep(.el-badge__content.is-fixed){
  top:10px
}
</style>
