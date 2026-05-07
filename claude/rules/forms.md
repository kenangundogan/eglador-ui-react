# Form & Input'lar

## İçindekiler

- Input — icon, iconRight, state prop'ları
- InputGroup — Text ve Addon
- Select — tekil bileşen, options prop'u
- MultiSelect
- NativeSelect
- Checkbox ve CheckboxGroup
- Radio ve RadioGroup
- Switch
- DatePicker, DateTimePicker, Calendar
- InputOTP
- Validation durumları

---

## Input — icon, iconRight, state prop'ları

Wrapper div + absolute positioning yazmak yerine prop'ları kullan.

**Yanlış:**

```tsx
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
  <input className="pl-10 ..." placeholder="Ara..." />
</div>
```

**Doğru:**

```tsx
import { Input, SearchIcon, XIcon } from "eglador-ui-react"

// Sol ikon
<Input placeholder="Ara..." icon={<SearchIcon />} />

// Sağ ikon
<Input placeholder="Şifre" type="password" iconRight={<XIcon />} />

// Validation state
<Input state="error" placeholder="E-posta" />
<Input state="success" placeholder="E-posta" />
// state: "idle" | "error" | "success"

// Özellikler
<Input
  variant="default"   // "default" | "outline" | "ghost"
  size="sm"           // "xs" | "sm" | "md"
  shape="rounded"     // "square" | "rounded"
  color="default"     // "default" | "black" | "primary" | "danger" | "success" | "warning" | "info"
  loading={false}
  label="E-posta"     // Built-in label
  errorMessage="Geçersiz e-posta"
  successMessage="Geçerli e-posta"
/>
```

---

## InputGroup — Text ve Addon

`InputGroup.Text` statik metin prefix/suffix içindir. `InputGroup.Addon` buton ve interaktif elemanlar içindir. Raw `Input` veya `Textarea` doğrudan `InputGroup` içine konur.

**Yanlış:**

```tsx
// InputGroup.Input diye bir alt bileşen YOKTUR
<InputGroup>
  <InputGroup.Input placeholder="alan-adi" />
</InputGroup>
```

**Doğru:**

```tsx
import { InputGroup, Input, Button, SearchIcon } from "eglador-ui-react"

// Text prefix
<InputGroup>
  <InputGroup.Text>https://</InputGroup.Text>
  <Input placeholder="alan-adi" />
</InputGroup>

// Text suffix
<InputGroup>
  <Input placeholder="Tutar" type="number" />
  <InputGroup.Text>TL</InputGroup.Text>
</InputGroup>

// Her iki tarafta text
<InputGroup>
  <InputGroup.Text>$</InputGroup.Text>
  <Input placeholder="0.00" type="number" />
  <InputGroup.Text>USD</InputGroup.Text>
</InputGroup>

// Buton suffix
<InputGroup>
  <Input placeholder="Ara..." />
  <InputGroup.Addon>
    <Button icon={<SearchIcon />} />
  </InputGroup.Addon>
</InputGroup>

// Stacked (dikey) varyant
<InputGroup variant="stacked">
  <Input placeholder="Ad" />
  <Input placeholder="Soyad" />
</InputGroup>
// variant: "bordered" | "stacked"
```

---

## Select — tekil bileşen, options prop'u

`Select` bir composition bileşeni **değildir**. `options` prop'uyla çalışır.

**Yanlış:**

```tsx
// Select'in alt bileşenleri YOKTUR
<Select>
  <Select.Trigger placeholder="Seç..." />
  <Select.Content>
    <Select.Group>
      <Select.Item value="tr">Türkiye</Select.Item>
    </Select.Group>
  </Select.Content>
</Select>
```

**Doğru:**

```tsx
import { Select } from "eglador-ui-react"

const [value, setValue] = React.useState("")

<Select
  value={value}
  onChange={(val) => setValue(val)}
  options={[
    { label: "Türkiye", value: "tr" },
    { label: "Almanya", value: "de" },
    { label: "Fransa", value: "fr" },
  ]}
  placeholder="Ülke seç..."
  shape="rounded"      // "square" | "rounded"
  disabled={false}
  autoFlip={true}
  maxHeight={240}
/>
```

`onChange` callback: `(value: string, option?: { label: string, value: string }) => void`

---

## MultiSelect

```tsx
import { MultiSelect } from "eglador-ui-react"

<MultiSelect
  value={selectedValues}
  onChange={(vals) => setSelectedValues(vals)}
  options={[
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Angular", value: "angular" },
  ]}
  placeholder="Teknoloji seç..."
  searchable={true}
  searchPlaceholder="Ara..."
  maxSelected={3}
  maxVisibleChips={2}
  shape="rounded"      // "square" | "rounded"
  disabled={false}
/>
```

---

## NativeSelect

JavaScript gerektirmeyen, sade HTML select için:

```tsx
import { NativeSelect } from "eglador-ui-react"

<NativeSelect value={value} onChange={e => setValue(e.target.value)}>
  <option value="">Seçiniz...</option>
  <option value="tr">Türkiye</option>
  <option value="de">Almanya</option>
</NativeSelect>
```

---

## Checkbox ve CheckboxGroup

```tsx
import { Checkbox, CheckboxGroup, Label } from "eglador-ui-react"

// Tekil checkbox
<div className="flex items-center gap-2">
  <Checkbox id="terms" checked={checked} onChange={e => setChecked(e.target.checked)} />
  <Label htmlFor="terms">Şartları kabul ediyorum</Label>
</div>

// Grup
<CheckboxGroup>
  <Checkbox value="react" defaultChecked>React</Checkbox>
  <Checkbox value="vue">Vue</Checkbox>
  <Checkbox value="angular">Angular</Checkbox>
</CheckboxGroup>
```

---

## Radio ve RadioGroup

```tsx
import { Radio, RadioGroup } from "eglador-ui-react"

<RadioGroup value={selected} onChange={val => setSelected(val)}>
  <Radio value="light">Açık tema</Radio>
  <Radio value="dark">Koyu tema</Radio>
  <Radio value="system">Sistem teması</Radio>
</RadioGroup>
```

---

## Switch

```tsx
import { Switch, Label } from "eglador-ui-react"

<div className="flex items-center gap-3">
  <Switch
    id="notif"
    checked={enabled}
    onChange={e => setEnabled(e.target.checked)}
  />
  <Label htmlFor="notif">Bildirimleri etkinleştir</Label>
</div>
```

---

## DatePicker, DateTimePicker, Calendar

```tsx
import { DatePicker, DateTimePicker, Calendar } from "eglador-ui-react"

// Popup tarih seçici
<DatePicker value={date} onChange={setDate} placeholder="Tarih seç..." />

// Popup tarih + saat
<DateTimePicker value={datetime} onChange={setDatetime} />

// Inline takvim
<Calendar selected={date} onSelect={setDate} />
```

---

## InputOTP

```tsx
import { InputOTP } from "eglador-ui-react"

<InputOTP
  length={6}
  value={otp}
  onChange={setOtp}
  onComplete={code => handleVerify(code)}
/>
```

---

## Validation Durumları

`Input` ve `Textarea` bileşenlerinde `state` prop'unu kullan:

```tsx
// Hata
<Input
  state="error"
  value={email}
  onChange={e => setEmail(e.target.value)}
  errorMessage="Geçersiz e-posta adresi"
/>

// Başarı
<Input state="success" successMessage="E-posta uygun" />

// İdle (varsayılan)
<Input state="idle" />
```
