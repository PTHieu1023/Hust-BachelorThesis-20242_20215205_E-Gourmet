# E-Gourmet

E-Gourmet là một nền tảng đánh giá món ăn và nhà hàng, giúp người dùng khám phá và chia sẻ trải nghiệm ẩm thực của họ.

## Tính năng

- Xem danh sách món ăn và nhà hàng
- Đánh giá và bình luận về món ăn
- Tìm kiếm theo danh mục và từ khóa
- Gợi ý món ăn dựa trên sở thích
- Chế độ tối/sáng
- Giao diện thân thiện với người dùng

## Công nghệ sử dụng

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Prisma (ORM)

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/yourusername/e-gourmet.git
cd e-gourmet
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env.local và cấu hình các biến môi trường:
```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Chạy development server:
```bash
npm run dev
```

5. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Cấu trúc dự án

```
src/
├── app/                 # Next.js app router
├── components/         # React components
│   ├── ui/            # UI components
│   ├── food/          # Food-related components
│   └── layout/        # Layout components
├── lib/               # Utility functions
├── types/             # TypeScript types
└── styles/            # Global styles
```

## Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## Giấy phép

MIT
