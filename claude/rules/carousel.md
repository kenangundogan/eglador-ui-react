# Carousel Bileşeni

Embla Carousel tabanlı, tekil bileşen. Slayt içerikleri `slides` prop'u ile dizi olarak verilir.

## Peer Dependency (Zorunlu)

```bash
npm install embla-carousel embla-carousel-react
```

Plugin'ler kullanılacaksa ayrıca kurulur (isteğe bağlı):

```bash
npm install embla-carousel-autoplay           # autoplay
npm install embla-carousel-auto-scroll        # autoScroll
npm install embla-carousel-auto-height        # autoHeight
npm install embla-carousel-fade               # fade
npm install embla-carousel-wheel-gestures     # wheelGestures
npm install embla-carousel-class-names        # classNames
```

---

## Props

```typescript
interface CarouselProps {
  slides: React.ReactNode[];          // zorunlu — slayt içerikleri

  // Temel davranış
  slidesPerView?: number | "auto";    // kaç slayt aynı anda görünür
  align?: "start" | "center" | "end"; // slayt hizalaması
  containScroll?: "trimSnaps" | "keepSnaps" | false;
  loop?: boolean;                     // varsayılan: false
  dragFree?: boolean;                 // serbest sürükleme, varsayılan: false
  axis?: "x" | "y";                  // yatay/dikey, varsayılan: "x"
  direction?: "ltr" | "rtl";         // varsayılan: "ltr"

  // Plugin'ler — boolean veya plugin options objesi
  autoplay?: boolean | { delay?: number; [key: string]: unknown };
  autoScroll?: boolean | { speed?: number; [key: string]: unknown };
  autoHeight?: boolean;
  fade?: boolean;
  wheelGestures?: boolean;            // varsayılan: true
  classNames?: boolean | Record<string, unknown>;

  // Görsel efektler
  parallax?: boolean;                 // kaydırma parallax efekti
  opacity?: boolean;                  // slaytlara opaklık efekti
  lazyLoad?: boolean;                 // görünüme girene kadar slayt yükleme

  // Kontroller
  showNavigation?: boolean;           // önceki/sonraki okları göster
  showPagination?: boolean;           // nokta göstergeleri göster
  scrollToIndex?: number;             // programa ile slayta atla

  // Responsive
  breakpoints?: Record<string, { slidesPerView?: number | "auto"; [key: string]: unknown }>;

  // Stil
  className?: string;                 // kapsayıcı wrapper
  viewportClassName?: string;         // overflow-hidden viewport
  containerClassName?: string;        // flex container
  slideClassName?: string;            // her slayt wrapper
  styles?: {
    controls?: string;                // navigasyon + pagination kapsayıcı
    navigation?: string;              // önceki/sonraki buton grubu
    pagination?: string;              // nokta grubu
    prevButton?: string;              // önceki butonu
    nextButton?: string;              // sonraki butonu
    dot?: string;                     // nokta butonu
  };
}
```

---

## Temel Kullanım

```tsx
import { Carousel } from "eglador-ui-react"

<Carousel
  slides={[
    <img src="/slide1.jpg" className="w-full h-64 object-cover rounded-lg" />,
    <img src="/slide2.jpg" className="w-full h-64 object-cover rounded-lg" />,
    <img src="/slide3.jpg" className="w-full h-64 object-cover rounded-lg" />,
  ]}
  showNavigation
  showPagination
  loop
/>
```

---

## Çoklu Slayt Görünümü

```tsx
// Sayfada 3 slayt göster
<Carousel
  slides={items.map(item => <CardItem item={item} />)}
  slidesPerView={3}
  showNavigation
/>

// Otomatik genişlik (auto)
<Carousel
  slides={slides}
  slidesPerView="auto"
  slideClassName="w-72"  // her slaytın genişliğini className ile belirle
/>
```

---

## Autoplay

```tsx
// Varsayılan — 4 saniyede bir
<Carousel slides={slides} autoplay loop />

// Özel delay
<Carousel slides={slides} autoplay={{ delay: 2000 }} loop />
```

---

## Dikey Carousel

```tsx
<Carousel
  slides={slides}
  axis="y"
  className="h-96"
  viewportClassName="h-full"
/>
```

---

## Efektler

```tsx
// Fade geçişi (embla-carousel-fade gerektirir)
<Carousel slides={slides} fade loop />

// Parallax efekti
<Carousel slides={slides} parallax />

// Opaklık efekti
<Carousel slides={slides} opacity />

// Birlikte
<Carousel slides={slides} parallax opacity />
```

---

## Lazy Load

Görünüme girene kadar slayt render edilmez:

```tsx
<Carousel
  slides={images.map(src => (
    <img src={src} className="w-full h-64 object-cover" />
  ))}
  lazyLoad
  loop
/>
```

---

## Responsive (Breakpoints)

```tsx
<Carousel
  slides={slides}
  slidesPerView={1}
  breakpoints={{
    "(min-width: 640px)": { slidesPerView: 2 },
    "(min-width: 1024px)": { slidesPerView: 3 },
  }}
  showNavigation
  showPagination
/>
```

---

## Stil Özelleştirme

```tsx
// Navigasyon ve pagination stilleri
<Carousel
  slides={slides}
  showNavigation
  showPagination
  styles={{
    controls: "flex justify-center items-center gap-8 mt-6",
    prevButton: "bg-black text-white rounded-full size-10",
    nextButton: "bg-black text-white rounded-full size-10",
    dot: "size-3 rounded-full bg-zinc-300",
  }}
/>

// Slayt ve kapsayıcı className
<Carousel
  slides={slides}
  className="w-full max-w-4xl mx-auto"
  viewportClassName="rounded-xl overflow-hidden"
  slideClassName="px-2"
/>
```

---

## Programa ile Slayt Atlama

```tsx
const [currentIndex, setCurrentIndex] = React.useState(0)

<Carousel
  slides={slides}
  scrollToIndex={currentIndex}
  loop
/>

<Button onClick={() => setCurrentIndex(2)}>3. Slayda Git</Button>
```

---

## Dikkat

- `wheelGestures` varsayılan olarak `true`'dur — kullanıcı fare tekerleği ile de kaydırabilir.
- `autoHeight` kullanıyorsan, resimlerin yüklenmesini bekler ve carousel yüksekliğini otomatik günceller.
- `fade` efekti ve `loop`, `slidesPerView > 1` ile birlikte kullanılmamalıdır — Embla kısıtlaması.
