# Rapport de vérification — Déploiement portfolio

**Date :** 28 août 2026  
**Projet :** `portfolio-aristide` / repo `MeleAris/melearis.github.io` (branche `v3`)  
**URLs testées :**
- Production Cloudflare Pages : https://amelesusu.pages.dev
- Domaine custom (en cours) : https://amelesusu.me
- GitHub Pages (déploiement parallèle) : https://melearis.github.io

**Outils utilisés :** GitHub MCP, Firebase MCP, plugins Cloudflare (Workers), Playwright, requêtes HTTP/DNS.

---

## Synthèse

| Zone | Statut global |
|------|---------------|
| Cloudflare Pages (`.pages.dev`) | ✅ Prêt pour tests publics |
| Domaine custom `amelesusu.me` | ⏳ Trop tôt — DNS non propagé |
| GitHub / CI | ✅ OK |
| Firebase (backend) | ✅ OK (avec réserves mineures) |
| Contenu public | ⚠️ 2 sections absentes (portfolio + galerie vides) |

**Verdict :** Tu peux déjà partager **https://amelesusu.pages.dev** pour un aperçu. Attends la propagation DNS avant de partager **amelesusu.me**. Complète le contenu Firestore (works + gallery) si tu veux afficher toutes les sections.

---

## 1. Domaine & DNS

| Vérification | Statut | Détail |
|--------------|--------|--------|
| Résolution DNS `amelesusu.me` | ⏳ En attente | Aucun enregistrement A/NS retourné au moment du test (`Could not resolve host`) |
| Résolution DNS `www.amelesusu.me` | ⏳ En attente | Idem — domaine tout juste acheté |
| HTTPS sur le domaine custom | ⏳ En attente | Impossible à tester tant que le DNS ne pointe pas |
| Redirection apex ↔ www | ⏳ En attente | À revérifier une fois le DNS actif |
| Domaine custom actif dans Cloudflare Pages | 🔍 Non vérifiable | Les plugins Cloudflare disponibles couvrent Workers/KV/D1, pas l'API Cloudflare Pages |

**Note :** Normal pour un domaine fraîchement acheté. Délai habituel : quelques minutes à 48 h.

---

## 2. Cloudflare Pages (production actuelle)

| Vérification | Statut | Détail |
|--------------|--------|--------|
| Site accessible en HTTPS | ✅ | `https://amelesusu.pages.dev/` → HTTP 200, certificat Cloudflare OK |
| Page d'accueil charge le bundle React | ✅ | Titre : « Aristide — Développeur full stack » |
| Assets JS/CSS | ✅ | `/assets/index-vVJub1AA.js` et `/assets/index-BQdl92N1.css` → HTTP 200 |
| Favicon | ✅ | `/assets/min-B9y6DJHj.png` référencé dans le HTML |
| Données Firebase chargées côté client | ✅ | Sections visibles : accueil, à propos, expérience, services, contact |
| Erreurs console sur `/` | ✅ | Aucune erreur détectée |
| Route SPA `/admin/login` | ⚠️ Partiel | La page s'affiche et le bouton Google est présent, **mais le serveur renvoie HTTP 404** sur l'URL document |
| Refresh direct `/admin/login` (curl) | ⚠️ | HTTP 404 — pas de fallback SPA propre côté Cloudflare (pas de fichier `_redirects`) |
| Plugin Cloudflare — déploiements Pages | 🔍 Non vérifiable | `workers_list` → 0 workers ; pas d'outil Pages dans les plugins |

**Recommandation :** Ajouter un fallback SPA Cloudflare (`/* /index.html 200` dans `public/_redirects`) pour corriger le statut HTTP 404 sur les routes React (`/admin`, `/admin/login`, etc.).

---

## 3. GitHub & CI/CD

