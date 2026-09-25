import { GameCard } from "@/components/GameCard";
import { Mascot } from "@/components/Mascot";
export default function GamesPage() {
  return (
    <main className="page-wrap">
      <div className="page-intro compact-intro">
        <span className="eyebrow">KHU VUI CHƠI</span>
        <h1>
          Chọn trò chơi
          <br />
          <span>của bạn!</span>
        </h1>
        <p>Mỗi trò chơi là một nhiệm vụ xanh mới.</p>
        <Mascot size={68} />
      </div>
      <div className="game-grid game-grid-page">
        <GameCard
          href="/games/board"
          icon="🎲"
          title="Đường đua tuần hoàn"
          description="Cùng đồng đội lăn xúc xắc, trả lời câu hỏi và tiến về đích!"
          color="card-lime"
          tag="TRÒ CHƠI LỚN"
        />
        <GameCard
          href="/games/matching"
          icon="🃏"
          title="Ghép thẻ thần tốc"
          description="Kéo các định nghĩa về đúng khái niệm thật nhanh."
          color="card-blue"
        />
        <GameCard
          href="/games/sorting"
          icon="🦸"
          title="Siêu nhân phân loại"
          description="Giúp Rùa Xanh phân loại các vật phẩm nhé."
          color="card-orange"
        />
        <GameCard
          href="/games/detective"
          icon="🔎"
          title="Thám tử đồ vật"
          description="Chọn hành động thông minh nhất cho món đồ."
          color="card-purple"
        />
      </div>
    </main>
  );
}
