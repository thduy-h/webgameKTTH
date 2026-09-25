export type SortCategory =
  "Hữu cơ" | "Tái chế" | "Thu gom riêng" | "Rác khác" | "Tái sử dụng";
export const sortingCategories: SortCategory[] = [
  "Hữu cơ",
  "Tái chế",
  "Thu gom riêng",
  "Rác khác",
  "Tái sử dụng",
];
export const sortingItems: {
  id: string;
  name: string;
  icon: string;
  category: SortCategory;
}[] = [
  { id: "banana", name: "Vỏ chuối", icon: "🍌", category: "Hữu cơ" },
  { id: "orange", name: "Vỏ cam", icon: "🍊", category: "Hữu cơ" },
  { id: "leaf", name: "Lá cây", icon: "🍃", category: "Hữu cơ" },
  { id: "rice", name: "Cơm thừa", icon: "🍚", category: "Hữu cơ" },
  { id: "paper", name: "Giấy sạch", icon: "📄", category: "Tái chế" },
  { id: "news", name: "Báo cũ", icon: "📰", category: "Tái chế" },
  { id: "carton", name: "Hộp carton sạch", icon: "📦", category: "Tái chế" },
  { id: "can", name: "Lon nhôm", icon: "🥫", category: "Tái chế" },
  { id: "bottle", name: "Chai nhựa", icon: "🧴", category: "Tái chế" },
  { id: "glass", name: "Chai thủy tinh", icon: "🍾", category: "Tái chế" },
  { id: "battery", name: "Pin", icon: "🔋", category: "Thu gom riêng" },
  { id: "bulb", name: "Bóng đèn", icon: "💡", category: "Thu gom riêng" },
  {
    id: "device",
    name: "Thiết bị điện tử hỏng",
    icon: "📱",
    category: "Thu gom riêng",
  },
  { id: "tissue", name: "Giấy ăn bẩn", icon: "🧻", category: "Rác khác" },
  {
    id: "clothes",
    name: "Quần áo còn tốt",
    icon: "👕",
    category: "Tái sử dụng",
  },
  { id: "book", name: "Sách còn tốt", icon: "📚", category: "Tái sử dụng" },
  {
    id: "lunchbox",
    name: "Hộp nhựa dùng nhiều lần",
    icon: "🥡",
    category: "Tái sử dụng",
  },
];
