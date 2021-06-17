<template>
  <div class="layout-base">
    <div class="nav-side" :class="{'hide-nav-side':isCollapse}">
      <el-menu
        :unique-opened="true"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        :collapse="isCollapse"
        :default-active="activeMenu"
        :router="true"
      >
        <LeftNav
          v-for="route in permission_routes"
          :key="route.path"
          :menu="route"
          :base-path="route.path"
        />
      </el-menu>
    </div>
    <div class="layout-content" :class="{'hide-layout-content':isCollapse}">
      <div class="nav-top">
        <div class="nav-item">
          <i class="el-icon-s-fold isCollapse" @click="openLeftCollapse" />
          <BreadCrumb />
        </div>
        <el-dropdown class="suer-info" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userInfo.userName }} <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="userinfo">个人信息</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="login-out">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="wrapper">
        <!-- <div class="main-page"> -->
        <router-view />
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import LeftNav from './components/leftNav.vue'
import BreadCrumb from './components/BreadCrumb.vue'
import { mapGetters } from 'vuex'

export default {
  components: { LeftNav, BreadCrumb },
  data() {
    return {
      isCollapse: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      console.log(path)
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  created() {

  },
  methods: {
    handleCommand(path) {
      switch (path) {
        case 'login-out':
          return this.loginOut()
        case 'userinfo':
          break
        case 'password':
          this.$router.push('password')
          break
        default:
          break
      }
    },
    loginOut() {
      this.$stroage.clearItem('userInfo')
      this.$router.push('/login')
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
        color: $white;
        transition: all .5s;
    }

    .hide-nav-side{
      width: 64px;
      transition: all .5s;
    }

    .layout-content{
        margin-left: 260px;
        transition: all .5s;

        .nav-top{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            line-height: 50px;
            padding: 0 15px;
            border-bottom: 1px $border-eee solid;
            background:$whiteBg;

            .nav-item{
              display: flex;
              align-items: center;
            }

            .isCollapse{
              margin-right: 8px;
              cursor: pointer;
            }

            .suer-info{

              .el-dropdown-link{
                cursor: pointer;
                color: $blueText;
              }
            }
        }

        .wrapper{
            background: $bodyBg;
            padding:15px;
            height:calc(100vh - 82px);

            .main-page{
                height:calc(100% - 30px);
                background:$whiteBg;
                padding: 15px;
            }
        }
    }

    .hide-layout-content{
      margin-left: 64px;
      transition: all .5s;
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
