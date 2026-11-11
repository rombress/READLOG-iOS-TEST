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
| 2 | Build Release `iphoneos` non signé sur `macos-26` | compilé | ⏳ | | ID du run : |
| 2b | Inspection IPA (Payload/, main.jsbundle, arm64, Info.plist, 0 permission) | vérifié (CI) | ⏳ | | |
| 3 | Téléchargement de l'artefact + SHA-256 | vérifié (manuel) | ⏳ | | |
| 4 | iTunes / iCloud (site Apple) + AltServer sur Windows | manuel | ⏳ | | version AltServer : |
| 5 | AltStore installé, profil approuvé, Mode développeur | appareil | ⏳ | | modèle d'iPhone / iOS : |
| 6 | IPA installé via AltServer/AltStore | appareil | ⏳ | | méthode A ou B : |
| 7 | App lancée : « READLOG — TEST iOS » + « Version 0.1.0 (build 1) » | appareil | ⏳ | | capture : |
| 8 | Rafraîchissement avant J+7 | appareil | ⏳ | | |

## Conclusion

**Chaîne non validée à ce jour.** Seules les vérifications locales sous Windows ont été faites. La compilation macOS et l'installation sur iPhone restent à exécuter.

## Journal

<!-- Ajoutez une entrée par tentative : date, ce qui a été fait, résultat, message d'erreur exact. -->
