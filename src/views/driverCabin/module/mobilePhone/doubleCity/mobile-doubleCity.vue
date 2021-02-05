<template>
  <div class="main">
    <!-- 头部 -->
    <top></top>
    
     <!-- 政声传递 -->
    <politicsSpread :politicsSpread="politicsSpread" :groupName="groupName"></politicsSpread>
   
  </div>
</template>
<script>
import top from "../../components/top.vue";
import politicsSpread from "../../components/politicsSpread.vue";
export default {
  components: {
    top,
    politicsSpread,
  },
  data() {
    return {
      politicsSpread: {},
      
      groupName:'成渝双城'
    }
  },
  created(){
    
  }
};
</script>
<style lang="scss" scoped>

</style>