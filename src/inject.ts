/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 14:46:20
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 16:19:00
 * @Description:
 */
/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:48:49
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 15:56:10
 * @Description:
 */
import { getLedTorrent, getNPHPUserTorrent } from '@/api';
import { cssContent, includeCss } from './utils';

/** 按钮动画效果 */
function animateButton(e: MouseEvent) {
  e.preventDefault;
  if (e.target && e.target instanceof Element) {
    const target = e.target;
    target.classList.remove('animate');
    target.classList.add('animate');
    setTimeout(() => {
      target.classList.remove('animate');
    }, 700);
  }
}

/** 获取当前用户种子数据 */
async function getUserTorrent(page: number) {
  try {
    return await getNPHPUserTorrent({ page });
  } catch (error) {
    console.error('getUserTorrent error: ', error);
    throw new Error('查询用户领种信息异常');
  }
}

/** 认领种子 */
async function handleLedTorrent(arr: PTAPI.TorrentList['data']) {
  if (arr && arr.length) {
    for (let i = 0; i < arr.length; i++) {
      await getLedTorrent(arr[i].id);
    }
  } else {
    throw new Error('查询用户领种信息异常');
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  let loading = false;
  const button = document.createElement('button');
  includeCss(cssContent);
  button.className = 'bubbly-button';
  button.addEventListener('click', async (e) => {
    if (loading) return;
    loading = true;

    try {
      animateButton(e);
      let num = 1;
      const list = await getUserTorrent(num);
      const allData = list.data || [];

      while (list?.meta && list.meta.total > allData.length) {
        num++;
        const moreList = await getUserTorrent(num);
        if (moreList?.data) {
          allData.push(...moreList.data);
        }
      }

      await handleLedTorrent(allData);
      button.innerText = '一键认领完毕，刷新查看。';
    } catch (error: any) {
      console.error('Error: ', error);
      button.innerText = error.message;
    } finally {
      loading = false;
    }
  });
  button.innerText = '一键认领';
  if (location.href.includes('https://zmpt.cc/userdetails.php')) {
    document.body.appendChild(button);
  }
});