| Vérification | Statut | Détail |
|--------------|--------|--------|
| Repo connecté | ✅ | `MeleAris/melearis.github.io`, branche active locale : `v3` |
| Workflow de déploiement | ✅ | `.github/workflows/deploy-pages.yml` présent sur `v3` |
| Dernier run GitHub Actions | ✅ | Run #6 — **success** (21 août 2026, commit `570db15`) |
| Build Vite + artefact `dist` | ✅ | Configuré dans le workflow |
| Secrets Firebase en CI | ✅ | Le workflow **échoue** si un des 7 secrets `VITE_FIREBASE_*` est vide |
| GitHub Pages (déploiement parallèle) | ✅ | `https://melearis.github.io/` → HTTP 200 (dernière modif : 21 août 2026) |

**Note :** Le workflow GitHub déploie vers **GitHub Pages**, pas directement vers Cloudflare. Cloudflare Pages est alimenté séparément via la connexion GitHub → Cloudflare. Les deux hébergements semblent servir la même app React v3.

---

## 4. Firebase — Projet & configuration

| Vérification | Statut | Détail |
|--------------|--------|--------|
| Projet actif | ✅ | `portfolio-aristide` — état `ACTIVE`, billing activé |
| Utilisateur authentifié CLI | ✅ | `amelesusu@gmail.com` |
| Firestore — région | ✅ | `europe-west1` (Standard) |
| App web enregistrée | ✅ | App ID `1:556555611940:web:f2ce3064c4b41781ea4db1` |
| Config SDK | ✅ | Récupérée via Firebase MCP |
| Bundle prod contient la config Firebase | ✅ | Clés `apiKey` présentes dans le JS de production |
| Domaines autorisés (fichier local `firebase.json`) | ⚠️ | `amelesusu.me` et `amelesusu.pages.dev` listés — **`www.amelesusu.me` absent** |
| Domaines autorisés (console Firebase live) | 🔍 Non vérifiable | Le MCP expose `firebase.json` local ; confirmer dans Firebase Console → Authentication → Authorized domains |
| App Check / reCAPTCHA Enterprise | 🔍 Non vérifiable | Variable `VITE_FIREBASE_APPCHECK_SITE_KEY` requise au build ; domaine custom à enregistrer dans reCAPTCHA Enterprise quand DNS actif |
| Google Sign-In sur `.pages.dev` | ✅ | Domaine `amelesusu.pages.dev` dans `firebase.json` |
| Google Sign-In sur `amelesusu.me` | ⏳ | Domaine listé localement ; à valider une fois le DNS actif |

---

## 5. Firebase — Sécurité (rules)

| Vérification | Statut | Détail |
|--------------|--------|--------|
| Syntaxe Firestore rules (local) | ✅ | Validation MCP : aucune erreur |
| Syntaxe Storage rules (local) | ✅ | Validation MCP : aucune erreur |
| Rules Firestore déployées | ✅ | Identiques au repo local — lecture publique CMS, écriture admin only |
| Rules Storage déployées | ✅ | Lecture publique `/uploads/**`, écriture admin only (images < 11 Mo) |
| Lecture publique Firestore | ✅ | `GET /documents/site/profile` → HTTP 200 sans auth |
| Collection `admins` | ✅ | **1 document** — email `amelesusu@gmail.com` (UID `UF7dEnUv…`) |
| Bootstrap admin côté client | ✅ | `allow create: if false` sur `/admins/{uid}` |

**Modèle de sécurité conforme** pour un portfolio CMS : contenu public en lecture, admin protégé.

---

## 6. Firebase — Contenu Firestore

| Collection | Statut | Détail |
|------------|--------|--------|
| `site/profile` | ✅ | brandName « MKA », fullName « Aristide », jobTitle « Full stack et DevOps » |
| `hero/main` | ✅ | Portrait Firebase Storage configuré |
| `experiences/*` | ✅ | 3 expériences (ATOS, CNTD, Give Smile) |
| `services/*` | ✅ | Au moins 1 service (mobile) |
| `socialLinks/*` | ✅ | LinkedIn + WhatsApp |
| `stackLogos/*` | ✅ | Logos tech présents (TypeScript, Helm, NGINX, …) |
| `aboutStats/*` | ✅ | « 3+ années d'expérience » |
| `works/*` (portfolio) | ⚠️ **Vide** | Section Portfolio **masquée** sur le site (`works.length === 0`) |
| `gallery/*` | ⚠️ **Vide** | Bandeau galerie/certifications **masqué** |

