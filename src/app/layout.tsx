import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
export const metadata: Metadata = {
  title: "Vòng Tròn Xanh | Học vui kinh tế tuần hoàn",
  description:
    "Trò chơi giáo dục kinh tế tuần hoàn dành cho học sinh tiểu học.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <div className="site-shell">
          <nav className="top-nav">
            <Link className="brand" href="/">
              <span className="brand-icon">🐢</span>
              <span>
                Vòng Tròn <b>Xanh</b>
              </span>
            </Link>
            <div className="nav-links">
              <Link href="/learn">Khám phá</Link>
              <Link href="/games">Trò chơi</Link>
              <Link className="teacher-link" href="/teacher">
                👩‍🏫 Giáo viên
              </Link>
            </div>
          </nav>
          {children}
          <footer className="site-footer">
            <span>🌱 Học một chút, xanh thêm nhiều!</span>
            <span>Vòng Tròn Xanh · Lớp 3–5</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
