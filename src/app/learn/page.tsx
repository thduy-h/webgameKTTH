"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mascot } from "@/components/Mascot";
const linear = ["Tài nguyên", "Sản xuất", "Sử dụng", "Vứt bỏ"];
const circular = [
  "Tài nguyên",
  "Sản phẩm",
  "Sử dụng",
  "Sửa chữa",
  "Dùng lại",
  "Chia sẻ",
  "Tái chế",
];
const greenActions = [
  {
    icon: "↓",
    vi: "Dùng ít hơn",
    en: "Reduce",
    text: "Chỉ lấy thứ mình thật sự cần.",
    example: "Lấy vừa đủ thức ăn.",
  },
  {
    icon: "↻",
    vi: "Dùng lại",
    en: "Reuse",
    text: "Cho đồ vật thêm một lần hữu ích.",
    example: "Vẽ lên mặt giấy còn trắng.",
  },
  {
    icon: "🔧",
    vi: "Sửa chữa",
    en: "Repair",
    text: "Khắc phục phần hỏng nhỏ.",
    example: "Khâu lại cúc áo bị bung.",
  },
  {
    icon: "🤝",
    vi: "Chia sẻ",
    en: "Share",
    text: "Để nhiều người cùng sử dụng.",
    example: "Mượn sách ở thư viện.",
  },
  {
    icon: "♻",
    vi: "Tái chế",
    en: "Recycle",
    text: "Biến vật liệu cũ thành vật liệu mới.",
    example: "Thu gom lon sạch đúng chỗ.",
  },
];
export default function LearnPage() {
  return (
    <main className="page-wrap">
      <div className="page-intro">
        <span className="eyebrow">KHÁM PHÁ KIẾN THỨC</span>
        <h1>
          Một món đồ có thể
          <br />
          <span>đi thật xa!</span>
        </h1>
        <p>Cùng xem đồ vật đi qua những hành trình nào nhé.</p>
      </div>
      <section className="flow-card linear-card">
        <div className="flow-title">
          <span className="flow-icon">➡️</span>
          <div>
            <span className="eyebrow">HÀNH TRÌNH MỘT CHIỀU</span>
            <h2>Kinh tế tuyến tính</h2>
          </div>
          <span className="flow-label">Dùng rồi bỏ</span>
        </div>
        <div className="flow-steps">
          {linear.map((step, i) => (
            <div className="flow-step" key={step}>
              <span className="step-icon">{["🌳", "🏭", "🧒", "🗑️"][i]}</span>
              <strong>{step}</strong>
              {i < linear.length - 1 && <span className="flow-arrow">→</span>}
            </div>
          ))}
        </div>
      </section>
      <section className="flow-card circular-card">
        <div className="flow-title">
          <span className="flow-icon">♻️</span>
          <div>
            <span className="eyebrow">HÀNH TRÌNH TUẦN HOÀN</span>
            <h2>Kinh tế tuần hoàn</h2>
          </div>
          <span className="flow-label">Dùng lâu hơn</span>
        </div>
        <div className="cycle-layout">
          <div className="cycle-steps">
            {circular.map((step, i) => (
              <motion.div
                className="cycle-step"
                key={step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <span>{["🌳", "🧴", "🧒", "🔧", "🔁", "🤝", "♻️"][i]}</span>
                <strong>{step}</strong>
              </motion.div>
            ))}
            <div className="cycle-return">↺ Vật liệu quay lại vòng mới</div>
          </div>
          <div className="cycle-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              ♻️
            </motion.div>
            <Mascot size={75} />
            <strong>
              Đồ vật
              <br />
              tiếp tục có ích!
            </strong>
          </div>
        </div>
      </section>
      <section className="green-actions" aria-labelledby="green-actions-title">
        <div className="green-actions-heading">
          <span className="eyebrow">5 CÁCH GIỮ ĐỒ VẬT CÓ ÍCH</span>
          <h2 id="green-actions-title">Bắt đầu từ việc gần gũi nhất</h2>
        </div>
        <div className="green-action-track">
          {greenActions.map((action, index) => (
            <article className="green-action" key={action.en}>
              <span className="green-action-number">{index + 1}</span>
              <span className="green-action-icon" aria-hidden="true">
                {action.icon}
              </span>
              <div>
                <strong>{action.vi}</strong>
                <small>{action.en}</small>
                <p>{action.text}</p>
                <em>Ví dụ: {action.example}</em>
              </div>
            </article>
          ))}
        </div>
      </section>
      <blockquote className="learn-quote">
        <span>💡</span>
        <p>
          “Đồ vật chưa chắc đã là rác. Hãy nghĩ xem chúng ta có thể dùng chúng
          lâu hơn như thế nào.”
        </p>
        <small>— Tí Xanh</small>
      </blockquote>
      <div className="learn-actions">
        <Link href="/games" className="button button-primary button-large">
          Thử sức với trò chơi →
        </Link>
      </div>
    </main>
  );
}
