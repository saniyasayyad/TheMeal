import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 })

export const cacheService = {
  get<T>(key: string): T | undefined {
    return cache.get<T>(key)
  },

  set<T>(key: string, value: T, ttl?: number): void {
    if (ttl !== undefined) {
      cache.set(key, value, ttl)
    } else {
      cache.set(key, value)
    }
  },

  del(key: string): void {
    cache.del(key)
  },

  flush(): void {
    cache.flushAll()
  },
}
