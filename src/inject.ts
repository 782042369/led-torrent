/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:48:49
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 15:13:06
 * @Description:
 */
import { getLedTorrent, getNPHPUserTorrent } from '@/api';

const cssContent = `.bubbly-button {
    font-family: "Helvetica", "Arial", sans-serif;
    display: inline-block;
    font-size: 20px;
    padding: 8px 10px;
    appearance: none;
    background-color: #ff0081;
    color: #fff;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    position: relative;
    transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
    box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5);
    position: fixed;
    top: 80px;
    left: 20px;
    zIndex: 9999;
  }
  .bubbly-button:focus {
    outline: 0;
  }
  .bubbly-button:before, .bubbly-button:after {
    position: absolute;
    content: "";
    display: block;
    width: 140%;
    height: 100%;
    left: -20%;
    z-index: -1000;
    transition: all ease-in-out 0.5s;
    background-repeat: no-repeat;
  }
  .bubbly-button:before {
    display: none;
    top: -75%;
    background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 20%, #ff0081 20%, transparent 30%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
    background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
  }
  .bubbly-button:after {
    display: none;
    bottom: -75%;
    background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
    background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
  }
  .bubbly-button:active {
    transform: scale(0.9);
    background-color: #e60074;
    box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
  }
  .bubbly-button.animate:before {
    display: block;
    animation: topBubbles ease-in-out 0.75s forwards;
  }
  .bubbly-button.animate:after {
    display: block;
    animation: bottomBubbles ease-in-out 0.75s forwards;
  }

  @keyframes topBubbles {
    0% {
      background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
    }
    50% {
      background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
    }
    100% {
      background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
      background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    }
  }
  @keyframes bottomBubbles {
    0% {
      background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
    }
    50% {
      background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
    }
    100% {
      background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
      background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    }
  }`;
document.addEventListener('DOMContentLoaded', () => {
  let loading = false;
  const button = document.createElement('button');
  function includeCss() {
    // 创建一个新的 <style> 元素
    const styleEl = document.createElement('style');
    styleEl.textContent = cssContent;
    // 将 <style> 元素插入到文档的头部
    document.head.appendChild(styleEl);
  }

  includeCss();
  button.className = 'bubbly-button';
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
      loading = false;
    }
    console.error('查询用户领种信息异常');
    loading = false;
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
      if (loading) {
        return;
      }
      loading = true;
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
      loading = false;
    }
  };
  var animateButton = function (e: any) {
    e.preventDefault;
    //reset animation
    e.target.classList.remove('animate');

    e.target.classList.add('animate');
    setTimeout(function () {
      e.target.classList.remove('animate');
    }, 700);
  };

  button.addEventListener(
    'click',
    function (e) {
      getUserTorrents();
      animateButton(e);
    },
    false
  );
  button.innerText = '一键认领';
  if (location.href.includes('https://zmpt.cc/userdetails.php')) {
    document.body.appendChild(button);
  }
});
