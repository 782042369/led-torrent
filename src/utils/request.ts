/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 16:11:59
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 19:06:45
 * @Description:
 */
type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
};

async function fetchWithTimeout(
  input: RequestInfo,
  init?: RequestInit,
  timeout = 5000
): Promise<Response> {
  return Promise.race([
    fetch(input, init),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request Timeout')), timeout)
    )
  ]);
}

async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, timeout } = options;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method,
        headers,
        body: body
      },
      timeout
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Assuming server always returns JSON. If not, you might want to handle this differently.
    if (url.includes('getusertorrentlistajax')) {
      return (await response.text()) as T;
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error: ', error);
    throw error;
  }
}
export default request;
