# 玄机阁 · 命理天机

一个传统命理文化主题的单页网站：八字排盘、紫微斗数、塔罗占卜、梅花易数、每日灵签。

## 在线访问

本仓库通过 **GitHub Pages** 托管，地址：

**https://jingjingtu.github.io/xuanji-ge/**

## 功能

- **八字排盘** — 输入生辰，推演四柱八字、五行分布、十年大运（基于真天文历法，lunar-javascript）
- **紫微斗数** — 十二宫星盘、星曜亮度、大限流年
- **塔罗占卜** — 圣三角牌阵（过去 / 现在 / 未来）
- **梅花易数** — 铜钱起卦，六爻成卦
- **每日灵签** — 观音灵签摇签

## 技术

纯静态站点，无后端：

- 原生 HTML / CSS / JavaScript
- [GSAP](https://gsap.com/) + ScrollTrigger（滚动动画）
- [Three.js](https://threejs.org/)（背景星空）
- [lunar-javascript](https://github.com/6tail/lunar-javascript)（农历 / 节气推算）
- [canvas-confetti](https://github.com/catdad/canvas-confetti)
- Noto Serif SC / Ma Shan Zheng / ZCOOL XiaoWei（Google Fonts）

## 本地运行

静态站点无需构建，任意静态服务器即可：

```bash
cd xuanji-ge
python3 -m http.server 8080
# 打开 http://localhost:8080
```

## 免责声明

本站内容基于传统命理文化演绎，仅供娱乐与文化体验，不构成任何决策依据。命由己造，福自己求。
