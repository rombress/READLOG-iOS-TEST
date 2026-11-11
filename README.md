# READLOG-iOS-TEST

Mini-projet **jetable** dont le seul but est de vérifier cette chaîne, à **0 €** :

```
Windows (code)  →  GitHub Actions macOS (compilation non signée)  →  IPA (artefact)
                →  AltServer Windows + compte Apple gratuit (signature)  →  iPhone
```

Ce n'est **pas** READLOG. L'application affiche uniquement :

> **READLOG — TEST iOS**
> Version 0.1.0 (build 1)

Aucune fonctionnalité métier, aucune permission, aucun réseau, aucun SDK tiers.

## Statut

| Étape | Statut |
|---|---|
| Code TypeScript + config Expo | ✅ vérifié localement (`tsc`, `expo-doctor` 20/20) |
| Projet natif iOS (`expo prebuild`) | ✅ généré sur le runner macOS (impossible sous Windows) |
| Compilation + IPA sur GitHub Actions | ✅ compilé et inspecté en CI (2026-11-11) |
| Installation via AltServer sur iPhone | ✅ **testé sur iPhone physique (2026-11-11)** : l'app affiche « READLOG — TEST iOS » et la version. Uniquement avec un **identifiant Apple secondaire**, car le compte principal a été verrouillé par Apple |
| Rafraîchissement avant expiration (7 jours) | ⏳ à tester avant le 2026-11-18 |

Le détail est dans [docs/TEST-RESULTS.md](docs/TEST-RESULTS.md).

## Stack

- Expo SDK 58 (React Native 0.88, React 19.3) avec TypeScript
- Node.js ≥ 22.13 (testé en local avec Node 24)
- Runner `macos-26` (Xcode 26.6 par défaut ; Expo SDK 58 exige Xcode ≥ 26.4)
- iPhone sous **iOS 16.4 minimum** (minimum d'Expo SDK 58)

## Fichiers

| Fichier | Rôle |
|---|---|
| `App.tsx` | l'unique écran |
| `index.ts` | point d'entrée Expo (`registerRootComponent`) |
| `app.json` | nom, version, bundle ID `com.readlog.iostest`, iOS seulement |
| `package.json` / `package-lock.json` | dépendances verrouillées (`npm ci` en CI) |
| `.github/workflows/ios-test.yml` | build non signé et IPA sur macOS |
| `docs/TEST-PROTOCOL.md` | protocole de test pas à pas |
| `docs/IOS-DISTRIBUTION.md` | pourquoi AltServer, limites du compte gratuit, alternatives |
| `docs/TEST-RESULTS.md` | résultats observés, à remplir |

## Commandes Windows (PowerShell)

```powershell
cd <chemin-vers>\READLOG-iOS-TEST
npm ci                 # installe exactement les versions du lockfile
npm run typecheck      # vérification TypeScript
npm run doctor         # diagnostic Expo
```

> **Erreur « l'exécution de scripts est désactivée sur ce système » (`npm.ps1`) ?**
> C'est la politique d'exécution de PowerShell, pas le projet. Deux solutions :
> - remplacer `npm` par `npm.cmd` (et `npx` par `npx.cmd`), sans rien modifier au système ;
> - ou, une fois pour toutes et pour votre compte seulement :
>   `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

`npm run prebuild:ios` **échoue volontairement sous Windows** : Expo ne génère le projet iOS que sous macOS ou Linux. Ce n'est pas un bug, c'est la raison d'être du runner macOS.

## Mise en ligne sur GitHub

1. Créez un dépôt **public** vide sur github.com, nommé par exemple `READLOG-iOS-TEST`, sans README ni .gitignore. Les runners macOS standard sont gratuits sans limite sur un dépôt public. Sur un dépôt privé, ils consomment le quota de minutes gratuites du compte, puis deviennent payants.
2. Dans ce dossier :
   ```powershell
   git init -b main          # dépôt Git propre à ce projet (si ce n'est pas déjà fait)
   git add .
   git status                # vérifier : ni node_modules/, ni ios/, ni build/, ni *.ipa
   git commit -m "READLOG-iOS-TEST: initial"
   git remote add origin https://github.com/<votre-compte>/READLOG-iOS-TEST.git
   git push -u origin main
   ```
3. Le push sur `main` lance le workflow. On peut aussi le lancer depuis **Actions → ios-test → Run workflow**.
4. Une fois le job vert, ouvrez le run et descendez à **Artifacts**. Téléchargez `READLOG-iOS-TEST-unsigned-ipa` : c'est un `.zip` qui contient l'`.ipa` et son `.sha256`.
5. Suivez [docs/TEST-PROTOCOL.md](docs/TEST-PROTOCOL.md) pour l'installation avec AltServer.

## Sécurité

Aucun identifiant Apple, mot de passe, certificat, profil de provisionnement ni token n'est utilisé par le workflow ou stocké dans le dépôt. La signature a lieu **uniquement sur votre PC**, dans AltServer. Le `.gitignore` exclut `*.p12`, `*.p8`, `*.cer`, `*.mobileprovision`, `*.ipa` et `.env*`.
