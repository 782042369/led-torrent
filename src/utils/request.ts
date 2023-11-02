/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 16:11:59
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 23:51:00
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
    if (
      response.status === 500 ||
      response.status === 404 ||
      response.status === 403
    ) {
      return Promise.reject(response);
    }
    if (url.includes('getusertorrentlistajax')) {
      return (await response.text()) as T;
    }
    return await response.json();
  } catch (error: any) {
    console.error('Fetch error: ', error);
    return error;
  }
}
export default request;
