// ==UserScript==
// @name         一键领种
// @namespace    方便用户一键领种
// @version      0.7
// @author       waibuzheng
// @description  努力支持多个站点一键领种
// @icon         https://image.zmpt.cc/imgs/2023/11/5c60a64ce9d1104a.png
// @match        http*://*/userdetails.php?id=*
// @grant        GM_addStyle
// ==/UserScript==

(a=>{if(typeof GM_addStyle=="function"){GM_addStyle(a);return}const e=document.createElement("style");e.textContent=a,document.head.append(e)})(' .led-box{position:fixed;top:80px;left:20px;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center}.led-box li{color:#fff;background-color:#ff0081;padding:5px;list-style:none;line-height:20px;font-size:14px}.bubbly-button{font-family:Helvetica,Arial,sans-serif;display:inline-block;font-size:20px;padding:8px 10px;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#ff0081;color:#fff;border-radius:4px;border:none;cursor:pointer;position:relative;transition:transform ease-in .1s,box-shadow ease-in .25s;box-shadow:0 2px 25px #ff008280}.bubbly-button:focus{outline:0}.bubbly-button:before,.bubbly-button:after{position:absolute;content:"";display:block;width:140%;height:100%;left:-20%;z-index:-1000;transition:all ease-in-out .5s;background-repeat:no-repeat}.bubbly-button:before{display:none;top:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 20%,#ff0081 20%,transparent 30%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:10% 10%,20% 20%,15% 15%,20% 20%,18% 18%,10% 10%,15% 15%,10% 10%,18% 18%}.bubbly-button:after{display:none;bottom:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:15% 15%,20% 20%,18% 18%,20% 20%,15% 15%,10% 10%,20% 20%}.bubbly-button:active{transform:scale(.9);background-color:#e60074;box-shadow:0 2px 25px #ff008233}.bubbly-button.animate:before{display:block;animation:topBubbles ease-in-out .75s forwards}.bubbly-button.animate:after{display:block;animation:bottomBubbles ease-in-out .75s forwards}@keyframes topBubbles{0%{background-position:5% 90%,10% 90%,10% 90%,15% 90%,25% 90%,25% 90%,40% 90%,55% 90%,70% 90%}50%{background-position:0% 80%,0% 20%,10% 40%,20% 0%,30% 30%,22% 50%,50% 50%,65% 20%,90% 30%}to{background-position:0% 70%,0% 10%,10% 30%,20% -10%,30% 20%,22% 40%,50% 40%,65% 10%,90% 20%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%}}@keyframes bottomBubbles{0%{background-position:10% -10%,30% 10%,55% -10%,70% -10%,85% -10%,70% -10%,70% 0%}50%{background-position:0% 80%,20% 80%,45% 60%,60% 100%,75% 70%,95% 60%,105% 0%}to{background-position:0% 90%,20% 90%,45% 70%,60% 110%,75% 80%,95% 70%,110% 10%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%}} ');

(function () {
  'use strict';

  async function fetchWithTimeout(input, init, timeout = 1e5) {
    return Promise.race([
      fetch(input, init),
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Request Timeout")), timeout)
      )
    ]);
  }
  async function request(url, options = {}) {
    const { method = "GET", headers = {}, body, timeout } = options;
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method,
          headers,
          body
        },
        timeout
      );
      if (url.includes("user-seeding-torrent") && (response.status === 500 || response.status === 404 || response.status === 403 || response.url.includes("/login"))) {
        console.log(111);
        return Promise.reject(response);
      }
      if (url.includes("getusertorrentlistajax")) {
        return await response.text();
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error: ", error);
      return error;
    }
  }
  const getNPHPLedTorrent = (id) => {
    const body = new FormData();
    body.append("action", "addClaim");
    body.append("params[torrent_id]", id + "");
    return request(`/ajax.php`, {
      method: "POST",
      body
    });
  };
  const getNPHPUsertorrentlistajax = async (params) => {
    return request(
      `getusertorrentlistajax.php?page=${params.page}&userid=${params.userid}&type=seeding`,
      {
        method: "GET"
      }
    );
  };
  function getvl(name) {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(location.href))
      return unescape(RegExp.$2.replace(/\+/g, " "));
    return "";
  }
  function animateButton(e) {
    e.preventDefault;
    if (e.target && e.target instanceof Element) {
      const target = e.target;
      target.classList.remove("animate");
      target.classList.add("animate");
      setTimeout(() => {
        target.classList.remove("animate");
      }, 700);
    }
  }
  async function handleLedTorrent(arr, button2, json) {
    for (let i = 0; i < arr.length; i++) {
      button2.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
      try {
        let data = await getNPHPLedTorrent(arr[i].id);
        const msg = data.msg || "领种接口返回信息错误";
        json[msg] = (json[msg] || 0) + 1;
      } catch (error) {
        console.error("handleLedTorrent error: ", error);
      }
    }
  }
  function getLedMsg(msglist) {
    let msgLi = "";
    Object.keys(msglist).forEach((e) => {
      msgLi += `<li>${e}: ${msglist[e]}</li>`;
    });
    return msgLi;
  }
  async function loadUserTorrents(userid, allData, msglist) {
    let page = 0;
    let hasMore = true;
    do {
      const details = await getNPHPUsertorrentlistajax({
        page,
        userid
      });
      const parser = new DOMParser();
      const doc = parser.parseFromString(details, "text/html");
      const tdList = doc.querySelectorAll("td");
      tdList.forEach((v) => {
        const buttons = v.querySelectorAll("button");
        if (buttons.length > 0) {
          const {
            innerText: innerText0,
            style: { display: display0 }
          } = buttons[0];
          const torrent_id = buttons[0].getAttribute("data-torrent_id");
          const {
            innerText: innerText1,
            style: { display: display1 }
          } = buttons[1];
          if (innerText0.includes("领") && display1 === "none" && torrent_id) {
            allData.push({ id: torrent_id });
          }
          if (display0 === "none" && innerText1.includes("弃")) {
            msglist["已经认领过"] = (msglist["已经认领过"] || 0) + 1;
          }
        }
      });
      page++;
      const nextPageLinkSelector = `a[href*="getusertorrentlistajax.php?page=${page}"]`;
      hasMore = Boolean(doc.querySelector(nextPageLinkSelector));
    } while (hasMore);
  }
  async function loadTorrents(msglist) {
    const allData = [];
    const userid = getvl("id");
    await loadUserTorrents(userid, allData, msglist);
    return allData;
  }
  let loading = false;
  const button = document.createElement("button");
  const ulbox = document.createElement("ul");
  button.className = "bubbly-button";
  const div = document.createElement("div");
  div.className = "led-box";
  async function onButtonClicked(e) {
    if (loading) {
      e.preventDefault();
      return;
    }
    loading = true;
    button.disabled = true;
    button.innerText = "开始工作，为了网站和你自己的电脑速度调的很慢~~~";
    try {
      const msglist = {};
      animateButton(e);
      const allData = await loadTorrents(msglist);
      if (!allData.length) {
        button.innerText = "该站点可能不支持领种子。";
      }
      ulbox.innerHTML = getLedMsg(msglist);
      await handleLedTorrent(allData, button, msglist);
      button.innerText = "一键认领完毕，刷新查看。";
      ulbox.innerHTML = getLedMsg(msglist);
    } catch (error) {
      console.error("Error: ", error);
      button.innerText = error.message;
    } finally {
      loading = false;
      button.disabled = false;
    }
  }
  button.addEventListener("click", onButtonClicked);
  button.innerText = "一键认领";
  div.appendChild(button);
  div.appendChild(ulbox);
  document.body.appendChild(div);

})();