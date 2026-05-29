# Qenn - Hệ Thống Quản Lý Thiết Bị Hạ Tầng Đường Cao Tốc HN-HP

Ứng dụng web quản lý và theo dõi các thiết bị hạ tầng dọc theo đường cao tốc Hà Nội - Hải Phòng.

## Tính Năng

- 📍 **Bản đồ theo dõi vị trí thiết bị** - Hiển thị các thiết bị trên bản đồ interactiveMap
- 📊 **Hiển thị trạng thái thiết bị** - Theo dõi trạng thái hoạt động của từng thiết bị
- 📈 **Dữ liệu lịch sử** - Xem lịch sử hoạt động và hiệu suất thiết bị
- 🔔 **Cảnh báo & Thông báo** - Nhận thông báo khi có sự cố
- 🎛️ **Bảng điều khiển Admin** - Quản lý và cấu hình thiết bị

## Loại Thiết Bị Được Theo Dõi

- 📹 Camera giao thông & cảm biến
- 🖼️ Biển LED
- 🔧 Hố ga
- 🌐 Đường cáp quang
- 🏗️ Các loại thiết bị hạ tầng khác

## Stack Công Nghệ

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Leaflet** - Bản đồ interactiveMap
- **Axios** - HTTP client
- **Redux/Context API** - State management
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Socket.io** - Real-time updates
- **JWT** - Authentication
- **Sequelize/TypeORM** - ORM

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container setup

## Cài Đặt

### Yêu Cầu
- Node.js v16+
- PostgreSQL 12+
- Docker & Docker Compose (tuỳ chọn)

### Hướng Dẫn Cài Đặt

#### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Cập nhật .env với thông tin database
npm run dev
```

#### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

#### Hoặc sử dụng Docker
```bash
docker-compose up -d
```

## Cấu Trúc Dự Án

```
Qenn/
├── backend/                 # Node.js + Express API
├── frontend/                # React + TypeScript App
├── database/                # PostgreSQL schemas
├── docker-compose.yml       # Docker setup
└── README.md
```

## API Documentation

Xem tài liệu API chi tiết tại `backend/API.md`

## Đóng Góp

Vui lòng fork repository và tạo pull request cho các tính năng mới.

## License

MIT License - Xem file LICENSE để chi tiết
