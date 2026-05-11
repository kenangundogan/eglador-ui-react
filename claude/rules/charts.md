# Chart Bileşenleri

eglador-ui-react, Recharts'ın üzerine kurulu yüksek seviyeli grafik bileşenleri sağlar. Recharts doğrudan import etme.

## Grafik Bileşenleri

`Chart` diye tek bir bileşen **yoktur**. Her grafik türü ayrı export'tur:

```tsx
import {
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  DonutChart,
  RadarChart,
  RadialChart,
} from "eglador-ui-react"
```

| Bileşen | Kullanım |
|---------|---------|
| `LineChart` | Sürekli veri değişimi, trend analizi |
| `BarChart` | Kategorik karşılaştırma |
| `AreaChart` | Zaman serisi, alan vurgusu |
| `PieChart` | Bütünün parçaları (az kategori) |
| `DonutChart` | Pasta + merkez değer gösterimi |
| `RadarChart` | Çok boyutlu karşılaştırma |
| `RadialChart` | Tek metriğin ilerleme gösterimi |

---

## Ortak Props (BaseChartProps)

Tüm grafik bileşenlerinin paylaştığı prop'lar:

```typescript
type BaseChartProps = {
  data: Record<string, any>[];       // zorunlu — grafik verisi
  series: ChartSeries[];             // zorunlu — seri tanımları
  xAxis?: ChartAxisConfig;           // X ekseni ayarları
  yAxis?: ChartAxisConfig;           // Y ekseni ayarları
  secondYAxis?: ChartAxisConfig;     // İkinci Y ekseni (sağ)
  tooltip?: ChartTooltipConfig | boolean;  // varsayılan: true
  legend?: ChartLegendConfig | boolean;
  grid?: ChartGridConfig | boolean;  // varsayılan: true
  height?: number;                   // varsayılan: 300
  className?: string;
  loading?: boolean;                 // iskelet gösterir
  emptyMessage?: string;
  animated?: boolean;                // varsayılan: true
  ariaLabel?: string;
}
```

---

## ChartSeries

Her serinin tanımı:

```typescript
type ChartSeries = {
  dataKey: string;                   // zorunlu — data objesindeki alan adı
  name?: string;                     // tooltip/legend'da gösterilecek isim
  color?: string;                    // hex renk, CSS var, vs.
  dashed?: boolean;                  // kesik çizgi
  gradientFill?: boolean;            // alan grafiklerinde gradient
  interpolation?: "linear" | "monotone" | "step" | "stepBefore" | "stepAfter";
  stackId?: string;                  // stack gruplandırma
  yAxisId?: "left" | "right";        // çift Y ekseni için
}
```

---

## Kullanım Örnekleri

### LineChart

```tsx
import { LineChart } from "eglador-ui-react"

<LineChart
  data={[
    { ay: "Oca", gelir: 4000, gider: 2400 },
    { ay: "Şub", gelir: 3000, gider: 1398 },
    { ay: "Mar", gelir: 5000, gider: 3200 },
  ]}
  series={[
    { dataKey: "gelir", name: "Gelir", color: "#3b82f6" },
    { dataKey: "gider", name: "Gider", color: "#ef4444" },
  ]}
  xAxis={{ dataKey: "ay" }}
  height={300}
  dot={false}
  activeDot={true}
/>
// LineChart ek prop: dot?: boolean, activeDot?: boolean
```

### BarChart

```tsx
import { BarChart } from "eglador-ui-react"

<BarChart
  data={[
    { kategori: "A", deger: 120 },
    { kategori: "B", deger: 85 },
    { kategori: "C", deger: 200 },
  ]}
  series={[{ dataKey: "deger", name: "Değer", color: "#3b82f6" }]}
  xAxis={{ dataKey: "kategori" }}
  height={250}
  legend
/>
```

### AreaChart

```tsx
import { AreaChart } from "eglador-ui-react"

<AreaChart
  data={trafficData}
  series={[
    { dataKey: "ziyaretci", name: "Ziyaretçi", color: "#3b82f6", gradientFill: true },
    { dataKey: "uye", name: "Üye", color: "#10b981", gradientFill: true },
  ]}
  xAxis={{ dataKey: "tarih" }}
  height={300}
/>
```

### PieChart

```tsx
import { PieChart } from "eglador-ui-react"

// PieChart series, PieSeries tipinde — nameKey ve valueKey ekstra
<PieChart
  data={[
    { name: "Masaüstü", value: 60 },
    { name: "Mobil", value: 30 },
    { name: "Tablet", value: 10 },
  ]}
  series={[{
    dataKey: "value",
    nameKey: "name",
  }]}
  height={300}
/>
```

### DonutChart

```tsx
import { DonutChart } from "eglador-ui-react"

<DonutChart
  data={[
    { name: "Ödendi", value: 75 },
    { name: "Beklemede", value: 25 },
  ]}
  series={[{ dataKey: "value", nameKey: "name" }]}
  height={300}
/>
```

---

## Eksen Ayarları

```typescript
type ChartAxisConfig = {
  dataKey?: string;          // hangi data alanı kullanılacak
  label?: string;            // eksen etiketi
  tickFormatter?: (value: any, index: number) => string;
  domain?: [number | string, number | string];
  hide?: boolean;
  tickCount?: number;
  unit?: string;             // örn: "₺", "%", "K"
  type?: "number" | "category";
}
```

```tsx
// Eksen örnekleri
xAxis={{ dataKey: "ay", tickFormatter: (v) => v.slice(0, 3) }}
yAxis={{ unit: "₺", tickCount: 5 }}
yAxis={{ tickFormatter: (v) => `${v}K`, domain: [0, "auto"] }}
```

---

## Tooltip ve Legend

```tsx
// Tooltip kapatmak
<LineChart ... tooltip={false} />

// Legend üstte
<BarChart ... legend={{ show: true, position: "top", align: "left" }} />

// Grid kapatmak
<LineChart ... grid={false} />
```

---

## Yükleme ve Boş Durum

```tsx
// Yükleme iskeleti
<BarChart data={[]} series={[{ dataKey: "val" }]} loading />

// Boş veri mesajı
<LineChart data={[]} series={[{ dataKey: "val" }]} emptyMessage="Veri bulunamadı" />
```

---

## Renk Paleti

Renk belirtilmezse CHART_COLORS dizisinden sırayla alınır:

```tsx
import { CHART_COLORS, CHART_SEMANTIC_COLORS } from "eglador-ui-react"

// CHART_COLORS: ["#93c5fd", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"]

// CHART_SEMANTIC_COLORS:
// { primary: "#3b82f6", danger: "#ef4444", success: "#10b981",
//   warning: "#f59e0b", info: "#6366f1" }

// Seri rengini semantic olarak vermek için:
<BarChart
  series={[
    { dataKey: "gelir", color: CHART_SEMANTIC_COLORS.primary },
    { dataKey: "gider", color: CHART_SEMANTIC_COLORS.danger },
  ]}
  ...
/>
```

---

## Recharts Doğrudan Kullanma

**Yanlış — Recharts bileşenlerini doğrudan import etme:**

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
```

**Doğru — eglador-ui-react'ın yüksek seviyeli bileşenlerini kullan:**

```tsx
import { BarChart } from "eglador-ui-react"
```

Özel Recharts kompozisyonu gerekiyorsa (çok ileri düzey), `ChartContainer` ve `ChartTooltipContent` export edilir:

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "eglador-ui-react"
// Bu yalnızca mevcut yüksek seviyeli bileşenlerin yetersiz kaldığı nadir durumlarda kullanılır.
```
