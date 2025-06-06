# Hướng dẫn Setup Gmail API cho Email Service

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Bật Gmail API:
   - Vào **APIs & Services** → **Library**
   - Tìm kiếm "Gmail API"
   - Click vào Gmail API và nhấn **Enable**

## Bước 2: Tạo OAuth2 Credentials

1. Vào **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Chọn **Application type**: **Web application**
4. Thêm authorized redirect URI: `https://developers.google.com/oauthplayground`
5. Lưu **Client ID** và **Client Secret**

## Bước 3: Lấy Refresh Token

1. Truy cập [OAuth2 Playground](https://developers.google.com/oauthplayground)
2. Click vào icon **⚙️** (Settings) ở góc phải
3. Check **"Use your own OAuth credentials"**
4. Nhập **OAuth Client ID** và **OAuth Client Secret** từ bước 2
5. Trong **Step 1**:
   - Tìm **Gmail API v1**
   - Select scope: `https://www.googleapis.com/auth/gmail.send`
   - Click **Authorize APIs**
6. Đăng nhập bằng Gmail account bạn muốn sử dụng
7. Trong **Step 2**: Click **Exchange authorization code for tokens**
8. Copy **Refresh Token** từ Response

## Bước 4: Cập nhật Environment Variables

Thay thế các giá trị trong file `.env`:

```env
GMAIL_CLIENT_ID=your_actual_client_id
GMAIL_CLIENT_SECRET=your_actual_client_secret
GMAIL_REFRESH_TOKEN=your_actual_refresh_token
GMAIL_USER=your_gmail_address@gmail.com
```

## Bước 5: Cài đặt Dependencies

Chạy lệnh sau để cài đặt các packages cần thiết:

```bash
npm install nodemailer googleapis
npm install -D @types/nodemailer
```

## Bước 6: Test Email Service

Sau khi setup xong, bạn có thể test email service bằng cách tạo một event mới trong admin panel.

## Lưu ý Bảo mật

- Không commit file `.env` vào Git
- Sử dụng environment variables trong production
- Refresh token có thể expire, cần refresh định kỳ

## Troubleshooting

### Lỗi "invalid_grant"
- Refresh token đã expired
- Tạo lại refresh token theo bước 3

### Lỗi "insufficient authentication"
- Kiểm tra lại scopes trong OAuth playground
- Đảm bảo đã enable Gmail API

### Lỗi "quota exceeded"
- Gmail API có giới hạn 1 tỷ quota units/ngày
- Mỗi email gửi tốn ~25 quota units

## Method 2: Sử dụng Gmail SMTP với App Password (Dễ hơn - Khuyến nghị)

Đây là cách đơn giản hơn và nhanh hơn để setup:

### Bước 1: Bật 2-Factor Authentication
1. Truy cập [Gmail Settings](https://myaccount.google.com/security)
2. Bật **2-Step Verification** nếu chưa bật

### Bước 2: Tạo App Password
1. Vào **Google Account** → **Security**
2. Trong **2-Step Verification**, click **App passwords**
3. Chọn **Mail** và **Other (Custom name)**
4. Nhập tên: `Sportograf App`
5. Google sẽ tạo 16-character password
6. Copy password này (không có spaces)

### Bước 3: Cập nhật Environment Variables
```env
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

### Bước 4: Sử dụng Simple Email Service
Thay vì sử dụng `email-service.ts`, sử dụng `email-service.ts`:

```typescript
// Trong enhanced-event-form.tsx, thay đổi import
import { 
  sendEventConfirmationEmail, 
  generateConfirmationLink 
} from "@/lib/email-service";
```

### Bước 5: Cài đặt Dependencies
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

## So sánh hai methods:

| Feature | Gmail API | Gmail SMTP |
|---------|-----------|------------|
| Setup | Phức tạp | Đơn giản |
| Security | Cao hơn | Tốt |
| Rate Limit | 1B quota/day | 500 emails/day |
| Maintenance | Cần refresh token | Không cần |
| Khuyến nghị | Production | Development/Small scale | 