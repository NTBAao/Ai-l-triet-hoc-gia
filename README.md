# 🏛️ AI LÀ TRIẾT HỌC GIA (Gameshow Triết Học Mác - Lênin)

Minigame trắc nghiệm tương tác cao lấy cảm hứng từ gameshow truyền hình kinh điển **"Ai Là Triệu Phú"**, được xây dựng dựa trên **Giáo trình Triết học Mác - Lênin (Mã học phần MLN111, Trang 247 đến 274 - Mục V: Triết học về con người)**.

---

## 🌟 TỔNG QUAN TÍNH NĂNG NỔI BẬT

1. **30 Bậc Thang Triết Học & Mốc An Toàn**:
   - Trải nghiệm 30 câu hỏi ngẫu nhiên với độ khó tăng dần từ *Tập sự Triết học* đến *Đại Triết gia Mác-xít Nhân loại* (1.000.000.000 VNĐ).
   - Mốc bảo toàn điểm quan trọng tại: **Câu 5, Câu 10, Câu 15, Câu 20, Câu 25 và Đỉnh cao Câu 30**.
2. **4 Quyền Trợ Giúp Kinh Điển**:
   - ⚡ **50:50**: Loại bỏ 2 phương án sai ngẫu nhiên.
   - 👥 **Hỏi ý kiến Hội đồng Triết gia (Audience Poll)**: Biểu đồ cột biểu quyết trực quan từ các chuyên gia trong trường quay.
   - 📞 **Gọi điện thoại cho Nhà thông thái (Phone a Philosopher)**: Nhận lời tư vấn triết lý sâu sắc từ *Karl Marx*, *Friedrich Engels*, *V.I. Lênin*, hoặc *Chủ tịch Hồ Chí Minh*.
   - 🔄 **Đổi câu hỏi (Switch Question)**: Đổi sang câu hỏi khác cùng độ khó.
   - 🚪 **Dừng cuộc chơi**: Quyết định dừng lại để bảo toàn trọn vẹn số điểm/danh hiệu hiện tại.
3. **Ngân Hàng 150 Câu Hỏi Trắc Nghiệm Chuyên Sâu**:
   - Bám sát từng trang sách 247-274: Bản chất con người, Thực thể sinh học - xã hội, Tha hóa lao động, Giải phóng con người, Quan hệ cá nhân - xã hội, Quần chúng nhân dân & Lãnh tụ, Tư tưởng Hồ Chí Minh & Nghị quyết Đảng CSVN (NQ TW 5 khóa VIII, NQ TW 9 khóa XI 2014).
4. **Hệ Thống Âm Thanh & Hiệu Ứng Studio Sống Động**:
   - Sử dụng Web Audio API tích hợp sẵn (không cần tải thêm file âm thanh ngoài): Tiếng nhịp tim hồi hộp (Suspense), âm thanh khóa đáp án (Lock-in), âm thanh chuông chiến thắng (Correct fanfare), còi báo sai (Wrong buzzer), vinh danh vô địch (Grand fanfare).
5. **Chế Độ Tra Cứu & Bảng Vàng**:
   - 🔍 **Kho 150 câu**: Cho phép tra cứu, tìm kiếm từ khóa, lọc theo 5 chủ đề và xem đáp án cùng luận giải chi tiết phục vụ ôn thi kết thúc học phần.
   - 🏆 **Bảng vàng Triết gia**: Lưu trữ và vinh danh các người chơi có thành tích cao nhất.

---

## 📂 CẤU TRÚC DỰ ÁN (TÁCH BIỆT BACKEND VÀ FRONTEND)

```
d:\MLN111-assignment\game\
├── backend/
│   ├── app.py              # FastAPI server phục vụ REST API và Static Web
│   ├── questions.json      # Ngân hàng 150 câu hỏi chuẩn xác (tr. 247-274)
│   ├── build_questions.py  # Script biên soạn và thẩm định 150 câu hỏi
│   ├── requirements.txt    # Danh sách thư viện Python (fastapi, uvicorn...)
│   └── run_backend.bat     # File chạy nhanh Backend trên Windows
│
├── frontend/
│   ├── index.html          # Giao diện chính trường quay game show
│   ├── css/
│   │   ├── style.css       # Hệ thống Design đẳng cấp (Studio Dark Navy & Gold)
│   │   └── animations.css  # Hiệu ứng ánh sáng Spotlight và chuyển động
│   └── js/
│       ├── audio.js        # Engine tổng hợp âm thanh Web Audio API
│       ├── api.js          # Kết nối API Backend & Offline Fallback
│       └── game.js         # Logic điều khiển 30 bậc thang và trợ giúp
│
└── README.md
```

---

## 🚀 HƯỚNG DẪN CHẠY GAME

### Cách 1: Khởi động qua Backend Server (Khuyên dùng)
1. Mở thư mục `d:\MLN111-assignment\game\backend\`
2. Nhấp đúp vào file `run_backend.bat` (hoặc mở Terminal gõ `python app.py`)
3. Mở trình duyệt web truy cập: **`http://localhost:8000`**

### Cách 2: Mở trực tiếp Frontend
1. Mở thư mục `d:\MLN111-assignment\game\frontend\`
2. Nhấp đúp vào file `index.html` để chơi ngay trên trình duyệt (hỗ trợ đầy đủ dữ liệu offline fallback).

---

## 📚 CÁC CHỦ ĐỀ CHÍNH TRONG NGÂN HÀNG CÂU HỎI (TRANG 247 - 274)
1. **Con người và bản chất con người (Trang 247 - 253)**: Con người là thực thể sinh học - xã hội; Lao động sản xuất là yếu tố tách con người khỏi con vật; Luận cương về Phoiơbắc ("Bản chất con người là tổng hòa các quan hệ xã hội").
2. **Hiện tượng tha hóa con người và vấn đề giải phóng con người (Trang 253 - 257)**: Thực chất tha hóa lao động trong CNTB; Sự biến đổi quan hệ người - người thành người - vật; Mục tiêu giải phóng con người toàn diện và tự do phát triển.
3. **Quan hệ cá nhân và xã hội, Quần chúng nhân dân và Lãnh tụ (Trang 257 - 265)**: Tính đơn nhất và tính phổ biến của cá nhân; Ba vai trò quyết định của Quần chúng nhân dân; Mối quan hệ biện chứng với Lãnh tụ; Chống tệ sùng bái cá nhân.
4. **Vấn đề con người trong sự nghiệp cách mạng ở Việt Nam (Trang 265 - 274)**: Tư tưởng Hồ Chí Minh ("Vì lợi ích trăm năm trồng người", "Đức là gốc"); Đặt con người vào vị trí trung tâm, vừa là mục tiêu vừa là động lực của thời kỳ Đổi mới.
