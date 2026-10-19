# Tabakât Atlası

*Sahâbeden imamlara, yedi ilim merkezinde ilmin aktarımı.*

Sahâbe, tâbiîn ve sonraki kuşaklardan âlimlerin hayatlarını, hoca-talebe bağlantılarını ve
bu ilmin imamlara ulaşma yollarını kuşak ve bölgeye göre gösteren statik site. [Astro](https://astro.build) + [Cytoscape.js](https://js.cytoscape.org) ile yapılmıştır.

**Site:** https://umeyrgarip.github.io/tabakat-atlasi/

Bu çalışma, Islah-ı Medaris Halkası'nda verilen bir araştırma ödevi sonucunda oluşturulmuştur.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:4321/tabakat-atlasi/
npm run build    # dist/ klasörüne statik site üretir
```

## Veri nerede?

| Dosya | İçerik |
|---|---|
| `src/veri/raviler/*.yaml` | Her kişi için bir dosya. Dosya adı kişinin kimliğidir (`ibrahim-en-nehai`). |
| `src/veri/bolgeler.yaml` | Bölgeler, renkleri ve ağdaki sütun sırası. |
| `src/content.config.ts` | Alanların şeması. Hatalı/eksik alan olursa site derlenmez ve hatayı söyler. |

### Yeni kişi ekleme

```yaml
isim: Katâde b. Diâme
tam_isim: Ebü'l-Hattâb Katâde b. Diâme es-Sedûsî
tabaka: tabiin             # sahabe | tabiin | etbau-t-tabiin | tebe-i-etbai-t-tabiin | sonraki
dogum: { hicri: 61, miladi: 680 }
vefat: { hicri: 117, miladi: 735, not: "118 de denmiştir" }
bolge: basra               # bolgeler.yaml içindeki id
diger_bolgeler: []
ozet: Tek cümlelik tanıtım (listelerde görünür).
biyografi: |               # imamlar için yazılmaz
  Kısa biyografi...
hocalari:                  # talebeler ayrıca yazılmaz, buradan otomatik çıkarılır
  - kisi: hasan-el-basri
  - kisi: said-b-el-museyyeb
    kaynak: "Tehzîbü'l-Kemâl, cilt, sayfa"
  - kisi: ibrahim-en-nehai
    araci: Hammâd b. Ebî Süleymân   # listede olmayan ara halka → kesikli çizgi
kaynaklar:
  - TDV İslâm Ansiklopedisi, "Katâde b. Diâme" maddesi
dogrulandi: false          # kaynaklardan kontrol edince true (kısmen kontrol edildiyse: kismi)
```

İmamlar için ek alan: `imam: { mezheb: Hanefî, yasayan: true }` (günümüze ulaşmayan mezheb için `yasayan: false`).

## Doğrulama

Bütün kayıtlar ve hoca-talebe bağları kaynaklardan kontrol edilmiştir. Başlıca kaynaklar TDV İslâm Ansiklopedisi
ile el-Mektebetü'ş-Şâmile üzerinden İbn Hacer'in *Takrîbü't-Tehzîb*'i, Mizzî'nin *Tehzîbü'l-Kemâl*'i ve Zehebî'nin
*Siyeru a'lâmi'n-nübelâ*'sıdır. Her bağın kaynağı sitede ilgili satırda gösterilir; ayrıntılı notlar `dogrulama/`
klasöründeki raporlardadır.

## Yayın

Site GitHub Pages'te yayımlanır. `main` dalına yapılan her yüklemede `.github/workflows/yayin.yml` siteyi derleyip
yayımlar. Adres ayarı `astro.config.mjs` içindedir (`site` ve `base`).
