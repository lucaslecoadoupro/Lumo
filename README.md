# Lumo

> Un point de repère pour mieux vivre ta journée au collège.

Application mobile (PWA) pour les élèves ayant un besoin de santé (PAI, allergie, asthme, diabète, épilepsie…), demandée par l'infirmière scolaire. Fonctionne sur **iPhone et Android**, s'installe sur l'écran d'accueil et marche **hors-ligne**.

## Le site

- **`/`** : page de présentation (`index.html`, `src/landing/`), avec une démo interactive de l'appli dans un téléphone, les fonctionnalités, la confidentialité, l'installation (QR code), et l'équipe.
- **`/app/`** : l'appli elle-même (`app/index.html`, `src/main.tsx`). C'est ce lien que les élèves installent.
- **`/app/?demo`** : mode démo avec une élève fictive (Inès). Stockage séparé : ne touche jamais aux vraies données.

## Ce que fait l'appli

**Premier lancement (onboarding)** : prénom, classe, avatar → besoins de santé → pour chaque besoin : traitement, où il se trouve, conduite à tenir (recopiée du PAI) → contacts utiles → emploi du temps (facultatif).

**Onglets**
- **Aujourd'hui** : humeur du jour, rappel les jours de sport, accès à la fiche d'urgence, prochains cours, bouton « Besoin d'aide ? ».
- **Mes besoins** : une pause, l'infirmerie, un aménagement, parler à un adulte… L'élève choisit, puis **montre l'écran** au professeur sans avoir à parler devant la classe.
- **Mes repères** : ma journée (frise des cours), Comprendre (fiches + quiz par besoin), Journal (humeurs, demandes, notes).
- **Moi** : modifier ses infos, installer l'appli, sauvegarder / restaurer, tout effacer.

**Bouton SOS** (partout) : fiche d'urgence générée à partir des infos saisies, contacts en un appui, 15 / 112 / SMS 114.

## Données et RGPD

- **Aucun serveur, aucun compte.** Tout est stocké dans le `localStorage` du téléphone (`src/lib/store.ts`).
- La police est embarquée (pas d'appel à Google Fonts).
- L'appli demande au navigateur un stockage persistant. Sur iPhone, les données sont protégées une fois l'appli **ajoutée à l'écran d'accueil** : c'est à conseiller systématiquement.
- La sauvegarde (`Moi > Sauvegarder`) produit un fichier JSON que l'élève garde lui-même.

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:5173 (et sur le réseau local pour tester sur téléphone)
npm run build      # génère dist/ + le service worker
npm run preview    # teste le build (mode hors-ligne compris)
```

Node 20+ recommandé.

## Déployer sur GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit et publie l'appli à chaque push sur `main`.

1. Créer un dépôt **public** sur GitHub (ex. `lumo`) et y pousser le dossier.
2. Dans le dépôt : **Settings → Pages → Source : GitHub Actions**.
3. Onglet **Actions** : attendre la coche verte (1–2 min).
4. La page de présentation est sur `https://<pseudo>.github.io/lumo/`, l'appli sur `https://<pseudo>.github.io/lumo/app/`.

Le sous-dossier est géré automatiquement (variable `BASE_PATH` = nom du dépôt). Le code est public, mais aucune donnée d'élève ne l'est : tout reste sur les téléphones.

## Déployer sur Vercel (alternative)

1. Pousser le dossier sur un dépôt GitHub.
2. Sur Vercel : *Add New Project* → importer le dépôt. Vercel détecte Vite automatiquement (build `npm run build`, sortie `dist`).
3. Partager l'URL aux élèves : ils l'ouvrent dans **Safari** (iPhone) ou **Chrome** (Android) puis « Ajouter à l'écran d'accueil ».

Astuce : un QR code de l'URL affiché à l'infirmerie simplifie l'installation.

## Structure

```
index.html      Page de présentation
app/index.html  Appli
src/
  landing/      Page de présentation (Landing.tsx)
  lib/
    types.ts      Modèle de données (profil, besoins, contacts, cours, journal)
    store.ts      Stockage local + hook useData()
    content.ts    Textes : besoins, fiches Comprendre, quiz, liste « Mes besoins »
    utils.ts      Dates, téléphone, états des cours
  components/
    ui.tsx        Boutons, champs, bottom sheet, toast, logo
    editors.tsx   Éditeurs partagés (besoins, PAI, contacts, emploi du temps)
    Overlays.tsx  Fiche d'urgence, Besoin d'aide, écran à montrer
  screens/        Onboarding, Aujourd'hui + Mes besoins, Mes repères, Moi
```

Couleurs de la charte (Indigo #6266D9, Lavande, Menthe, Pêche…) dans `tailwind.config.js`.

## À valider avec l'infirmière avant diffusion

- [ ] Relire les fiches **Comprendre** et les quiz (`src/lib/content.ts`).
- [ ] Relire la liste **Mes besoins** et les phrases affichées au professeur.
- [ ] Vérifier avec chaque élève que sa fiche d'urgence correspond à son PAI signé.
- [ ] Informer les familles (l'appli ne remplace pas le PAI).

## Pistes pour la suite

- Code PIN à l'ouverture (données sensibles sur un téléphone partagé).
- Rappels par notification (limités sur iPhone pour les PWA).
- Mode sombre.
- Illustrations de la charte à la place des emojis.
