import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Hicrî / mîlâdî tarih. İkisi de opsiyonel; biri bilinmiyorsa boş bırakılır.
const tarih = z.object({
  hicri: z.number().int().optional(),
  miladi: z.number().int().optional(),
  not: z.string().optional(), // "ihtilaflı: 117 veya 119" gibi
});

// Kaynak: düz metin ("Takrîb, s. 95") ya da başlık + bağlantı
const kaynak = z.union([
  z.string(),
  z.object({ ad: z.string(), url: z.string().url().optional() }),
]);

const raviler = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/veri/raviler' }),
  schema: z.object({
    isim: z.string(),
    tam_isim: z.string().optional(),
    arapca: z.string().optional(), // Arapça yazılışı
    tabaka: z.enum(['sahabe', 'tabiin', 'etbau-t-tabiin', 'tebe-i-etbai-t-tabiin', 'sonraki']),
    dogum: tarih.optional(),
    vefat: tarih.optional(),
    bolge: z.string(), // ana bölge (bolgeler.yaml içindeki id)
    diger_bolgeler: z.array(z.string()).default([]),
    // Sadece mezheb imamları için. yasayan: false → günümüze ulaşmayan mezheb
    imam: z.object({ mezheb: z.string(), yasayan: z.boolean() }).optional(),
    cerh_tadil: z.string().optional(),
    ozet: z.string(), // listede görünen tek cümle
    biyografi: z.string().optional(), // imamlar için gerekmiyor
    // Talebeler ayrıca yazılmaz; hoca listelerinden otomatik çıkarılır.
    hocalari: z
      .array(
        z.object({
          kisi: z.string(), // hocanın dosya adı (id)
          // Listede olmayan ara halka(lar). Doluysa bağlantı dolaylıdır: hoca → aracı → talebe
          araci: z.string().optional(),
          // rivayet: hadis/ilim aldı (varsayılan) · fikih: fıkhî etkilenme · akrabalik: sadece akrabalık, ilim aktarımı tespit edilemedi
          tur: z.enum(['rivayet', 'fikih', 'akrabalik']).default('rivayet'),
          ihtilafli: z.boolean().default(false), // kaynaklarda tartışmalı (gördü ama rivayet etmedi vb.)
          kaynak: kaynak.optional(),
          not: z.string().optional(),
        }),
      )
      .default([]),
    kaynaklar: z.array(kaynak).default([]),
    // true: kayıt kaynaklardan kontrol edildi · 'kismi': yalnızca bağlantıların bir kısmı kaynaklı, kimlik ve tarih bilgileri henüz kontrol edilmedi
    dogrulandi: z.union([z.boolean(), z.literal('kismi')]).default(false),
    dogrulama_notu: z.string().optional(),
  }),
});

const bolgeler = defineCollection({
  loader: file('src/veri/bolgeler.yaml'),
  schema: z.object({
    isim: z.string(),
    sira: z.number().int(), // grafikte soldan sağa sütun sırası
    ek: z.boolean().default(false), // araştırmanın 7 bölgesinden değil; sadece imamları yerleştirmek için
    renk: z.string(),
    renk_koyu: z.string(), // koyu temada kullanılacak ton
    enlem: z.number(),
    boylam: z.number(),
    aciklama: z.string(),
  }),
});

export const collections = { raviler, bolgeler };
