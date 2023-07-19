export function serializeData<T>(data: T): T {
  if (data instanceof Array) {
    return data.map((item) => serializeData(item)) as T
  } else if (typeof data === 'object' && data !== null) {
    const serializedData: any = {}
    for (const [key, value] of Object.entries(data)) {
      serializedData[key] = serializeValue(value)
    }
    return serializedData as T
  } else {
    return data as T
  }
}

export function serializeValue<T>(value: T): any {
  if (typeof value === 'bigint') {
    return value.toString()
  } else if (value instanceof Date) {
    return value.toISOString()
  } else if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item))
  } else if (typeof value === 'object' && value !== null) {
    return serializeData(value)
  } else {
    return value as T
  }
}
