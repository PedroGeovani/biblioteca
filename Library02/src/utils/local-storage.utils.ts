export default class LocalStorage<T> {
  getItem(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        const decodedItem = atob(item);
        return JSON.parse(decodedItem);
      } catch (error) {
        this.removeItem(key)
        return null;
      }
    }
    return null;
  }

  setItem(key: string, value: T): void {
    const stringValue = JSON.stringify(value);
    const encodedValue = btoa(stringValue);
    localStorage.setItem(key, encodedValue);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
}
