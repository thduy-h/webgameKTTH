import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { FullscreenButton } from "@/components/FullscreenButton";
export function GameHeader({
  title,
  subtitle,
  back = "/games",
}: {
  title: string;
  subtitle: string;
  back?: string;
}) {
  return (
    <header className="game-header">
      <div className="game-header-actions">
        <Link href={back} className="back-link">
          ← Quay lại
        </Link>
        <FullscreenButton />
      </div>
      <div className="game-heading">
        <Mascot size={50} />
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
    </header>
  );
}
