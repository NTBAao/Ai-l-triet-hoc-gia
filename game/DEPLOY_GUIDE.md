# 🚀 HƯỚNG DẪN DEPLOY GAME "AI LÀ TRIẾT HỌC GIA" ONLINE MIỄN PHÍ

Bạn có thể lựa chọn 1 trong 4 cách dưới đây để đưa game lên mạng cho mọi người cùng chơi:

---

## 🥇 CÁCH 1: DEPLOY LÊN VERCEL (NHANH NHẤT - 1 PHÚT, MIỄN PHÍ VĨNH VIỄN)

1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập (bằng tài khoản GitHub hoặc Google).
2. Tải mã nguồn lên GitHub (hoặc cài đặt Vercel CLI bằng lệnh `npm i -g vercel`).
3. **Nếu dùng giao diện Web**:
   - Chọn **Add New Project** -> Chọn repository GitHub chứa thư mục game.
   - Nhấn **Deploy**.
4. **Nếu dùng Terminal (nhanh nhất)**:
   ```bash
   cd d:\MLN111-assignment\game
   npx vercel
   ```
   *(Làm theo hướng dẫn trên màn hình, sau 30 giây bạn sẽ nhận được một đường link dạng `https://ai-la-triet-hoc-gia.vercel.app` để gửi cho bạn bè).*

---

## 🥈 CÁCH 2: DEPLOY LÊN GITHUB PAGES (MIỄN PHÍ 100%)

1. Tạo một repository mới trên [https://github.com](https://github.com) (ví dụ: `ai-la-triet-hoc-gia`).
2. Tải toàn bộ các file trong thư mục `d:\MLN111-assignment\game\frontend` lên nhánh `main` (hoặc `gh-pages`).
3. Vào repository trên GitHub -> **Settings** -> mục **Pages** (cột trái).
4. Ở phần **Build and deployment** -> Chọn **Branch: main** / **Folder: / (root)** -> Nhấn **Save**.
5. Sau 1 phút, game sẽ hoạt động tại link:  
   👉 `https://<ten-tai-khoan-github>.github.io/ai-la-triet-hoc-gia/`

---

## 🥉 CÁCH 3: DEPLOY FULL-STACK LÊN RENDER.COM (CÓ CẢ BACKEND PYTHON FASTAPI)

Nếu bạn muốn có cả Server Backend Python trực tiếp xử lý dữ liệu:
1. Đăng ký tài khoản miễn phí tại [https://render.com](https://render.com).
2. Chọn **New** -> **Web Service** -> Kết nối với GitHub repo của bạn.
3. Cấu hình các thông số:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `python backend/app.py`
4. Nhấn **Deploy Web Service** -> Nhận đường link công khai dạng `https://ai-la-triet-hoc-gia.onrender.com`.

---

## ⚡ CÁCH 4: CHIA SẺ LINK TẠM THỜI ĐỂ CHƠI NGAY LẬP TỨC (KHÔNG CẦN ĐĂNG KÝ)

Nếu bạn đang chạy backend trên máy tính (`python app.py`) và muốn gửi link ngay cho bạn bè trong lớp chơi thử:
1. Mở một cửa sổ PowerShell mới.
2. Chạy lệnh:
   ```bash
   npx localtunnel --port 8000
   ```
   *(Hoặc dùng `ngrok http 8000`)*
3. Bạn sẽ nhận được ngay 1 đường link công khai (ví dụ: `https://philosophy-game-xyz.loca.lt`) để gửi vào nhóm Zalo/Facebook cho mọi người cùng bấm vào chơi trực tiếp!
