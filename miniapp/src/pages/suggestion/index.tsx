import { useState } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import { submitSuggestion } from '../../services/tools'
import './index.scss'

const EMOJIS = ['💡', '🔥', '👍', '🐛', '⚠️', '✨', '🤔', '❤️']

export default function SuggestionPage() {
  const [text, setText] = useState('')
  const [emoji, setEmoji] = useState('💡')
  const [anonymous, setAnonymous] = useState(true)
  const [busy, setBusy] = useState(false)

  const onSend = async () => {
    const suggestion = text.trim()
    if (suggestion.length < 3) {
      Taro.showToast({ title: '请至少输入 3 个字', icon: 'none' })
      return
    }
    if (busy) return
    setBusy(true)
    try {
      const r = await submitSuggestion({
        suggestion,
        emoji,
        anonymous,
        path: '/miniapp/suggestion',
      })
      if (r.success) {
        Taro.showToast({ title: r.message || '建议已提交', icon: 'success' })
        setTimeout(() => Taro.navigateBack(), 600)
      } else {
        Taro.showToast({ title: r.message || '提交失败', icon: 'none' })
      }
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '提交失败', icon: 'none' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <View className='sug'>
      <NavBar title='建议' back />

      <View className='sug__card'>
        <Textarea
          className='sug__input'
          value={text}
          maxlength={2000}
          placeholder='想法、建议或问题？'
          onInput={(e) => setText(e.detail.value)}
        />

        <View className='sug__row'>
          <View
            className='sug__anon'
            onClick={() => setAnonymous((v) => !v)}
          >
            <View className={`sug__check ${anonymous ? 'sug__check--on' : ''}`}>
              {anonymous ? <Text className='sug__check-t'>✓</Text> : null}
            </View>
            <Text className='sug__anon-t'>匿名提交</Text>
          </View>
          <View className='sug__emojis'>
            {EMOJIS.map((e) => (
              <View
                key={e}
                className={`sug__emoji ${emoji === e ? 'sug__emoji--on' : ''}`}
                onClick={() => setEmoji(e)}
              >
                <Text className='sug__emoji-t'>{e}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='sug__actions'>
          <View
            className='sug__btn sug__btn--ghost'
            onClick={() => Taro.navigateBack()}
          >
            <Text className='sug__btn-t'>取消</Text>
          </View>
          <View
            className='sug__btn sug__btn--ghost'
            onClick={() => setText('')}
          >
            <Text className='sug__btn-t'>清空</Text>
          </View>
          <View
            className={`sug__btn sug__btn--primary ${text.trim().length < 3 || busy ? 'sug__btn--disabled' : ''}`}
            onClick={onSend}
          >
            <Text className='sug__btn-t sug__btn-t--w'>
              {busy ? '提交中…' : '发送'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
