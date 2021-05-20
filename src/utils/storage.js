import config from './../config'

export default {
  setItem(key, val) {
    const stroage = this.getStroage()
    stroage[key] = val
    window.localStorage.setItem(config.namespace, JSON.stringify(stroage))
  },
  getItem(key) {
    return this.getStroage()[key]
  },
  getStroage() {
    return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
  },
  clearItem(key) {
    const stroage = this.getStroage()
    delete stroage[key]
    window.localStorage.setItem(config.namespace, JSON.stringify(stroage))
  },
  clearAll() {
    window.localStorage.clear()
  }
}
