import mapConf from '@/config/map'

/**
 * 根据code获取对象
 * @param {string} code
 * return object
 */
export function getModel (code) {
  if (!code) { return {} }
  let model = mapConf.region[code]
  if (!model) {
    return {}
  }
  model.code = code
  return model
}

/**
 * 获取直接子级行政地区数据
 * @param {string} code 父级行政编码
 * return array
 */
export function getChild (code) {
  if (!code) { return [] }

  let keys = []
  // 海南省 海南编码规则特殊单独处理
  if (code === '460000') {
    keys = ['460100','460200','460300','460400','469001','469002','469005','469006','469007','469021','469022','469023','469024','469025','469026','469027','469028','469029','469030']
  } else {
    keys = Object.keys(mapConf.region).filter(key => {
      if (key === code) {return false}
      // 全国
      if (code === '100000') { return key.endsWith('0000')}
      // 省|直辖市
      else if (code.endsWith('0000')) {
        let isZxs = ['110000', '120000', '310000', '500000'].includes(code) // 是否直辖市 北京，天津，上海，重庆
        if (isZxs) {
          // 去除市辖区 保留区
          return key.startsWith(code.slice(0, 2)) && !key.endsWith('00')
        }
        return key.startsWith(code.slice(0, 2)) && key.endsWith('00')
      }
      // 地市
      else if (code.endsWith('00')) {
        return key.startsWith(code.slice(0, 4))
      }
    })
  }

  return keys.map(key => {
    let model = mapConf.region[key]
    model.code = key
    return model
  })
}

/**
 * 根据行政编码判断是否为直辖市
 * @param {string} code
 * return boolean
 */
export function isZxs (code) {
  return code ? ['110000', '120000', '310000', '500000'].includes(code) : false
}


export default {
  getModel,
  getChild,
  isZxs
}
