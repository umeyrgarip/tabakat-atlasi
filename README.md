# Tabakât Atlası

**Sahâbeden imamlara, kuşak kuşak ve bölge bölge hoca-talebe bağları.**

🔗 **https://umeyrgarip.github.io/tabakat-atlasi/**

Tabakât Atlası; sahâbe, tâbiîn ve sonraki kuşaklardan âlimlerin hayatlarını, kimlerden ilim aldıklarını ve bu ilmin
mezheb imamlarına hangi yollarla ulaştığını gösteren bir çalışmadır. Adını, râvîleri kuşaklarına (tabaka) ve
yaşadıkları ilim merkezlerine göre düzenleyen klasik **tabakât** geleneğinden alır.

> Bu çalışma, Islah-ı Medaris Halkası'nda verilen bir araştırma ödevi sonucunda oluşturulmuştur.

---

## İçinde neler var

| | |
|---|---|
| **59 âlim** | 16 sahâbî, 32 tâbiî, 6 etbâu't-tâbiîn, 3 tebe-i etbâ ve 2 sonraki dönem âlimi |
| **211 hoca-talebe bağı** | Her biri kaynağıyla birlikte; aracılı ve kaynaklarda ihtilaflı bağlar ayrıca işaretli |
| **9 bölge** | Medine, Mekke, Kûfe, Basra, Şam, Yemen ve Mısır ile imamlar için Bağdat ve Horasan |
| **11 mezheb imamı** | Günümüze ulaşan dört mezhebin imamları ve günümüze ulaşmayan yedi mezhebin imamları |

## Sayfalar

- **Bağlantı Ağı** — Bütün âlimler tek bir ağda: her sütun bir bölge, dikey eksen vefat yılı. Bir bölgeye ya da
  kişiye odaklanabilir, yalnızca doğrudan bağları ya da sahâbeden imamlara uzanan bütün zinciri görebilir, iki kişi
  arasındaki en kısa yolu bulabilirsiniz.
- **Râvîler** — Her âlim için biyografi, tam isim ve Arapça yazılış, doğum ve vefat tarihleri, İbn Hacer'in
  *Takrîb*'indeki cerh ve ta'dîl hükmü, hocaları, talebeleri ve ilminin hangi imamlara ulaştığı. Sayfadaki küçük
  ağ, kişinin kendi bağlarını kuşak ve bölgeye göre gösterir.
- **Bölgeler** — Her ilim merkezinin âlimleri ve bölgeler arasındaki ilim akışı.

## Kaynaklar ve doğrulama

Bütün kayıtlar ve hoca-talebe bağları kaynaklardan kontrol edilmiştir. Başlıca kaynaklar:

- **TDV İslâm Ansiklopedisi** — biyografiler, tarihler ve hoca-talebe ilişkileri
- **el-Mektebetü'ş-Şâmile** üzerinden İbn Hacer, *Takrîbü't-Tehzîb*; Mizzî, *Tehzîbü'l-Kemâl*; Zehebî, *Siyeru a'lâmi'n-nübelâ*

Sitede her bağın yanında kaynağı gösterilir. Kaynaklarda tartışmalı olan bağlar (ör. bir tâbiînin belirli bir
sahâbîden bizzat işitip işitmediği) "ihtilaflı" olarak işaretlenmiş ve notuyla verilmiştir. Doğrulama sırasında
tutulan ayrıntılı notlar [`dogrulama/`](dogrulama/) klasöründedir.

---

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:4321/tabakat-atlasi/
npm run build    # siteyi dist/ klasörüne üretir
```

`main` dalına yapılan her yüklemede site GitHub Actions ile derlenip GitHub Pages'te yayımlanır
([`.github/workflows/yayin.yml`](.github/workflows/yayin.yml)). Adres ayarı `astro.config.mjs` içindedir (`site` ve `base`).

### Veri

| Dosya | İçerik |
|---|---|
| `src/veri/raviler/*.yaml` | Her âlim için bir dosya; dosya adı kişinin kimliğidir (`katade-b-diame`). |
| `src/veri/bolgeler.yaml` | Bölgeler, renkleri ve ağdaki sütun sırası. |
| `src/content.config.ts` | Alanların şeması; eksik ya da hatalı alan olursa site derlenmez ve hatayı gösterir. |

Talebeler ayrıca yazılmaz; her kişinin `hocalari` listesinden otomatik çıkarılır. Örnek kayıt (kısaltılmış):

```yaml
isim: Katâde b. Diâme
tam_isim: Ebü'l-Hattâb Katâde b. Diâme es-Sedûsî el-Basrî
arapca: قتادة بن دعامة
cerh_tadil: Sika, sebt (İbn Hacer, Takrîb; 4. tabaka)
tabaka: tabiin             # sahabe | tabiin | etbau-t-tabiin | tebe-i-etbai-t-tabiin | sonraki
dogum: { hicri: 60, miladi: 680, not: "61 de denmiştir" }
vefat: { hicri: 117, miladi: 735, not: "118 de denmiştir" }
bolge: basra               # bolgeler.yaml içindeki kimlik
ozet: Güçlü hafızasıyla darbımesel olan âmâ müfessir ve muhaddis.   # listelerde görünür
biyografi: |
  Âmâ olarak doğdu; …
hocalari:
  - kisi: enes-b-malik
    not: sahâbeden yalnız ondan hadis aldı
    kaynak: { ad: "TDV İslâm Ansiklopedisi, \"Katâde b. Diâme\"", url: "https://islamansiklopedisi.org.tr/katade-b-diame" }
  - kisi: hasan-el-basri
    kaynak: …
  # Diğer işaretler:
  #   araci: Hammâd b. Ebî Süleymân   → listede olmayan ara halka (kesikli çizgi)
  #   ihtilafli: true                 → kaynaklarda tartışmalı bağ
  #   tur: akrabalik                  → yalnızca akrabalık (varsayılan: rivayet)
kaynaklar:
  - { ad: "el-Mektebetü'ş-Şâmile, ravi kaydı", url: "https://shamela.ws/narrator/5183" }
dogrulandi: true           # kaynaklardan kontrol edildi (kısmen: kismi)
```

Mezheb imamları için ek alan: `imam: { mezheb: Hanefî, yasayan: true }` (günümüze ulaşmayan mezheb için `yasayan: false`).
