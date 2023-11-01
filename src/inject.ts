/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:48:49
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 14:25:02
 * @Description:
 */
import { getLedTorrent, getNPHPUserTorrent } from '@/api';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.createElement('button');
  // Applying Styles
  button.style.borderRadius = '8px';
  button.style.border = '1px solid #555'; // Lighter border to start with
  button.style.padding = '0.6em 1.2em';
  button.style.fontSize = '30px';
  button.style.fontWeight = '500';
  button.style.fontFamily = 'inherit';
  button.style.backgroundColor = '#1a1a1a';
  button.style.color = '#FFF'; // Added white color for the text for better contrast
  button.style.cursor = 'pointer';
  button.style.position = 'fixed';
  button.style.top = '20px';
  button.style.left = '20px';
  button.style.zIndex = '9999';
  button.style.transition =
    'background-color 0.25s, color 0.25s, border-color 0.25s'; // Extended transition

  // Adding hover effect
  button.addEventListener('mouseover', function () {
    this.style.backgroundColor = '#333';
    this.style.color = '#FFF';
    this.style.borderColor = '#888';
  });

  button.addEventListener('mouseout', function () {
    this.style.backgroundColor = '#1a1a1a';
    this.style.color = '#FFF';
    this.style.borderColor = '#555';
  });

  const handleLedTorrent = async (
    arr: {
      id: number;
    }[]
  ) => {
    if (arr?.length) {
      button.innerText = `一键认领进度：${arr.length} / 0`;
      for (let i = 0; i < arr.length; i++) {
        await getLedTorrent(arr[i].id);
        button.innerText = `一键认领进度：${arr.length} / ${i + 0}`;
      }
      button.innerText = '一键认领完毕，刷新查看。';
    }
    console.error('查询用户领种信息异常');
  };

  /** 获取当前用户种子数据 */
  const getUserTorrent = async (page: number) => {
    try {
      // /api/user-seeding-torrent
      button.innerText = '正在前台运行中不要退出！！！';
      const data = await getNPHPUserTorrent({
        page
      });
      const list = (await data.json()) as {
        data?: {
          id: number;
        }[];
        meta?: {
          to: number;
          total: number;
        };
      };
      return list;
    } catch (error) {
      console.error('error: ', error);
      button.innerText = '查询用户领种信息异常';
    }
  };
  const getUserTorrents = async () => {
    try {
      // /api/user-seeding-torrent
      button.innerText = '正在前台运行中不要退出！！！';
      let num = 1;
      const list = await getUserTorrent(num);
      if (list && list.data) {
        const allData = list.data;
        while (list?.meta && list.meta.total > allData.length) {
          num++;
          const moreList = await getUserTorrent(num);
          if (moreList?.data) {
            allData.push(...moreList.data);
          }
        }
        handleLedTorrent(allData);
      }
    } catch (error) {
      console.error('error: ', error);
      button.innerText = '查询用户领种信息异常';
    }
  };
  button.addEventListener('click', function () {
    getUserTorrents();
  });
  button.innerText = '一键认领';
  document.body.appendChild(button);
});
