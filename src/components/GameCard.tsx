import Link from "next/link";
export function GameCard({
  href,
  icon,
  title,
  description,
  color,
  tag,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  tag?: string;
}) {
  return (
    <Link href={href} className={`game-card ${color}`}>
      <span className="game-icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        {tag && <span className="game-tag">{tag}</span>}
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="play-link">
          Chơi ngay <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
