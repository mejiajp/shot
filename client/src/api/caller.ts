const BASE_URL = import.meta.env.VITE_API_URL

async function caller<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  })

  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    const errorMessage = contentType?.includes('application/json')
      ? JSON.stringify(await response.json())
      : await response.text()

    throw new Error(`Request failed (${response.status}): ${errorMessage}`)
  }

  if (response.status === 204) {
    return null as T
  }

  if (!contentType?.includes('application/json')) {
    const responseText = await response.text()

    throw new Error(
      `Expected JSON but received ${contentType || 'unknown content type'}: ${responseText.slice(0, 200)}`
    )
  }

  return response.json() as Promise<T>
}

export default caller
