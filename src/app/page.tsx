import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { Mascot } from "@/components/Mascot";
const concepts = [
  ["↓", "Dùng ít hơn", "Reduce", "concept-blue"],
  ["↻", "Dùng lại", "Reuse", "concept-green"],
  ["🔧", "Sửa chữa", "Repair", "concept-orange"],
  ["🤝", "Chia sẻ", "Share", "concept-yellow"],
  ["♻", "Tái chế", "Recycle", "concept-purple"],
];
const journey = [
  ["01", "Khám phá", "Hiểu đồ vật đi đâu"],
  ["02", "Thử thách", "Chọn cách sống xanh"],
  ["03", "Chơi cùng lớp", "Cùng đội vượt đường đua"],
  ["04", "Nhận huy hiệu", "Ghi nhớ điều đã học"],
];
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-pill">
            <span>✦</span> HỌC VUI · SỐNG XANH
          </span>
          <h1>
            Vòng Tròn
            <br />
            <span>Xanh</span>
          </h1>
          <p>Học kinh tế tuần hoàn qua những thử thách vui nhộn</p>
          <div className="hero-actions">
            <Link href="/games" className="button button-primary button-large">
              Bắt đầu hành trình <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/learn"
              className="button button-secondary button-large"
            >
              Khám phá kiến thức
            </Link>
          </div>
          <div className="hero-note">
            4 thử thách · Chơi cá nhân hoặc cùng lớp
          </div>
        </div>
        <div className="hero-art">
          <div className="sun-orbit orbit-one" />
          <div className="sun-orbit orbit-two" />
          <div className="hero-blob">
            <Mascot size={164} />
          </div>
          <span className="float-leaf leaf-a">🍃</span>
          <span className="float-leaf leaf-b">🌼</span>
          <span className="float-leaf leaf-c">♻️</span>
          <span className="hero-caption">
            Chào bạn! Mình là <strong>Tí Xanh</strong>. Cùng đi nhé!
          </span>
        </div>
      </section>
      <section className="journey-strip" aria-label="Hành trình học tập">
        {journey.map(([number, title, detail]) => (
          <article className="journey-step" key={number}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
          </article>
        ))}
      </section>
      <section className="section concept-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">5 BƯỚC SỐNG XANH</span>
            <h2>
              Mỗi lựa chọn nhỏ,
              <br />
              <span>Trái Đất vui hơn</span>
            </h2>
          </div>
          <Link href="/learn" className="text-link">
            Tìm hiểu thêm →
          </Link>
        </div>
        <div className="concept-grid">
          {concepts.map(([icon, vi, en, color], i) => (
            <article className={`concept-card ${color}`} key={en}>
              <span className="concept-number">0{i + 1}</span>
              <span className="concept-icon">{icon}</span>
              <strong>{vi}</strong>
              <small>{en}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="section home-games">
        <div className="section-title">
          <div>
            <span className="eyebrow">CHỌN CUỘC PHIÊU LƯU</span>
            <h2>Chơi là nhớ!</h2>
          </div>
          <Link href="/games" className="text-link">
            Tất cả trò chơi →
          </Link>
        </div>
        <div className="game-grid">
          <GameCard
            href="/games/board"
            icon="🎲"
            title="Đường đua tuần hoàn"
            description="Lăn xúc xắc, cùng đội về đích!"
            color="card-lime"
            tag="NỔI BẬT"
          />
          <GameCard
            href="/games/matching"
            icon="🃏"
            title="Ghép thẻ thần tốc"
            description="Ghép khái niệm với định nghĩa."
            color="card-blue"
          />
          <GameCard
            href="/games/sorting"
            icon="🦸"
            title="Siêu nhân phân loại"
            description="Đưa vật phẩm về đúng nhóm."
            color="card-orange"
          />
          <GameCard
            href="/games/detective"
            icon="🔎"
            title="Thám tử đồ vật"
            description="Tìm cách tốt nhất cho mỗi món đồ."
            color="card-purple"
          />
        </div>
      </section>
      <section className="home-cta">
        <div>
          <span className="eyebrow">SẴN SÀNG CHƯA?</span>
          <h2>Tí Xanh đang chờ bạn!</h2>
          <p>Chọn một thử thách và bắt đầu giữ đồ vật có ích lâu hơn.</p>
        </div>
        <Link href="/games/board" className="button button-light">
          Vào đường đua <span>→</span>
        </Link>
      </section>
    </main>
  );
}
