import { AsyncStorage } from 'react-native'
import { CALENDAR_STORAGE_KEY, formatCalendarResults } from './_calendar'

export async function fetchCalendarResults() {
  let result = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
  return formatCalendarResults(result)
}
export function submitEntry({ entry, key }) {
  return AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
    [key]: entry
  }))
}

export async function removeEntry(key) {
  const result = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
  const data = JSON.parse(result)
  console.log('Data', data, data[key])
  data[key] = undefined
  delete data[key]
  AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data))
}