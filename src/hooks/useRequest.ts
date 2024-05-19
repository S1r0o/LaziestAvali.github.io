interface IRequestParams {
  endpoint: string
  host?: string
  method?: 'POST' | 'GET'
  data?: unknown
}

const HOST_NAME = 'https://32b6-95-25-218-105.ngrok-free.app'

export async function useRequest(params: IRequestParams): Promise<unknown> {
  try {
    const request = await fetch(`${params.host || HOST_NAME}${params.endpoint}`, {
      method: params.method || ' GET',
      body: typeof params.data === 'string' ? params.data : JSON.stringify(params.data),
      headers: {
        'content-type': 'application/json'
      }
    })
    const response = await request.json()
    return response
  } catch (err) {
    alert((err as Error).message)
  }
}
