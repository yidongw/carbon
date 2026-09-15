import { useEffect, useRef, useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { sendCode, verifyCode } from '../../services/auth'
import type { LoginChannel, LoginResponse } from '../../services/auth'
import './login.scss'

const COUNTDOWN = 60

export default function Login() {
  const [channel, setChannel] = useState<LoginChannel>('phone')
  const [value, setValue] = useState('')
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [left, setLeft] = useState(0) // 验证码重发倒计时
  const timer = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => () => clearInterval(timer.current), [])

  const startCountdown = () => {
    setLeft(COUNTDOWN)
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      setLeft((n) => {
        if (n <= 1) clearInterval(timer.current)
        return n - 1
      })
    }, 1000)
  }

  const valueValid =
    channel === 'phone' ? /^1\d{10}$/.test(value) : /^[^@]+@[^@]+$/.test(value)

  const onSend = async () => {
    if (sending || left > 0) return
    if (!valueValid) {
      Taro.showToast({
        title: channel === 'phone' ? '请输入正确的手机号' : '请输入正确的邮箱',
        icon: 'none',
      })
      return
    }
    setSending(true)
    try {
      await sendCode(channel, value)
      Taro.showToast({ title: '验证码已发送', icon: 'none' })
      startCountdown()
    } catch (e: any) {
      Taro.showModal({
        title: '发送失败',
        content: e?.message || '发送失败',
        showCancel: false,
      })
    } finally {
      setSending(false)
    }
  }

  const afterLogin = (res: LoginResponse) => {
    if (!res.hasCompany) {
      Taro.showModal({
        title: '登录成功',
        content: '当前账号尚未加入任何公司,暂无可查看的数据。请联系管理员邀请。',
        showCancel: false,
      })
    }
    Taro.reLaunch({ url: '/pages/index/index' })
  }

  const onLogin = async () => {
    if (!valueValid) {
      Taro.showToast({ title: '请填写正确的登录账号', icon: 'none' })
      return
    }
    if (!/^\d{4,6}$/.test(code)) {
      Taro.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    setLoading(true)
    Taro.showLoading({ title: '登录中…', mask: true })
    try {
      const res = await verifyCode(channel, value, code)
      Taro.hideLoading()
      afterLogin(res)
    } catch (e: any) {
      Taro.hideLoading()
      Taro.showModal({
        title: '登录失败',
        content: e?.message || '登录失败',
        showCancel: false,
      })
    } finally {
      setLoading(false)
    }
  }

  const switchChannel = (next: LoginChannel) => {
    if (next === channel) return
    setChannel(next)
    setValue('')
    setCode('')
    setLeft(0)
    clearInterval(timer.current)
  }

  return (
    <View className='login'>
      <View className='login__brand'>
        <Text className='login__title'>Carbon MES</Text>
        <Text className='login__subtitle'>车间操作端</Text>
      </View>

      <View className='login__tabs'>
        <Text
          className={`login__tab ${channel === 'phone' ? 'login__tab--active' : ''}`}
          onClick={() => switchChannel('phone')}
        >
          手机号登录
        </Text>
        <Text
          className={`login__tab ${channel === 'email' ? 'login__tab--active' : ''}`}
          onClick={() => switchChannel('email')}
        >
          邮箱登录
        </Text>
      </View>

      <View className='login__field'>
        <Input
          className='login__input'
          type={channel === 'phone' ? 'number' : 'text'}
          placeholder={channel === 'phone' ? '请输入手机号' : '请输入邮箱'}
          value={value}
          onInput={(e) => setValue(e.detail.value)}
        />
      </View>

      <View className='login__field login__field--code'>
        <Input
          className='login__input'
          type='number'
          maxlength={6}
          placeholder='请输入验证码'
          value={code}
          onInput={(e) => setCode(e.detail.value)}
        />
        <Text
          className={`login__send ${left > 0 || sending ? 'login__send--disabled' : ''}`}
          onClick={onSend}
        >
          {left > 0 ? `${left}s 后重发` : sending ? '发送中…' : '获取验证码'}
        </Text>
      </View>

      <Button className='login__btn' loading={loading} onClick={onLogin}>
        登录
      </Button>
    </View>
  )
}
