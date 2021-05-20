<template>
  <div class="layout-base">
    <div class="nav-side">32</div>
    <div class="layout-content">
      <div class="nav-top">
        <div class="nav-item">首页</div>
        <div class="suer-info">用户</div>
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
export default {
  data() { return {} }
}
</script>

<style scoped lang="scss">
.layout-base{
    position: relative;

    .nav-side{
        position: fixed;
        width: 200px;
        height: 100vh;
        overflow-y: auto;
        background:#001529;
        color: #fff;
    }

    .layout-content{
        margin-left: 200px;

        .nav-top{
            display: flex;
            justify-content: space-between;
            height: 50px;
            line-height: 50px;
            padding: 0 15px;
            border-bottom: 1px #eee solid;
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

}
</style>