**Recommandation :** Ajouter du contenu dans `works` et `gallery` via l'admin (`/admin`) avant de partager le portfolio complet.

---

## 7. Site public — Tests live (`amelesusu.pages.dev`)

| Vérification | Statut | Détail |
|--------------|--------|--------|
| Titre & meta | ✅ | Titre + balise Google Search Console présents |
| Hero | ✅ | « Hello » affiché, données CMS chargées |
| Sections principales | ✅ | 5 sections visibles (sans portfolio ni galerie) |
| Liens sociaux | ✅ | Données Firestore OK (LinkedIn, WhatsApp) |
| Formulaire contact (Formspree) | ✅ | URL configurée : `https://formspree.io/f/xzbopavr` |
| Test mobile | 🔍 Non fait | À tester manuellement sur téléphone |
| Lighthouse / perf | 🔍 Non fait | Hors scope de cette vérification automatisée |

---

## 8. Admin

| Vérification | Statut | Détail |
|--------------|--------|--------|
| Page `/admin/login` accessible | ⚠️ | UI OK, statut HTTP 404 |
| Bouton « Continuer avec Google » | ✅ | Présent |
| Protection `/admin` | ✅ | `RequireAuth` + vérification doc `admins/{uid}` |
| Rejet comptes non-admin | ✅ | Logique `signOut` si pas dans `admins` |
| Login Google sur domaine custom | ⏳ | À tester quand `amelesusu.me` sera actif |
| Upload images admin | 🔍 Non testé | Rules Storage OK en théorie ; test manuel recommandé |

---

## 9. Points à revérifier plus tard (domaine custom)

Quand `amelesusu.me` résoudra en DNS :

- [ ] `https://amelesusu.me` → HTTP 200, certificat SSL valide
- [ ] `https://www.amelesusu.me` → fonctionne ou redirige vers l'apex
- [ ] Redirection HTTP → HTTPS
- [ ] Domaine **Active** dans Cloudflare Pages → Custom domains
- [ ] `amelesusu.me` (et `www` si utilisé) dans Firebase Auth → Authorized domains
- [ ] Domaine enregistré dans reCAPTCHA Enterprise (App Check)
- [ ] Connexion Google admin sur le domaine custom
- [ ] Partage du lien sur LinkedIn / WhatsApp (aperçu OK)

---

## 10. Actions recommandées (par priorité)

### Avant de partager le domaine custom
1. ⏳ Attendre la propagation DNS (normal, domaine récent)
2. Configurer apex + www dans Cloudflare Pages et Firebase Auth
3. Tester `https://amelesusu.me` une fois le DNS actif

### Avant de partager le portfolio « complet »
4. Remplir les collections Firestore `works` et `gallery` via l'admin
5. Ajouter un fallback SPA (`public/_redirects`) pour corriger les HTTP 404 sur `/admin/*`

### Optionnel
6. Décider si tu gardes **GitHub Pages** (`melearis.github.io`) en parallèle ou si tu rediriges vers le domaine custom
7. Ajouter `www.amelesusu.me` dans `firebase.json` → `authorizedDomains` si tu utilises le sous-domaine www
8. Lancer `firebase deploy` (auth + rules) si les domaines autorisés ne sont pas encore poussés en prod

---

## Limites de cette vérification

- **Cloudflare Pages** : pas d'API Pages dans les plugins MCP disponibles (Workers/KV/D1 uniquement). Vérifications Cloudflare faites via HTTP, DNS et Playwright.
- **Firebase Auth domains / App Check** : configuration console non exposée directement par le MCP ; seules les rules déployées et le contenu Firestore ont été vérifiés live.
- **Secrets GitHub** : présence validée par la logique CI (build réussi), valeurs non inspectées.
- **Tests manuels** : mobile, perf Lighthouse, upload admin, Formspree end-to-end non exécutés.

---

*Rapport généré automatiquement le 28/08/2026.*
