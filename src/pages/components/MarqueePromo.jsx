import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

import { Flex, Typography } from 'antd'

import { IconRosetteDiscountFilled, IconShoppingBagDiscount } from '@tabler/icons-react'

const { Text } = Typography
gsap.registerPlugin(useGSAP)

const MarqueePromo = ({ position, direction = 'right' }) => {
  const container = useRef(null)

  function horizontalLoop (items, config) {
    items = gsap.utils.toArray(items)
    config = config || {}
    const tl = gsap.timeline({ repeat: config.repeat, paused: config.paused, defaults: { ease: 'none' }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100) })
    const length = items.length
    const startX = items[0].offsetLeft
    const times = []
    const widths = []
    const xPercents = []
    let curIndex = 0
    const pixelsPerSecond = (config.speed || 1) * 100
    const snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1) // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    let curX
    let distanceToStart
    let distanceToLoop
    let item
    let i
    gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
      xPercent: (i, el) => {
        const w = widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px'))
        xPercents[i] = snap(parseFloat(gsap.getProperty(el, 'x', 'px')) / w * 100 + gsap.getProperty(el, 'xPercent'))
        return xPercents[i]
      }
    })
    gsap.set(items, { x: 0 })
    const totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], 'scaleX') + (parseFloat(config.paddingRight) || 0)
    for (i = 0; i < length; i++) {
      item = items[i]
      curX = xPercents[i] / 100 * widths[i]
      distanceToStart = item.offsetLeft + curX - startX
      distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX')
      tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
        .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
        .add('label' + i, distanceToStart / pixelsPerSecond)
      times[i] = distanceToStart / pixelsPerSecond
    }
    function toIndex (index, vars) {
      vars = vars || {};
      (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length) // always go in the shortest direction
      const newIndex = gsap.utils.wrap(0, length, index)
      let time = times[newIndex]
      if ((time > tl.time()) !== (index > curIndex)) { // if we're wrapping the timeline's playhead, make the proper adjustments
        vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
        time += tl.duration() * (index > curIndex ? 1 : -1)
      }
      curIndex = newIndex
      vars.overwrite = true
      return tl.tweenTo(time, vars)
    }
    tl.next = vars => toIndex(curIndex + 1, vars)
    tl.previous = vars => toIndex(curIndex - 1, vars)
    tl.current = () => curIndex
    tl.toIndex = (index, vars) => toIndex(index, vars)
    tl.times = times
    tl.progress(1, true).progress(0, true) // pre-render for performance
    if (config.reversed) {
      tl.vars.onReverseComplete()
      tl.reverse()
    }
    return tl
  }

  useGSAP(() => {
    if (container.current) {
      const elements = gsap.utils.toArray('.marqueElement')
      horizontalLoop(elements, { paused: false, repeat: -1, reversed: direction === 'right' })
    }
  }, {
    scope: container
  })

  return (
    <Flex ref={container} style={{ position: 'absolute', zIndex: 5, left: 0, color: 'white', alignItems: 'center', fontSize: '1.5rem', paddingBlock: 10, overflow: 'hidden', width: '100%', ...(position === 'top' ? { top: 0 } : { bottom: 0 }) }}>
      <Flex className='marquee-promo-banner'>
        <Text className='marqueElement'>
          Sale
        </Text>
        <span className='marqueElement'><IconShoppingBagDiscount /></span>
        <Text className='marqueElement'>
          Sale
        </Text>
        <span className='marqueElement'><IconRosetteDiscountFilled /></span>
        <Text className='marqueElement'>
          Sale
        </Text>
        <span className='marqueElement'><IconShoppingBagDiscount /></span>
        <Text className='marqueElement'>
          Sale
        </Text>
        <span className='marqueElement'><IconRosetteDiscountFilled /></span>
      </Flex>
    </Flex>
  )
}

export default MarqueePromo
