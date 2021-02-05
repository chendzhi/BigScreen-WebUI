<template>
  <div></div>
</template>

<script>
import settings from '@/settings'
import authUtils from '@/utils/auth'
import loginApi from '@/api/login'
import { mapMutations } from 'vuex'
import { Notification } from 'element-ui'
export default {
  data(){
    return{
      productNo: ''
    }
  },
  methods:{
    ...mapMutations([
      'tokenSet',
      'userSet'
    ]),
    // 跳转对应产品宣传页
    jumpProductIntro() {
      let productNo = this.productNo
      if (productNo && productNo === settings.product.integration.code) {
        this.$router.push(`/${settings.product.integration.code}/intro`)
      } else if (productNo && productNo === settings.product.driverCabin.code) {
        this.$router.push(`/${settings.product.driverCabin.code}/intro`)
      }
    },
    authorization(){
      let code = this.$route.query.code || ''
      let productNo =  this.$route.query.productNo || ''
      this.productNo = productNo

      if (code === '400') {
        Notification.error({
          title: this.$route.query.message || '',
          duration: 5000
        })
        this.jumpProductIntro()
        return

      } else if (code === '200') {
        let token =  this.$route.query.token || ''

        if (!token || !productNo) {
          Notification.error({
            title: '必要参数缺失',
            duration: 5000
          })
          this.jumpProductIntro()
          return
        }

        loginApi.getUser({
          token
        }).then(user => {
          debugger
          this.tokenSet(token)
          authUtils.setToken(productNo, token)
          this.userSet(user)
          authUtils.setUser(productNo, user)

          // 跳转
          // 驾驶舱大屏有3个路径跳转单独处理
          if (productNo === settings.product.driverCabin.code) {
            // organType  1部委 2省|直辖市 3市
            if (user.organType === 1) {
              this.$router.push(`/product/${productNo}/department`)
            } else if (user.organType === 2) {
              this.$router.push(`/product/${productNo}/province`)
            } else if (user.organType === 3) {
              this.$router.push(`/product/${productNo}/city`)
            }
          } else {
            this.$router.push(`/product/${productNo}`)
          }
        })

      } else {
        this.jumpProductIntro()
      }
    }
  },
  mounted(){
    this.authorization();
  }
}
</script>
