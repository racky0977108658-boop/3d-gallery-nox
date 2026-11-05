# NOX 標準展廳 Demo

純前端 3D 展廳雛形（Three.js r149，本地 vendor，無建置、無 CDN）。

## 開啟
- 直接雙擊 `index.html`（file:// 可用，因用 classic script 非 ES module）
- 或 `npx serve .` 後開 http://localhost:3000
- 靜態託管：整個資料夾丟到 Netlify Drop / GitHub Pages / Vercel 即可

## 操作
單指左右滑動旋轉、上下微調仰角；雙指（或滑鼠滾輪）縮放；點作品→資訊卡＋鏡頭對焦；底部切換 白牆／木／混凝土。
URL 參數（做連結／截圖用）：`index.html#mat=wood&art=2&yaw=-1.57`

## 換作品圖
1. 圖檔放 `images/`，長邊建議 ≤1024px、JPG ≤300KB（手機效能）
2. 編輯 `artworks.js`：每件加 `img:"images/xxx.jpg"`，填 title/artist/medium/year/size；`w`、`h` 為公尺尺寸（決定掛牆比例）
3. 改 `INQUIRY_EMAIL` 為業務信箱（CTA 是 mailto，可改成 IG/LINE 連結：main.js 搜 `cta`）
4. 最多 10 個掛點（前3/右2/後3/左2）；要 12 件改 main.js 的 `put(...)` 數量

## 素材聲明
目前作品圖為程式生成抽象圖，屬示範素材，非真實客戶／藝術家作品。
