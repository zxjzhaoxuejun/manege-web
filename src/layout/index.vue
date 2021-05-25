<template>
  <div class="layout-base">
    <div class="nav-side">
      <el-menu
        :unique-opened="true"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        :collapse="isCollapse"
        :router="true"
        @open="handleOpen"
        @close="handleClose"
      >
        <LeftNav :left-menu-list="leftMenuList" />
      </el-menu>
    </div>
    <div class="layout-content">
      <div class="nav-top">
        <div class="nav-item">
          <i class="el-icon-s-fold isCollapse" @click="openLeftCollapse" />
          <BreadCrumb />
        </div>
        <div class="suer-info">{{ userInfo.userName }}</div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeftNav from './components/LeftNav.vue'
import BreadCrumb from './components/BreadCrumb.vue'
import { mapGetters } from 'vuex'
const menuJson = {
  'code': 200,
  'data': [
    {
      'parentId': [],
      'updateTime': '',
      'createTime': '',
      'id': '1',
      'menuType': '1',
      'menuName': '首页',
      'menuCode': '',
      'path': '/welcome',
      'icon': 'el-icon-s-home',
      'children': []
    },
    {
      'parentId': [],
      'updateTime': '',
      'createTime': '',
      'id': '2',
      'menuType': '1',
      'menuName': '系统管理',
      'menuCode': '',
      'path': '/settings',
      'icon': 'el-icon-setting',
      'children': [
        {
          'parentId': ['1'],
          'updateTime': '',
          'createTime': '',
          'id': '2_1',
          'menuType': '1',
          'menuName': '用户管理',
          'menuCode': '',
          'path': '/user-control',
          'icon': 'el-icon-user'
        },
        {
          'parentId': ['1'],
          'updateTime': '',
          'createTime': '',
          'id': '2_2',
          'menuType': '1',
          'menuName': '菜单管理',
          'menuCode': '',
          'path': '/menu-control',
          'icon': 'el-icon-s-order'
        }
      ]
    }
  ]
}

export default {
  components: { LeftNav, BreadCrumb },
  data() {
    return {
      leftMenuList: [],
      isCollapse: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    console.log(menuJson.data)
    this.leftMenuList = menuJson.data
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    openLeftCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style scoped lang="scss">
.layout-base{
    position: relative;

    .nav-side{
        position: fixed;
        width: 260px;
        height: 100vh;
        overflow-y: auto;
        color: #fff;
    }

    .layout-content{
        margin-left: 260px;

        .nav-top{
            display: flex;
            justify-content: space-between;
            height: 50px;
            line-height: 50px;
            padding: 0 15px;
            border-bottom: 1px #eee solid;

            .nav-item{
              display: flex;
              align-items: center;
            }

            .isCollapse{
              margin-right: 8px;
              cursor: pointer;
            }
        }

        .wrapper{
            background: #f2f4f8;
            padding:15px;
            height:calc(100vh - 82px);

            .main-page{
                height:calc(100% - 30px);
                background:#fff;
                padding: 15px;
            }
        }
    }

    ::v-deep(.el-menu-vertical-demo){
      height: 100%;
      border-right: none;
      background-color:#001529!important;

      .el-menu-item{
        background-color:#001529!important;
      }

      .el-submenu__title{
        background-color:#001529!important;
      }
    }

}
</style>
