/**
 * Hero 样式集合
 * 只保留科技网格和极简打字机两个样式
 */

import HeroStyle3 from './HeroStyle3'
import HeroStyle4 from './HeroStyle4'

export {
  HeroStyle3,
  HeroStyle4,
}

// 样式映射（用于动态加载）
export const HeroStyles = {
  '3': HeroStyle3,
  '4': HeroStyle4,
}

// 样式描述（用于后台配置）
export const HeroStyleDescriptions = [
  {
    id: '3',
    name: '科技网格',
    description: '科技感网格背景，动态光标跟随效果',
    preview: '🌐',
  },
  {
    id: '4',
    name: '极简打字机',
    description: '打字机动画效果，极简设计风格',
    preview: '⌨️',
  },
]
