import { useMemo, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { logout } from '../../services/auth'
import { getMe } from '../../services/me'
import type { Me } from '../../services/me'
import TabBar from '../../components/TabBar'
import NavBar from '../../components/NavBar'
import {
  getLocale,
  getLocaleLabel,
  setLocale,
  sortedLocaleOptions,
  t,
  type LocaleCode,
} from '../../i18n'
import './index.scss'

export default function Profile() {
  const [me, setMe] = useState<Me | null>(null)
  const [locale, setLocaleState] = useState<LocaleCode>(getLocale)
  const [langOpen, setLangOpen] = useState(false)

  useDidShow(() => {
    setLocaleState(getLocale())
    getMe()
      .then(setMe)
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || t('common.loadFailed'), icon: 'none' })
        }
      })
  })

  const items = useMemo(
    () => [
      { key: 'salary', icon: '💰', text: t('profile.salary') },
      { key: 'reports', icon: '✅', text: t('profile.reports') },
      { key: 'schedule', icon: '📆', text: t('profile.schedule') },
      {
        key: 'language',
        icon: '🌐',
        text: t('profile.language'),
        value: getLocaleLabel(locale),
      },
    ],
    [locale],
  )

  const langOptions = useMemo(() => sortedLocaleOptions(locale), [locale])

  const onItem = (key: string) => {
    if (key === 'salary') {
      Taro.navigateTo({ url: '/pages/salary/index' })
      return
    }
    if (key === 'reports') {
      Taro.navigateTo({ url: '/pages/approvals/index' })
      return
    }
    if (key === 'language') {
      setLangOpen(true)
      return
    }
    Taro.showToast({ title: t('profile.todo'), icon: 'none' })
  }

  const onPickLocale = (code: LocaleCode) => {
    if (code === locale) {
      setLangOpen(false)
      return
    }
    setLocale(code)
    setLocaleState(code)
    setLangOpen(false)
    // 整页重载，让 TabBar / 各页文案生效
    Taro.reLaunch({ url: '/pages/profile/index' })
  }

  const sub = [me?.companyName, me?.workCenter].filter(Boolean).join(' · ')

  return (
    <View className='me'>
      <NavBar title={t('nav.me')} />
      <View className='me__head'>
        <View className='me__avatar'>
          {me?.avatarUrl ? (
            <Image className='me__avatar-img' src={me.avatarUrl} />
          ) : (
            <Text className='me__avatar-text'>{me?.initial || '·'}</Text>
          )}
        </View>
        <View className='me__info'>
          <Text className='me__name'>{me?.name || t('profile.loading')}</Text>
          <Text className='me__sub'>{sub || t('profile.noCompany')}</Text>
        </View>
      </View>

      <View className='me__list'>
        {items.map((it) => (
          <View key={it.key} className='me__row' onClick={() => onItem(it.key)}>
            <Text className='me__row-ic'>{it.icon}</Text>
            <Text className='me__row-text'>{it.text}</Text>
            {it.value ? (
              <Text className='me__row-value'>{it.value}</Text>
            ) : null}
            <Text className='me__row-arrow'>›</Text>
          </View>
        ))}
      </View>

      <View className='me__logout' hoverClass='me__logout--hover' onClick={logout}>
        <Text className='me__logout-text'>{t('nav.logout')}</Text>
      </View>

      {langOpen ? (
        <View className='me__mask' onClick={() => setLangOpen(false)}>
          <View className='me__sheet' onClick={(e) => e.stopPropagation()}>
            <Text className='me__sheet-title'>{t('profile.pickLanguage')}</Text>
            <ScrollView scrollY className='me__sheet-list'>
              {langOptions.map((opt) => {
                const on = opt.value === locale
                return (
                  <View
                    key={opt.value}
                    className={`me__lang ${on ? 'me__lang--on' : ''}`}
                    hoverClass='me__lang--hover'
                    onClick={() => onPickLocale(opt.value)}
                  >
                    <Text className='me__lang-text'>{opt.label}</Text>
                    {on ? <Text className='me__lang-check'>✓</Text> : null}
                  </View>
                )
              })}
            </ScrollView>
            <View className='me__sheet-close' onClick={() => setLangOpen(false)}>
              <Text className='me__sheet-close-text'>{t('profile.close')}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <TabBar active='profile' />
    </View>
  )
}
