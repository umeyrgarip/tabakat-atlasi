// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// GitHub Pages: site https://umeyrgarip.github.io/tabakat-atlasi/ adresinde yayımlanır.
// Sitedeki bütün bağlantılar yol() ile bu alt klasöre göre üretilir (src/lib/veri.ts).
export default defineConfig({
  site: 'https://umeyrgarip.github.io',
  base: '/tabakat-atlasi',
});
