import { useEffect, useState } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import {
  getStorageUnits,
  searchAdjustmentItems,
  submitInventoryAdjustment,
} from '../../services/inventory'
import type { ItemHit, StorageUnitRow } from '../../services/inventory'
import { t } from '../../i18n'
import './index.scss'

type Mode = 'add' | 'remove'

export default function InventoryAdjustPage() {
  const router = useRouter()
  const mode = ((router.params.mode as Mode) || 'add') as Mode
  const isAdd = mode !== 'remove'
  const title = isAdd ? t('inv.add') : t('inv.remove')
  const entryType = isAdd
    ? ('Positive Adjmt.' as const)
    : ('Negative Adjmt.' as const)

  const [item, setItem] = useState<ItemHit | null>(null)
  const [qty, setQty] = useState('1')
  const [unitId, setUnitId] = useState('')
  const [units, setUnits] = useState<StorageUnitRow[]>([])
  const [busy, setBusy] = useState(false)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<ItemHit[]>([])
  const [searching, setSearching] = useState(false)
  const [unitOpen, setUnitOpen] = useState(false)

  useEffect(() => {
    getStorageUnits()
      .then((r) => setUnits(r.rows ?? []))
      .catch(() => {})
  }, [])

  const loadItems = async (q = '') => {
    setSearching(true)
    try {
      const r = await searchAdjustmentItems(q)
      setHits(r.rows ?? [])
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '加载物料失败', icon: 'none' })
    } finally {
      setSearching(false)
    }
  }

  const openItemPicker = () => {
    setQuery('')
    setHits([])
    setPickerOpen(true)
    void loadItems('')
  }

  const pickItem = async (hit: ItemHit) => {
    setItem(hit)
    setPickerOpen(false)
    try {
      const r = await getStorageUnits(hit.id)
      setUnits(r.rows ?? [])
      if (r.defaultStorageUnitId) {
        setUnitId(r.defaultStorageUnitId)
      }
    } catch {
      /* keep existing units */
    }
  }

  const selectedUnit = units.find((u) => u.id === unitId)

  const onSubmit = async () => {
    if (busy) return
    if (!item) {
      Taro.showToast({ title: '请选择物料', icon: 'none' })
      return
    }
    const quantity = Number(qty)
    if (!Number.isFinite(quantity) || quantity < 1) {
      Taro.showToast({ title: '数量须大于 0', icon: 'none' })
      return
    }
    setBusy(true)
    try {
      const r = await submitInventoryAdjustment({
        itemId: item.id,
        quantity,
        storageUnitId: unitId || null,
        entryType,
      })
      if (r.success) {
        Taro.showToast({ title: isAdd ? '已添加' : '已移除', icon: 'success' })
        setTimeout(() => Taro.navigateBack(), 600)
      } else {
        Taro.showToast({ title: r.message || '操作失败', icon: 'none' })
      }
    } catch (e: any) {
      if (e?.statusCode !== 401) {
        Taro.showToast({ title: e?.message || '操作失败', icon: 'none' })
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <View className='inv'>
      <NavBar title={title} back />

      <View className='inv__form'>
        <Text className='inv__label'>物料</Text>
        <View
          className='inv__field'
          hoverClass='inv__field--hover'
          onClick={openItemPicker}
        >
          <View className='inv__field-body'>
            {item ? (
              <>
                <Text className='inv__field-main'>{item.name}</Text>
                {item.desc ? (
                  <Text className='inv__field-sub'>{item.desc}</Text>
                ) : null}
              </>
            ) : (
              <Text className='inv__placeholder'>选择物料</Text>
            )}
          </View>
          <Text className='inv__chev'>›</Text>
        </View>

        <Text className='inv__label'>数量</Text>
        <Input
          className='inv__input'
          type='digit'
          value={qty}
          placeholder='1'
          onInput={(e) => setQty(e.detail.value)}
        />

        <Text className='inv__label'>仓位</Text>
        <View
          className='inv__field'
          hoverClass='inv__field--hover'
          onClick={() => setUnitOpen(true)}
        >
          <Text
            className={
              selectedUnit ? 'inv__field-main' : 'inv__placeholder'
            }
          >
            {selectedUnit?.name || '选择仓位（可选）'}
          </Text>
          <Text className='inv__chev'>›</Text>
        </View>

        <View
          className={`inv__submit ${isAdd ? 'inv__submit--add' : 'inv__submit--remove'}`}
          hoverClass='inv__submit--hover'
          onClick={onSubmit}
        >
          <Text className='inv__submit-text'>
            {busy ? '提交中…' : title}
          </Text>
        </View>
      </View>

      {pickerOpen ? (
        <View className='inv__mask' onClick={() => setPickerOpen(false)}>
          <View
            className='inv__sheet'
            onClick={(e) => e.stopPropagation()}
          >
            <Text className='inv__sheet-title'>选择物料</Text>
            <View className='inv__search'>
              <Input
                className='inv__search-input'
                value={query}
                placeholder='搜索编码 / 名称'
                focus
                onInput={(e) => {
                  const v = e.detail.value
                  setQuery(v)
                  void loadItems(v.trim())
                }}
              />
            </View>
            <ScrollView scrollY className='inv__hits'>
              {searching && hits.length === 0 ? (
                <Text className='inv__empty'>加载中…</Text>
              ) : hits.length === 0 ? (
                <Text className='inv__empty'>无匹配物料</Text>
              ) : (
                hits.map((h) => (
                  <View
                    key={h.id}
                    className='inv__hit'
                    hoverClass='inv__hit--hover'
                    onClick={() => pickItem(h)}
                  >
                    <Text className='inv__hit-name'>{h.name}</Text>
                    {h.desc ? (
                      <Text className='inv__hit-desc'>{h.desc}</Text>
                    ) : null}
                  </View>
                ))
              )}
            </ScrollView>
            <View
              className='inv__sheet-close'
              onClick={() => setPickerOpen(false)}
            >
              <Text className='inv__sheet-close-text'>关闭</Text>
            </View>
          </View>
        </View>
      ) : null}

      {unitOpen ? (
        <View className='inv__mask' onClick={() => setUnitOpen(false)}>
          <View
            className='inv__sheet'
            onClick={(e) => e.stopPropagation()}
          >
            <Text className='inv__sheet-title'>选择仓位</Text>
            <ScrollView scrollY className='inv__hits'>
              <View
                className='inv__hit'
                hoverClass='inv__hit--hover'
                onClick={() => {
                  setUnitId('')
                  setUnitOpen(false)
                }}
              >
                <Text className='inv__hit-name'>不指定</Text>
              </View>
              {units.length === 0 ? (
                <Text className='inv__empty'>当前库位无仓位</Text>
              ) : (
                units.map((u) => (
                  <View
                    key={u.id}
                    className={`inv__hit ${unitId === u.id ? 'inv__hit--on' : ''}`}
                    hoverClass='inv__hit--hover'
                    onClick={() => {
                      setUnitId(u.id)
                      setUnitOpen(false)
                    }}
                  >
                    <Text className='inv__hit-name'>{u.name}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <View
              className='inv__sheet-close'
              onClick={() => setUnitOpen(false)}
            >
              <Text className='inv__sheet-close-text'>关闭</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  )
}
