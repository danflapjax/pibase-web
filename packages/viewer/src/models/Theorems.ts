import type { Theorem as BTheorem } from '@pi-base/core'

import Theorem from './Theorem'
import type { Data, Property } from '../types'
import { idToInt } from '../util'

export default class Theorems {
  private theorems: Map<number, Theorem>

  static fromData(data: Data | undefined): Theorems {
    if (data) {
      return new Theorems(data.theorems, data.properties)
    } else {
      return new Theorems([], [])
    }
  }

  constructor(theorems: BTheorem[], properties: Property[]) {
    const ix = new Map(properties.map((p) => [p.uid, p]))

    this.theorems = new Map()
    theorems.forEach((t) => {
      const hydrated = Theorem.hydrate(t, (p) => ix.get(p))
      if (hydrated) {
        this.theorems.set(idToInt(t.uid), hydrated)
      }
    })
  }

  find(uid: string | number) {
    const key = typeof uid === 'string' ? idToInt(uid) : uid
    return this.theorems.get(key) || null
  }

  get all() {
    return Array.from(this.theorems.values())
  }
}
