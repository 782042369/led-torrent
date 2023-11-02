/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 15:56:38
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 20:29:00
 * @Description:
 */
export const cssContent = `
    .led-box{
        position: fixed;
        top: 80px;
        left: 20px;
        z-index: 9999;
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .led-box li{
        color:#fff;
        background-color: #ff0081;
        padding:5px;
        list-style:none;
        line-height:20px;
        font-size:14px;
    }
    .bubbly-button {
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
/** 插入样式内容到页面头部 */
export function includeCss(content: string) {
  const styleEl = document.createElement('style');
  styleEl.textContent = content;
  document.head.appendChild(styleEl);
}
export function getvl(name: string) {
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
  if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, ' '));
  return '';
}
