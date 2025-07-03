# Basic CRUD API

Node.js ve PostgreSQL ile basit CRUD (Create, Read, Update, Delete) API uygulaması.

## 🚀 Özellikler

- ✅ **Tam CRUD İşlemleri** - Kullanıcı ekleme, okuma, güncelleme, silme
- ✅ **PostgreSQL Entegrasyonu** - Güvenli veritabanı bağlantısı
- ✅ **TC Kimlik Koruması** - TC numarası değiştirilemez
- ✅ **Docker Desteği** - Kolay kurulum ve çalıştırma
- ✅ **Debug Logları** - Detaylı işlem takibi
- ✅ **RESTful API** - Standart HTTP metodları

## 📋 API Endpoints

| Method | Endpoint | Açıklama | Request Body |
|--------|----------|----------|--------------|
| GET | `/` | Tablo oluştur | - |
| GET | `/setup` | Tablo oluştur | - |
| POST | `/insert` | Kullanıcı ekle | `{"isim": "Ad", "yas": 25, "tc": "12345678901"}` |
| GET | `/users` | Tüm kullanıcıları getir | - |
| GET | `/users/:id` | ID ile kullanıcı getir | - |
| PUT | `/update/:id` | Kullanıcı güncelle | `{"isim": "Yeni Ad", "yas": 26, "tc": "12345678901"}` |
| DELETE | `/delete/:id` | Kullanıcı sil | - |

## 🛠️ Kurulum

### Docker ile (Önerilen)

```bash
# Repository'yi klonla
git clone https://github.com/yourusername/basicCrud.git
cd basicCrud

# Docker Compose ile başlat
docker-compose up --build

# Arka planda çalıştır
docker-compose up -d
```

### Manuel Kurulum

```bash
# Dependencies yükle
npm install

# PostgreSQL'i kur ve çalıştır
# server-local.js dosyasındaki bağlantı ayarlarını güncelle

# Uygulamayı başlat
node server-local.js
```

## 🧪 Test

```bash
# Tablo oluştur
curl http://localhost:3000/setup

# Kullanıcı ekle
curl -X POST http://localhost:3000/insert \
  -H "Content-Type: application/json" \
  -d '{"isim": "Ahmet Yılmaz", "yas": 25, "tc": "12345678901"}'

# Tüm kullanıcıları listele
curl http://localhost:3000/users

# ID ile kullanıcı getir
curl http://localhost:3000/users/1

# Kullanıcı güncelle
curl -X PUT http://localhost:3000/update/1 \
  -H "Content-Type: application/json" \
  -d '{"isim": "Ahmet Yılmaz", "yas": 26, "tc": "12345678901"}'

# Kullanıcı sil
curl -X DELETE http://localhost:3000/delete/1
```

## 📊 Veritabanı Şeması

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    isim CHAR(99) NOT NULL,
    yas INTEGER NOT NULL,
    tc CHAR(11) UNIQUE NOT NULL
);
```

## 🔧 Konfigürasyon

### Docker (server.js)
- Host: `db`
- Port: `5432`
- User: `123`
- Password: `12345`
- Database: `db1`

### Local (server-local.js)
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `password123`
- Database: `postgres`

## 🐛 Debug

Uygulama tüm işlemlerde detaylı log çıktısı verir:
- Bağlantı durumu
- İşlem adımları
- Hata mesajları
- Kullanıcı bilgileri

## 📝 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork yap
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit yap (`git commit -m 'Add amazing feature'`)
4. Push yap (`git push origin feature/amazing-feature`)
5. Pull Request aç 