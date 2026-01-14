/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 14:46:20
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:55:00
 * @Description: LED Torrent 主入口文件 - 简化为仅负责启动应用
 */

import { initApp } from '@/router'
import '@/styles/led-torrent.scss'

/**
 * 应用启动
 * 根据当前 URL 自动匹配站点并初始化对应的功能
 */
initApp()
