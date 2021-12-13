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
          v-for="route in menuList"
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
        <div class="nav-right">
          <div class="info-mode" @click="goApprovePage" v-has="'approve-check'">
            <el-badge :is-dot="count">
              <i class="el-icon-message-solid" style="display:block;"/>
            </el-badge>
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
import { getPermissionMenuList } from '@/api/menu'

export default {
  components: { LeftNav, BreadCrumb },
  data() {
    return {
      isCollapse: false,
      menuList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo','count', 'permission_routes']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  created() {
    this.getMenuListData()
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
    goApprovePage(){
      this.$router.push('/approve')
    },
    openLeftCollapse() {
      this.isCollapse = !this.isCollapse
    },
    getMenuListData() {
      getPermissionMenuList().then(res => {
        const { menuList, activeList } = res.data
        this.menuList = menuList || []
        this.$store.dispatch('user/saveUserMenuList', menuList)
        this.$store.dispatch('user/saveUserActiveList', activeList)
      })
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
        position: relative;
        height: 100vh;
        margin-left: 260px;
        transition: all .5s;

        .nav-top{
            position: fixed;
            top: 0;
            display:flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            width:calc(100% - 280px);
            line-height: 50px;
            padding: 0 15px;
            border-bottom: 1px $border-eee solid;
            background:$whiteBg;
            z-index: 1000;

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
                // line-height: 50px;
              }
            }
        }

        .nav-right{
          display: flex;
          align-items: center;

          .info-mode{
            padding: 0 15px;
            cursor: pointer;
          }
        }

        .wrapper{
            background: $bodyBg;
            padding:70px 15px 15px 15px;
            height:calc(100vh - 90px);

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

      .nav-top{
        width:calc(100% - 89px);
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
