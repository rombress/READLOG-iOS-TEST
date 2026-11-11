# Résultats de test — READLOG-iOS-TEST

Légende : ✅ OK · ❌ KO · ⏳ non exécuté · ⚠️ OK avec réserve

Distinction stricte :
- **Compilé** : la CI a produit l'artefact.
- **Vérifié** : un contrôle automatique ou manuel a confirmé une propriété (structure, arch, version…).
- **Testé sur appareil** : observé sur un iPhone physique.

## Synthèse

| # | Étape (cf. TEST-PROTOCOL.md) | Type | Statut | Date | Preuve / notes |
|---|---|---|---|---|---|
| 1a | `npm install` + lockfile généré | vérifié (local) | ✅ | 2026-11-11 | Windows 11, Node 24.20.0, npm 11.19.0 |
| 1b | `tsc --noEmit` | vérifié (local) | ✅ | 2026-11-11 | 0 erreur |
| 1c | `expo-doctor` | vérifié (local) | ✅ | 2026-11-11 | 20/20 checks passed |
| 1e | `expo export --platform ios` (bundle JS iOS) | vérifié (local) | ✅ | 2026-11-11 | bundle Hermes `.hbc` de 1,5 Mo produit sous Windows |
| 1d | `expo prebuild --platform ios` sous Windows | — | ❌ attendu | 2026-11-11 | refusé par Expo sous Windows, donc fait sur le runner macOS |
| 2 | Build Release `iphoneos` non signé sur `macos-26` | compilé | ✅ | 2026-11-11 | l'artefact IPA a été produit. ID du run : *à compléter* |
| 2b | Inspection IPA (Payload/, main.jsbundle, arm64, Info.plist, 0 permission) | vérifié (CI) | ✅ | 2026-11-11 | l'étape *Inspect IPA* précède l'upload et bloque en cas d'erreur : l'artefact n'existe que si elle a réussi. Avertissements éventuels sur les permissions : *non relevés* |
| 3 | Téléchargement de l'artefact + SHA-256 | vérifié (manuel) | ⚠️ | 2026-11-11 | IPA téléchargé et installé. Comparaison SHA-256 : *non confirmée* |
| 4 | iTunes / iCloud (liens Apple directs) + AltServer sur Windows | manuel | ✅ | 2026-11-11 | une seule instance d'AltServer, iTunes et iCloud ouverts. Version d'AltServer : *à compléter* |
| 5 | AltStore installé, profil approuvé, Mode développeur | appareil | ✅ | 2026-11-11 | 1re tentative (compte principal) : ❌ verrouillage. 2e tentative (**identifiant Apple secondaire**) : ✅. Modèle d'iPhone / iOS : *à compléter* |
| 6 | IPA installé via AltServer/AltStore | appareil | ✅ | 2026-11-11 | méthode A ou B : *à compléter*. Bundle ID affiché par AltStore : *à compléter* |
| 7 | App lancée : « READLOG — TEST iOS » + version | appareil | ✅ | 2026-11-11 | **confirmé par l'utilisateur : l'écran affiche « READLOG — TEST iOS » et la version.** Réouverture après fermeture complète : *non confirmée*. Capture : *à ajouter* (`docs/screenshot-iphone.png`) |
| 8 | Rafraîchissement avant J+7 | appareil | ⏳ | | à faire **avant le 2026-11-18** (AltStore → My Apps → Refresh All, avec AltServer actif) |

## Conclusion

**Chaîne validée sur iPhone physique le 2026-11-11**, avec les réserves listées plus bas :

> Windows (code) → GitHub Actions `macos-26` (build non signé, 0 €) → IPA → AltServer Windows + **identifiant Apple gratuit secondaire** → iPhone : l'app se lance et affiche l'écran attendu.

Réserves :
1. **Risque de compte observé :** le compte Apple principal a été verrouillé par Apple à la première tentative. La chaîne n'a fonctionné qu'avec un **identifiant Apple secondaire dédié**, désormais obligatoire.
2. **Durée de vie non testée :** une signature gratuite expire au bout de 7 jours. Le rafraîchissement (étape 8) n'est pas encore vérifié.
3. **Traçabilité incomplète :** les informations marquées *à compléter* (ID du run, SHA-256, modèle d'iPhone et version d'iOS, version d'AltServer, méthode d'installation) n'ont pas été consignées.
4. **Portée :** l'app de test n'a ni permission, ni capability, ni réseau. Une app réelle (READLOG) qui en demanderait pourrait rencontrer des limites du compte gratuit que ce test ne couvre pas.

## Journal

<!-- Ajoutez une entrée par tentative : date, ce qui a été fait, résultat, message d'erreur exact. -->

### 2026-11-11 — Étape 5, tentative 1 : échec (verrouillage du compte Apple)

- **Contexte :** AltServer pour Windows lancé (deux instances tournaient simultanément), iCloud ouvert, iTunes **fermé**. Compte Apple **principal** utilisé.
- **Action :** AltServer → Install AltStore → iPhone, puis saisie de l'identifiant Apple.
- **Résultat :** message d'Apple « Ce compte Apple a été verrouillé pour des raisons de sécurité ».
- **Cause :** non établie. Hypothèse : l'anti-fraude d'Apple a signalé la connexion d'AltServer, qui se présente comme un appareil Apple. Les deux instances et le fait qu'iTunes soit fermé ont pu y contribuer. *Non vérifié.*
- **Remédiation :** déverrouillage via https://iforgot.apple.com (procédure Apple).
- **Décision pour la suite :** ne plus utiliser le compte principal. Toute nouvelle tentative se fera avec un **identifiant Apple secondaire dédié aux tests**, une seule instance d'AltServer, iTunes et iCloud ouverts, et une seule tentative.

### 2026-11-11 — Étapes 5 à 7, tentative 2 : succès

- **Contexte :** une seule instance d'AltServer (démarrée à 10:47, vérifiée dans la liste des processus), iTunes et iCloud ouverts. **Identifiant Apple secondaire**, différent de celui configuré sur l'iPhone, qui reste connecté à son compte habituel.
- **Action :** AltServer → Install AltStore, puis installation de l'IPA `READLOG-iOS-TEST-unsigned.ipa` issu de l'artefact GitHub Actions.
- **Résultat :** l'app s'installe et se lance. L'écran affiche **« READLOG — TEST iOS »** et la version (confirmé par l'utilisateur).
- **Constat :** un IPA compilé **sans signature** sur un runner macOS gratuit est bien re-signé par AltServer avec un compte gratuit et s'exécute sur iPhone.
