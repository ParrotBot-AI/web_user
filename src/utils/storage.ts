type StorageType = 'localStorage' | 'sessionStorage';

interface StorageItem<T> {
  value: T;
  expiry: number | null;
}

export function setWithExpiry<T>(key: string, value: T, ttl?: number | null, storageType: StorageType = 'localStorage'): void {
  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
  const now = new Date();
  const item: StorageItem<T> = {
    value: value,
    expiry: ttl ? now.getTime() + ttl : null,
  };
  storage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry<T>(key: string, storageType: StorageType = 'localStorage'): T | null {
  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
  const itemStr = storage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item: StorageItem<T> = JSON.parse(itemStr);
  const now = new Date();

  if (item.expiry && now.getTime() > item.expiry) {
    storage.removeItem(key);
    return null;
  }

  return item.value;
}


export function removeWithExpiry(key: string, storageType: StorageType = 'localStorage'): void {
  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
  storage.removeItem(key);
}
