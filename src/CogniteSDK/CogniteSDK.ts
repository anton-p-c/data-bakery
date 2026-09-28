import { CogniteClient } from "@cognite/sdk"
import { atom, type WritableAtom } from "jotai"
import { store } from "../store"
/**

connectionState: 'disconnected' | 'connecting' | 'error' | 'connected'
lastConnectionError: Error | null
requestState: 'idle' | 'pending' | 'success' | 'error'
lastRequestError: Error | null

cogniteSdkMethods

trackingMethods being called




# API:

cogniteClient.connect({appId, projectId, oidcToken})

cogniteClient.sdkMethods.

cogniteClient.state.

 */

type ConnectionState = 'disconnected' | 'connecting' | 'connected'
type RequestState = 'idle' | 'pending' | 'success' 

type CogniteClientState = {
  connectionState: WritableAtom<ConnectionState, [ConnectionState], void>
  lastConnectionError: WritableAtom<Error | undefined, [Error | undefined], void>
  requestState: WritableAtom<RequestState, [RequestState], void>
  lastRequestError: WritableAtom<Error | undefined, [Error | undefined], void>
}

export class CogniteSDK {
  state: CogniteClientState

  private cogniteClient_: CogniteClient | undefined

  private get cogniteClient(): CogniteClient {
    if (!this.cogniteClient_) {
      throw new Error('CogniteClient not initialized')
    }
    return this.cogniteClient_
  }

  constructor() {
    this.state = {
      connectionState: atom<ConnectionState>('disconnected'),
      lastConnectionError: atom<Error | undefined>(undefined),
      requestState: atom<RequestState>('idle'),
      lastRequestError: atom<Error | undefined>(undefined),
    }
  }

  async connect({
    appId,
    project,
    oidcToken,
    baseUrl,
  }: {
    appId: string
    project: string
    oidcToken: string
    baseUrl?: string
  }) {
    store.set(this.state.connectionState, 'connecting')

    this.cogniteClient_ = new CogniteClient({
      appId,
      baseUrl,
      project,
      getToken: () => Promise.resolve(oidcToken),
    })

    try {
      await this.cogniteClient.authenticate()

      const containersList = await this.cogniteClient.containers.list({includeGlobal: true})
      if (containersList.items !== undefined) {
        store.set(this.state.connectionState, 'connected')
      } else {
        throw new Error('No containers found')
      }
    } catch (error) {
      store.set(this.state.connectionState, 'disconnected')
      store.set(this.state.lastConnectionError, error as Error)
    }
  }

  disconnect() {
    // TODO
  }
}

export const cogniteSDK = new CogniteSDK()
window.cogniteSDK = cogniteSDK