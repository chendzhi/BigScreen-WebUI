import Vue from 'vue'
import { thousandth } from '@/utils'

Vue.filter('thousandth', thousandth)

/**
 * 描述：单位数值格式化（如将数值转换为以万为单位的数值）
 * val: 当前数值
 * options：配置项
 * options: {
 *  unitNum: 单位倍数
 *  isUnitWord: 是否保留单位
 *  unitWord: 单位
 *  fractionDigits: 保留小数位
 *  isThousandth: 是否千分符处理
 * }
 */
Vue.filter('unitNumFmt', function(val, option) {
  let defaults = {
    unitNum: 10000,
    isUnitWord: false,
    unitWord: '万',
    fractionDigits: 1,
    isThousandth: false
  }
  let opt = Object.assign({}, defaults, option)
  let num = (val / opt.unitNum).toFixed(opt.fractionDigits)
  if (opt.isThousandth) {
    num = thousandth(num)
  }
  if (opt.isUnitWord) {
    num = num + opt.unitWord
  }
  return num
})
