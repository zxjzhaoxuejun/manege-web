<template>
  <div class="img-warp">
    <div class="img-scale">
      <div class="img-item">
        <img src="https://image.dhgate.com/f2/albu/g18/M01/B3/95/rBVapGDCw1GATMeWAAIWvsYuc4M291.jpg">
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
/*img-warp 用来控制宽度 */
.img-warp {
    width: 100%;

    /* img-scale 用来实现宽高等比例 1:1 padding-bottom:100%; 4:3 padding-bottom:75%; 16:9 padding-bottom:56.25%; */
    .img-scale {
        width: 100%;
        padding-bottom: 75%;
        height: 0;
        position: relative;
    }

    /* img-item 用来放置全部的子元素 */
    .img-item {
        width: 100%;
        height: 100%;
        background-color: #000;
        position: absolute;
        overflow: hidden;

        img{
            display: block;
            max-width: 100%;
            height: auto;
        }
    }
}

</style>
