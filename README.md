<div align="center">

# 🐢 Vòng Tròn Xanh

**Website giáo dục tương tác giúp học sinh lớp 3–5 khám phá kinh tế tuần hoàn qua trò chơi.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/MVP-Demo_ready-24845C)](#trạng-thái-dự-án)

</div>

## Giới thiệu

**Vòng Tròn Xanh** biến các khái niệm Reduce, Reuse, Repair, Share và Recycle thành những thử thách trực quan, ngắn gọn và phù hợp với lớp học tiểu học. Sản phẩm được thiết kế để giáo viên có thể sử dụng trực tiếp bằng laptop, máy chiếu hoặc bảng tương tác.

MVP hoạt động hoàn toàn trên trình duyệt, không yêu cầu tài khoản, backend hay API key.

## Tính năng chính

### Bốn trò chơi tương tác

| Trò chơi | Nội dung | Cách chơi |
| --- | --- | --- |
| **Ghép thẻ thần tốc** | 12 khái niệm kinh tế tuần hoàn | Kéo định nghĩa vào đúng khái niệm |
| **Đường đua tuần hoàn** | Board game 30 ô cho 2–4 đội | Tung xúc xắc, trả lời câu hỏi và xử lý các ô đặc biệt |
| **Siêu nhân phân loại** | 17 vật phẩm quen thuộc | Kéo vật phẩm vào nhóm phù hợp, tạo combo và đạt ECO MASTER |
| **Thám tử đồ vật** | 18 tình huống đời sống | Chọn cách dùng ít hơn, dùng lại, sửa chữa, chia sẻ hoặc tái chế |

### Teacher Mode

- Thiết lập 2–4 đội, tên đội và mascot.
- Chọn trò chơi, độ khó và số câu.
- Điều khiển điểm nhanh trong lúc đứng lớp.
- Tạm dừng, tiếp tục, reset và kết thúc phiên học.
- Chế độ toàn màn hình dành cho máy chiếu.
- Flow rõ ràng: **Setup → Live Session → Summary**.

### Trải nghiệm lớp học

- Giao diện responsive cho 1920×1080, 1366×768 và tablet.
- Drag and drop hỗ trợ chuột, cảm ứng và bàn phím.
- Feedback đúng/sai không phụ thuộc riêng vào màu sắc.
- Âm thanh tổng hợp bằng Web Audio API, có thể bật/tắt toàn cục.
- Hỗ trợ `prefers-reduced-motion`.
- Phiên Board và thiết lập Teacher Mode được khôi phục sau khi refresh.

## Công nghệ

- [Next.js 16](https://nextjs.org/) với App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) strict mode
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion](https://motion.dev/) cho animation có mục đích
- [dnd-kit](https://dndkit.com/) cho drag and drop accessible
- Local TypeScript data và `localStorage` cho MVP
- Web Audio API cho hiệu ứng âm thanh ngắn

## Bắt đầu

### Yêu cầu

- Node.js 20 trở lên
- npm

### Cài đặt

```bash
git clone https://github.com/thduy-h/webgameKTTH.git
cd webgameKTTH
npm install
```

### Chạy môi trường phát triển

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Chạy production local

```bash
npm run build
npm run start
```

## Kiểm tra chất lượng

```bash
npm run lint
npx tsc --noEmit
npm run build
```

MVP hiện pass cả ESLint, TypeScript và production build. Các flow hoàn thành, reset, modal, điểm số, persistence và Teacher Mode đã được kiểm tra trực tiếp trên production server.

## Các route

| Route | Chức năng |
| --- | --- |
| `/` | Trang chủ và hành trình học tập |
| `/learn` | Kiến thức trực quan về kinh tế tuyến tính và tuần hoàn |
| `/games` | Danh sách trò chơi |
| `/games/matching` | Ghép thẻ thần tốc |
| `/games/board` | Đường đua tuần hoàn |
| `/games/sorting` | Siêu nhân phân loại |
| `/games/detective` | Thám tử đồ vật |
| `/teacher` | Teacher Mode |
| `/results` | Kết quả demo |

## Cấu trúc dự án

```text
src/
├── app/                 # Route và màn hình chính
├── components/          # Component dùng chung và component trò chơi
├── data/                # Câu hỏi, thẻ ghép, vật phẩm và tình huống
├── lib/game/            # Game engine, persistence và sound manager
└── types/               # Kiểu dữ liệu dùng chung
```

Dữ liệu nội dung được tách khỏi UI để có thể chỉnh sửa hoặc chuyển sang nguồn dữ liệu khác trong giai đoạn sau mà không thay đổi gameplay component.

## Trạng thái dự án

MVP hiện ở trạng thái **demo ready**:

- Không cần backend hoặc tài khoản.
- Bốn trò chơi có thể chơi và hoàn thành đầy đủ.
- Teacher Mode hoạt động xuyên suốt một phiên học.
- Board session và thiết lập lớp học được lưu cục bộ.
- Không có lỗi chặn demo đã biết.

## Phạm vi MVP

Dự án hiện tập trung vào trải nghiệm một lớp học trên một thiết bị. Multiplayer qua mạng, phòng chơi, authentication, CMS và analytics chưa thuộc phạm vi phiên bản này.

