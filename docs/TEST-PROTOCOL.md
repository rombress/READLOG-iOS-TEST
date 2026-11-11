# Protocole de test — READLOG-iOS-TEST

Chaque étape a un **critère de réussite observable**. Consignez le résultat (OK, KO, notes, captures) dans [TEST-RESULTS.md](TEST-RESULTS.md). En cas d'échec, arrêtez-vous à l'étape en cause : les suivantes en dépendent.

> Les étapes 4 à 7 reposent sur le fonctionnement **documenté publiquement** d'AltStore/AltServer. Elles n'ont pas encore été exécutées sur ce projet. Les libellés exacts des menus peuvent varier selon la version d'AltServer et d'iOS.

---

## Étape 1 — Vérifications locales (Windows)

```powershell
cd <chemin-vers>\READLOG-iOS-TEST
npm ci
npm run typecheck
npm run doctor
```

**Réussite :** `tsc` ne renvoie aucune erreur et `expo-doctor` affiche `20/20 checks passed` (ou l'équivalent).

## Étape 2 — Compilation sur GitHub Actions

1. Poussez le dépôt sur GitHub, en **public** (voir README).
2. Ouvrez **Actions → ios-test** et attendez le run déclenché par le push, ou lancez-le avec **Run workflow**.

**Réussite :** le job `build-unsigned-ipa` est vert et le log de l'étape *Inspect IPA* montre :
- une structure qui commence par `Payload/<Nom>.app/` ;
- `main.jsbundle` présent ;
- `lipo -info` contenant `arm64` ;
- `CFBundleIdentifier = com.readlog.iostest`, `CFBundleShortVersionString = 0.1.0`, `CFBundleVersion = 1` ;
- `Aucune clé de permission.` ;
- aucun fichier `.entitlements` avec des capabilities (push, iCloud…).

**En cas d'échec :** téléchargez l'artefact `xcodebuild-log`, cherchez les lignes `error:` et notez-les dans TEST-RESULTS.md.

## Étape 3 — Récupération de l'IPA

1. Sur la page du run, section **Artifacts**, téléchargez `READLOG-iOS-TEST-unsigned-ipa` (un `.zip`).
2. Décompressez-le, puis vérifiez l'empreinte :
   ```powershell
   Get-FileHash .\READLOG-iOS-TEST-unsigned.ipa -Algorithm SHA256
   Get-Content .\READLOG-iOS-TEST-unsigned.ipa.sha256
   ```

**Réussite :** les deux empreintes SHA-256 sont identiques (comparez sans tenir compte de la casse).

## Étape 4 — Préparation du PC Windows (une seule fois)

1. Installez **iTunes** et **iCloud** depuis le **site d'Apple**, et non depuis le Microsoft Store. AltServer documente cette exigence, car les versions du Store n'exposent pas les composants dont il a besoin.
2. Installez **AltServer pour Windows** depuis le site officiel d'AltStore (altstore.io). Il est gratuit.
3. Branchez l'iPhone en USB, déverrouillez-le et acceptez « Faire confiance à cet ordinateur ».
4. Ouvrez iTunes et vérifiez que l'iPhone apparaît. Activez éventuellement « Synchroniser via Wi-Fi », ce qui est utile pour le rafraîchissement.

**Réussite :** l'icône AltServer apparaît dans la zone de notification et iTunes voit l'iPhone.

## Étape 5 — Préparation de l'iPhone

1. iOS ≥ **16.4** est requis (minimum d'Expo SDK 58) : vérifiez dans Réglages → Général → Informations.
2. Installez AltStore via **AltServer → Install AltStore → \<votre iPhone\>** et saisissez votre identifiant Apple **dans AltServer uniquement**. Un identifiant Apple secondaire, dédié aux tests, est recommandé.
3. Sur l'iPhone, ouvrez **Réglages → Général → VPN et gestion de l'appareil**, puis faites confiance au profil développeur de votre identifiant Apple.
4. Activez le **Mode développeur** dans **Réglages → Confidentialité et sécurité → Mode développeur**, puis redémarrez et confirmez. iOS 16 et suivants l'exigent pour les apps signées avec un certificat de développement.

**Réussite :** AltStore s'ouvre sur l'iPhone.

## Étape 6 — Installation de l'IPA

Deux méthodes possibles. Notez dans TEST-RESULTS.md celle qui a été utilisée.

- **A. Depuis AltStore (sur l'iPhone) :** copiez l'IPA sur l'iPhone, par exemple via iCloud Drive vers l'app Fichiers. Dans AltStore, ouvrez **My Apps → « + »** et choisissez l'IPA. AltServer doit tourner sur le PC, sur le même réseau Wi-Fi ou en USB.
- **B. Depuis AltServer (sur le PC) :** sous Windows, le menu **Install AltStore** accompagné de la touche **Maj** (Shift) enfoncée permet de choisir un `.ipa` (« Sideload .ipa »). *Ce comportement est à confirmer pendant le test.*

**Réussite :** l'icône READLOG-iOS-TEST apparaît sur l'écran d'accueil, sans message d'erreur d'AltServer.

## Étape 7 — Lancement

1. Ouvrez l'app.

**Réussite :**
- l'écran affiche **READLOG — TEST iOS** et **Version 0.1.0 (build 1)** ;
- aucun écran rouge (erreur JS) et aucune tentative de connexion à un serveur Metro ;
- aucune demande de permission n'apparaît ;
- l'app survit à une fermeture complète suivie d'une réouverture.

## Étape 8 — Durée de validité (optionnel)

Avec un compte gratuit, la signature **expire au bout de 7 jours**.
1. Notez la date d'installation.
2. Avant l'expiration, faites **AltStore → My Apps → Refresh All** avec AltServer actif.

**Réussite :** l'app s'ouvre toujours après J+7 grâce au rafraîchissement. Sans rafraîchissement, l'échec à J+7 est le comportement attendu.

---

## Critère global

La chaîne est **validée** seulement si les étapes 1, 2, 3, 6 et 7 sont toutes OK sur un iPhone physique, et consignées dans TEST-RESULTS.md avec la date, la version d'iOS, la version d'AltServer et l'identifiant du run GitHub.
