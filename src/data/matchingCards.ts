export const matchingPairs = [
  [
    "Kinh tế tuần hoàn",
    "Giữ sản phẩm và vật liệu được sử dụng lâu nhất có thể",
  ],
  ["Kinh tế tuyến tính", "Lấy tài nguyên, sản xuất, sử dụng rồi vứt bỏ"],
  ["Giảm sử dụng", "Dùng ít tài nguyên và tạo ít chất thải hơn"],
  ["Tái sử dụng", "Dùng một sản phẩm nhiều lần"],
  ["Sửa chữa", "Khắc phục phần bị hỏng để tiếp tục sử dụng"],
  ["Chia sẻ", "Nhiều người cùng sử dụng một sản phẩm"],
  ["Tái chế", "Xử lý vật liệu cũ thành vật liệu hoặc sản phẩm mới"],
  ["Rác hữu cơ", "Rác từ thực phẩm hoặc cây cối có thể phân hủy"],
  ["Vòng đời sản phẩm", "Hành trình từ nguyên liệu đến sau khi sử dụng"],
  ["Tài nguyên thiên nhiên", "Những thứ lấy từ tự nhiên để phục vụ cuộc sống"],
  ["Thu gom riêng", "Tách một loại chất thải để xử lý phù hợp"],
  ["Kéo dài tuổi thọ", "Làm sản phẩm tiếp tục hữu ích lâu hơn"],
].map(([term, definition], index) => ({
  id: `pair-${index + 1}`,
  term,
  definition,
}));
