import { CogniteClient, CogniteError, HttpError } from "@cognite/sdk"
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

export type ConnectionState = 'disconnected' | 'connecting' | 'connected'
export type RequestState = 'idle' | 'inProgress' | 'success'

export type CogniteSDKError = CogniteError | HttpError | TypeError

type CogniteClientState = {
  connectionState: WritableAtom<ConnectionState, [ConnectionState], void>
  connectionError: WritableAtom<CogniteSDKError | undefined, [CogniteSDKError | undefined], void>
  requestState: WritableAtom<RequestState, [RequestState], void>
  requestError: WritableAtom<CogniteSDKError | undefined, [CogniteSDKError | undefined], void>
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
      connectionError: atom<CogniteSDKError | undefined>(undefined),
      requestState: atom<RequestState>('idle'),
      requestError: atom<CogniteSDKError | undefined>(undefined),
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
      store.set(this.state.connectionError, undefined)

      await this.cogniteClient.authenticate()
      // authenticate doesn't throw an error, so we need to check the error type
      await this.cogniteClient.containers.list({ includeGlobal: true })

      store.set(this.state.connectionState, 'connected')
    } catch (error) {
      store.set(this.state.connectionState, 'disconnected')
      store.set(this.state.connectionError, error as CogniteSDKError)
    }
  }

  disconnect() {
    this.cogniteClient_ = undefined
    store.set(this.state.connectionState, 'disconnected')
    store.set(this.state.connectionError, undefined)
    store.set(this.state.requestState, 'idle')
    store.set(this.state.requestError, undefined)
  }
}

export const cogniteSDK = new CogniteSDK()
window.cogniteSDK = cogniteSDK