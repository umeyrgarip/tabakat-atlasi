import { getCollection, type CollectionEntry } from 'astro:content';

export type Ravi = CollectionEntry<'raviler'>;
export type Bolge = CollectionEntry<'bolgeler'>;

export const TABAKALAR: Record<Ravi['data']['tabaka'], string> = {
  sahabe: 'Sahâbe',
  tabiin: 'Tâbiîn',
  'etbau-t-tabiin': "Etbâu't-tâbiîn",
  'tebe-i-etbai-t-tabiin': "Tebe-i etbâi't-tâbiîn",
  sonraki: 'Sonraki dönem',
};

/** İmam etiketi: "Hanefî mezhebi imamı" gibi */
export function imamEtiketi(r: Ravi) {
  return r.data.imam ? `${r.data.imam.mezheb} mezhebi imamı` : '';
}

/** Araştırma listesindeki kişiler biyografiye sahiptir; sadece imam olarak eklenenlerin biyografisi yoktur. */
export const listedeMi = (r: Ravi) => !!r.data.biyografi;

/** Site kök yolunu (GitHub Pages alt dizini) hesaba katarak bağlantı üretir. */
export function yol(p = '') {
  const kok = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${kok}/${p.replace(/^\//, '')}`;
}

export function tarihYaz(t?: { hicri?: number; miladi?: number }) {
  if (!t || (t.hicri == null && t.miladi == null)) return '?';
  return [t.hicri ?? '?', t.miladi ?? '?'].join('/');
}

export type Kaynak = string | { ad: string; url?: string };
export const kaynakAdi = (k: Kaynak) => (typeof k === 'string' ? k : k.ad);
export const kaynakUrl = (k: Kaynak) => (typeof k === 'string' ? undefined : k.url);

export interface Kenar {
  hoca: string;
  talebe: string;
  araci?: string;
  tur: 'rivayet' | 'fikih' | 'akrabalik';
  ihtilafli: boolean;
  kaynak?: Kaynak;
  not?: string;
}

/** Akrabalık bağlantıları ilim aktarımı sayılmaz: zincir hesaplarına ve bölge tablosuna girmez. */
export const ilimBagi = (k: Kenar) => k.tur !== 'akrabalik';

export interface Veri {
  raviler: Ravi[];
  bolgeler: Bolge[];
  ravi: Map<string, Ravi>;
  bolge: Map<string, Bolge>;
  kenarlar: Kenar[];
  talebeleri: Map<string, Kenar[]>;
  imamlar: Ravi[];
  liste: Ravi[];
}

let onbellek: Promise<Veri> | undefined;

export function veriYukle(): Promise<Veri> {
  return (onbellek ??= yukle());
}

async function yukle(): Promise<Veri> {
  const raviler = (await getCollection('raviler')).sort(
    (a, b) => (a.data.vefat?.hicri ?? 9999) - (b.data.vefat?.hicri ?? 9999),
  );
  const bolgeler = (await getCollection('bolgeler')).sort((a, b) => a.data.sira - b.data.sira);
  const ravi = new Map(raviler.map((r) => [r.id, r]));
  const bolge = new Map(bolgeler.map((b) => [b.id, b]));

  // Yazım hatalarını derleme sırasında yakala: olmayan kişi/bölge adı varsa site kurulmaz.
  const hatalar: string[] = [];
  const kenarlar: Kenar[] = [];
  for (const r of raviler) {
    for (const b of [r.data.bolge, ...r.data.diger_bolgeler]) {
      if (!bolge.has(b)) hatalar.push(`${r.id}.yaml: "${b}" diye bir bölge yok`);
    }
    for (const h of r.data.hocalari) {
      if (!ravi.has(h.kisi)) hatalar.push(`${r.id}.yaml: "${h.kisi}" diye bir ravi dosyası yok`);
      else
        kenarlar.push({
          hoca: h.kisi,
          talebe: r.id,
          araci: h.araci,
          tur: h.tur,
          ihtilafli: h.ihtilafli,
          kaynak: h.kaynak,
          not: h.not,
        });
    }
  }
  if (hatalar.length) throw new Error('Veri hataları:\n  ' + hatalar.join('\n  '));

  const talebeleri = new Map<string, Kenar[]>();
  for (const k of kenarlar) {
    if (!talebeleri.has(k.hoca)) talebeleri.set(k.hoca, []);
    talebeleri.get(k.hoca)!.push(k);
  }

  // Önce günümüze ulaşan dört mezheb, sonra diğerleri; her grup kendi içinde vefat sırasına göre
  const imamlar = raviler
    .filter((r) => r.data.imam)
    .sort((a, b) => Number(b.data.imam!.yasayan) - Number(a.data.imam!.yasayan));
  const liste = raviler.filter(listedeMi);
  return { raviler, bolgeler, ravi, bolge, kenarlar, talebeleri, imamlar, liste };
}

/**
 * İki ravi arasındaki en kısa yolu bulur (BFS).
 * yon: 'asagi' = hocadan talebeye, 'yukari' = talebeden hocaya, 'her' = yönsüz.
 */
export function enKisaYol(v: Veri, bas: string, hedef: string, yon: 'asagi' | 'yukari' | 'her') {
  const komsular = (id: string) => {
    const asagi = (v.talebeleri.get(id) ?? []).filter(ilimBagi).map((k) => k.talebe);
    const yukari = v.ravi.get(id)!.data.hocalari.filter((h) => h.tur !== 'akrabalik').map((h) => h.kisi);
    return yon === 'asagi' ? asagi : yon === 'yukari' ? yukari : [...asagi, ...yukari];
  };
  const onceki = new Map<string, string | null>([[bas, null]]);
  const kuyruk = [bas];
  while (kuyruk.length) {
    const id = kuyruk.shift()!;
    if (id === hedef) break;
    for (const n of komsular(id)) {
      if (!onceki.has(n)) {
        onceki.set(n, id);
        kuyruk.push(n);
      }
    }
  }
  if (!onceki.has(hedef)) return null;
  const yolu: string[] = [];
  for (let id: string | null = hedef; id; id = onceki.get(id)!) yolu.unshift(id);
  return yolu;
}

export type ImamBaglantisi = {
  imam: Ravi;
  tur: 'kendisi' | 'senedinde' | 'talebe-zinciri' | 'dolayli' | 'yok';
  yol: string[];
};

/** Bir ravinin her mezheb imamıyla bağlantısı: imamın senedinde mi, imamdan mı rivayet ediyor? */
export function imamBaglantilari(v: Veri, id: string): ImamBaglantisi[] {
  return v.imamlar.map((imam) => {
    if (imam.id === id) return { imam, tur: 'kendisi', yol: [id] };
    // Ravi → ... → imam: ravi, imamın hoca zincirinde (senedinde) yer alıyor
    const asagi = enKisaYol(v, id, imam.id, 'asagi');
    if (asagi) return { imam, tur: 'senedinde', yol: asagi };
    // İmam → ... → ravi: ravi, imamdan gelen bir talebe zincirinde
    const yukari = enKisaYol(v, imam.id, id, 'asagi');
    if (yukari) return { imam, tur: 'talebe-zinciri', yol: yukari };
    const dolayli = enKisaYol(v, id, imam.id, 'her');
    if (dolayli) return { imam, tur: 'dolayli', yol: dolayli };
    return { imam, tur: 'yok', yol: [] };
  });
}

/** Cytoscape'e verilecek düğüm ve kenarlar. */
export function grafVerisi(v: Veri, idler?: Set<string>) {
  const dahil = (id: string) => !idler || idler.has(id);
  return {
    dugumler: v.raviler
      .filter((r) => dahil(r.id))
      .map((r) => ({
        id: r.id,
        isim: r.data.isim,
        bolge: r.data.bolge,
        tabaka: r.data.tabaka,
        vefat: r.data.vefat?.hicri ?? null,
        imam: r.data.imam ? (r.data.imam.yasayan ? 'yasayan' : 'diger') : null,
        mezheb: r.data.imam?.mezheb ?? null,
        ozet: r.data.ozet,
      })),
    kenarlar: v.kenarlar
      .filter((k) => dahil(k.hoca) && dahil(k.talebe))
      .map((k) => ({
        hoca: k.hoca,
        talebe: k.talebe,
        araci: k.araci ?? null,
        tur: k.tur,
        ihtilafli: k.ihtilafli,
        not: k.not ?? null,
      })),
    bolgeler: v.bolgeler.map((b) => ({
      id: b.id,
      isim: b.data.isim,
      sira: b.data.sira,
      renk: b.data.renk,
      renkKoyu: b.data.renk_koyu,
    })),
  };
}

export type GrafVerisi = ReturnType<typeof grafVerisi>;
