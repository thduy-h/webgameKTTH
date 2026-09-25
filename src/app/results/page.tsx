import Link from "next/link";
import { Mascot } from "@/components/Mascot";
export default function ResultsPage() {
  return (
    <main className="page-wrap results-page">
      <div className="results-card">
        <Mascot size={96} />
        <span className="eyebrow">BẢNG VINH DANH</span>
        <h1>
          Tiết học xanh
          <br />
          <span>thật tuyệt!</span>
        </h1>
        <p>Hôm nay bạn đã học cách giữ đồ vật có ích lâu hơn.</p>
        <div className="result-score">
          120 <small>điểm xanh</small>
        </div>
        <div className="results-badges">
          <span>🌱 Người bạn xanh</span>
          <span>🛠️ Biết sửa đồ</span>
          <span>🤝 Biết chia sẻ</span>
        </div>
        <Link href="/games" className="button button-primary button-large">
          Chơi tiếp →
        </Link>
      </div>
    </main>
  );
}
