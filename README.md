# MONALIENS - NFT Koleksiyonu Websitesi

MONALIENS, MONAD ağı üzerindeki benzersiz bir NFT koleksiyonu için hazırlanmış modern ve dinamik bir web sitesidir. Proje, React.js ve çeşitli modern frontend teknolojileri kullanılarak geliştirilmiştir.

## Özellikler

- Modern ve duyarlı tasarım
- NFT görüntüleme ve satın alma
- NFT Staking sistemi
- Profil yönetimi
- Kapsamlı dokümantasyon
- Animasyonlar ve geçişler
- Tema değiştirme desteği

## Teknolojiler

- React.js
- React Router
- Styled Components
- Framer Motion (animasyonlar için)
- Axios (API istekleri için)
- React Intersection Observer (görünürlük tabanlı animasyonlar için)

## Kurulum

Projeyi yerel makinenizde çalıştırmak için:

```bash
# Depoyu klonlayın
git clone https://github.com/yourusername/monaliens-frontend.git

# Proje dizinine gidin
cd monaliens-frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start
```

Tarayıcınızda `http://localhost:3000` adresini açın.

## Proje Yapısı

```
monaliens-frontend/
│
├── public/                 # Statik dosyalar
│
├── src/                    # Kaynak kodları
│   ├── assets/             # Görseller, videolar ve diğer medya dosyaları
│   │
│   ├── components/         # Yeniden kullanılabilir bileşenler
│   │   ├── Navbar.js       # Navigasyon çubuğu
│   │   ├── NftCard.js      # NFT kartı bileşeni
│   │   └── ...
│   │
│   ├── context/            # Context API bileşenleri
│   │   └── ThemeContext.js # Tema context
│   │
│   ├── hooks/              # Özel hooks
│   │
│   ├── pages/              # Sayfa bileşenleri
│   │   ├── HomePage.js     # Ana sayfa
│   │   ├── GalleryPage.js  # Galeri sayfası
│   │   ├── StakingPage.js  # Staking sayfası
│   │   ├── ProfilePage.js  # Profil sayfası
│   │   └── DocsPage.js     # Dokümantasyon sayfası
│   │
│   ├── services/           # API servisleri
│   │   └── api.js          # API çağrıları
│   │
│   ├── styles/             # Stil dosyaları
│   │   ├── index.css       # Genel stiller
│   │   └── App.css         # Uygulama stili
│   │
│   ├── utils/              # Yardımcı fonksiyonlar
│   │
│   ├── App.js              # Ana uygulama bileşeni
│   └── index.js            # Giriş noktası
│
├── package.json            # Bağımlılıklar ve komutlar
└── README.md               # Dokümantasyon
```

## API Entegrasyonu

Web sitesi, şu anda taklit verilerle çalışmaktadır, ancak daha sonra `/src/services/api.js` dosyasındaki servisleri güncelleyerek gerçek bir API ile entegre edilebilir.

## Canlı Demo

Projenin canlı demosuna [buradan](https://monaliens.xyz) erişebilirsiniz.

## Ekran Görüntüleri

_(Ekran görüntüleri daha sonra eklenecek)_

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. 