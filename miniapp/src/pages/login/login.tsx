import { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import type { ButtonProps } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { login } from '../../services/auth'
import type { LoginResponse } from '../../services/auth'
import './login.scss'

export default function Login() {
  const [loading, setLoading] = useState(false)
  // 首次登录后端要求授权手机号 → 切换到「授权手机号」按钮。
  const [needPhone, setNeedPhone] = useState(false)

  const afterLogin = (res: LoginResponse) => {
    if (!res.hasCompany) {
      Taro.showModal({
        title: '登录成功',
        content: '当前微信账号尚未绑定员工/公司,暂无可查看的数据。请联系管理员邀请你的手机号。',
        showCancel: false,
      })
    }
    Taro.reLaunch({ url: '/pages/index/index' })
  }

  // 第一步:仅用 wx.login 的 code 尝试(老用户一步到位)。
  const onLogin = async () => {
    setLoading(true)
    try {
      const res = await login()
      afterLogin(res)
    } catch (e: any) {
      if (e?.statusCode === 409) {
        setNeedPhone(true)
        Taro.showToast({ title: '首次登录,请授权手机号', icon: 'none' })
      } else {
        Taro.showToast({ title: e?.message || '登录失败,请重试', icon: 'none' })
      }
    } finally {
      setLoading(false)
    }
  }

  // 第二步:授权手机号 → 带 phoneCode 重试(login 内部会重新取新鲜的登录 code)。
  const onGetPhone: ButtonProps['onGetPhoneNumber'] = async (e) => {
    const phoneCode = e.detail?.code
    if (!phoneCode) {
      Taro.showToast({ title: '需授权手机号才能登录', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      const res = await login(phoneCode)
      afterLogin(res)
    } catch (err: any) {
      Taro.showToast({ title: err?.message || '登录失败,请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='login'>
      <View className='login__brand'>
        <Text className='login__title'>Carbon MES</Text>
        <Text className='login__subtitle'>车间操作端</Text>
      </View>

      {needPhone ? (
        <Button
          className='login__btn'
          type='primary'
          loading={loading}
          openType='getPhoneNumber'
          onGetPhoneNumber={onGetPhone}
        >
          授权手机号登录
        </Button>
      ) : (
        <Button
          className='login__btn'
          type='primary'
          loading={loading}
          onClick={onLogin}
        >
          微信登录
        </Button>
      )}

      <Text className='login__hint'>
        使用微信登录。首次登录需授权手机号,以关联管理员已邀请的员工账号。
      </Text>
    </View>
  )
}
