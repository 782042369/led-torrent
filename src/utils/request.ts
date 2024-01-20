/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 16:11:59
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-01-20 15:59:21
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
  timeout = 100000
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
    if (url.includes('viewclaims.php')) {
      console.log(response);
      try {
        await response.json();
        return Promise.resolve(true as T);
      } catch (error) {
        console.log('error: ', error);
        return Promise.resolve(false as T);
      }
    }
    // 尝试请求用户领取种子接口时，如果登录失效 500 404 403 或者重定向到 login 时，直接返回错误
    if (
      url.includes('user-seeding-torrent') &&
      (response.status === 500 ||
        response.status === 404 ||
        response.status === 403 ||
        response.url.includes('/login'))
    ) {
      return Promise.reject(response);
    }
    if (
      url.includes('getusertorrentlistajax') ||
      url.includes('claim.php') ||
      url.includes('getusertorrentlist.php')
    ) {
      return (await response.text()) as T;
    }
    return await response.json();
  } catch (error: any) {
    console.error('Fetch error: ', error);
    return error;
  }
}
export default request;
