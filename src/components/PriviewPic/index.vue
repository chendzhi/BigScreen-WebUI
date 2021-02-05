<template>
  <div class="preview-pic-wrap">
    <div class="preview-close" @click="onClose">
      <i class="el-icon-close"></i>
    </div>
    <div class="img-conent">
      <img class="img" :src="path" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      path:"",
    }
  },
  methods:{
    onClose() {
      window.close()
    }
  },
  mounted(){
    this.path = this.$route.query.url;
  }
}
</script>

<style lang="scss">
.preview-pic-wrap{
  position: relative;
  width:100%;
  height: auto;
  background-color: #525659;
  .preview-close {
    position: fixed;
    top: 20px;
    right: 20px;
    height: 36px;
    width: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 50%;
    font-size: 24px;
    background-color: #1a379e;
    color: #549add;
    transition: all .2s linear;
    cursor: pointer;
    &:hover {
      background-color: #549add;
      color: #1a379e;
    }
  }
}
.preview-pic-wrap .img-conent{
  width:100%;
  height: auto;
  margin:  0 auto;
}
.img{
  width: 100%;
  height: auto;
}

</style>
