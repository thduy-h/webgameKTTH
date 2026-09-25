export function Mascot({ size = 58 }: { size?: number }) {
  return (
    <span
      className="mascot"
      style={{ width: size, height: size, fontSize: size * 0.64 }}
      role="img"
      aria-label="Tí Xanh, rùa hướng dẫn"
      title="Tí Xanh"
    >
      🐢
    </span>
  );
}
