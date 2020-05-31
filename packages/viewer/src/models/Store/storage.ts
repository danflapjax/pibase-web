import { Id, bundle } from '@pi-base/core'

import { Store } from './state'

const storageKey = 'pibase.bundle'

const defaultHost = process.env.REACT_APP_BUNDLE_HOST || 'http://localhost:3141'

function loadFromStorage(storage = localStorage): Store | undefined {
  const raw = storage.getItem(storageKey)
  if (!raw) { return }

  try {
    const parsed = JSON.parse(raw)
    return {
      ...bundle.deserialize(parsed),
      checked: new Set(parsed.checked || []),
      etag: parsed.etag || ''
    }
  } catch (e) {
    console.error(e) // TODO: send to Sentry
    return
  }
}

export function save(
  store: Store,
  storage = localStorage
) {
  const serialized = {
    ...bundle.serialize(store),
    checked: Array.from(store.checked),
    etag: store.etag
  }
  storage.setItem(storageKey, JSON.stringify(serialized))
}

async function loadFromRemote(
  opts: {
    branch: string
    host?: string
  }
): Promise<Store | undefined> {
  const response = await bundle.fetch(opts)
  if (!response) { return }

  const { bundle: result, etag } = response
  return {
    ...result,
    checked: new Set<Id>(),
    etag
  }
}

export async function load(
  branch: string,
  storage = localStorage
): Promise<Store | undefined> {
  let loaded = loadFromStorage(storage)
  const opts: { branch: string, host: string, etag?: string } = { branch, host: defaultHost }
  if (loaded?.etag) { opts.etag = loaded.etag }

  const fetched = await loadFromRemote(opts)
  if (fetched) {
    save(fetched, storage)
    return fetched
  } else if (loaded) {
    return loaded
  } else {
    // TODO: handle error
  }
}
