import { mount, createLocalVue } from '@vue/test-utils'
import { Tweezing, tweezerHelper } from '../src'
import Tweezer from './mocks/tweezer'
import Helper from './utils/Helper'

const localVue = createLocalVue()
localVue.use(Tweezing, {
  tweezer: tweezerHelper(Tweezer),
})

describe('Tweezer', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Helper, {
      localVue,
      propsData: {
        to: 0,
      },
    })
  })

  test('starts right away', () => {
    expect(wrapper.text()).toBe('0')
  })

  test('emits start when starting', () => {
    const tweezing = wrapper.find(Tweezing)
    expect(tweezing.emitted().start).toBeTruthy()
    expect(tweezing.emitted().start.length).toBe(1)
  })

  test('emits end when ending', () => {
    const tweezing = wrapper.find(Tweezing)
    tweezing.vm.$tween._end()
    expect(tweezing.emitted().end).toBeTruthy()
    expect(tweezing.emitted().end.length).toBe(1)
  })

  test('stops ongoing tween with a new one', () => {
    const tweezing = wrapper.find(Tweezing)
    const spy = jest.spyOn(tweezing.vm.$tween, 'stop')
    wrapper.setProps({ to: 1 })
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  describe('Options', () => {
    let spy
    let localVue
    beforeEach(() => {
      spy = jest.fn()
      function Mock (...args) {
        spy(...args)
        Tweezer.apply(this, args)
      }
      Mock.prototype = Tweezer.prototype
      localVue = createLocalVue()
      localVue.use(Tweezing, {
        tweezer: tweezerHelper(Mock),
      })
    })

    afterEach(() => {
      spy.mockRestore()
    })

    test('should pass on props as options', () => {
      wrapper = mount(Helper, {
        localVue,
        propsData: {
          to: 0,
          // these have to be added in Helper.vue
          duration: 10,
          other: true,
        },
      })
      expect(spy).toHaveBeenCalledWith({
        start: 0,
        end: 0,
        duration: 10,
        other: true,
      })
    })

    test('pass on easing prop', () => {
      wrapper = mount(Helper, {
        localVue,
        propsData: {
          to: 0,
          easing: 'foo',
        },
      })
      expect(spy).toHaveBeenCalledWith({
        start: 0,
        end: 0,
        easing: 'foo',
      })
    })
  })
})
