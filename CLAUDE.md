# CLAUDE.md — READLOG-iOS-TEST

## Objectif (unique)

Prouver qu'une app iOS native peut être écrite sous Windows, compilée gratuitement sur un runner macOS GitHub Actions, empaquetée en IPA, puis signée et installée sur iPhone avec **AltServer Windows + compte Apple gratuit**. Ce n'est **pas** READLOG.

## Règles strictes

- **Budget 0 €.** Pas d'Apple Developer Program, pas d'EAS Build ni d'Ad Hoc Distribution, pas d'API ni de service payant, pas de runner macOS « larger » (ceux-là sont facturés).
- **Aucune fonctionnalité métier.** Un seul écran : `READLOG — TEST iOS` et la version.
- **Aucune permission.** N'ajoutez aucune clé `NS*UsageDescription`, aucun `UIBackgroundModes`, aucune capability ni entitlement (push, iCloud, App Groups…). Un compte gratuit ne les supporte pas tous, et elles sont inutiles ici.
- **Aucun secret dans Git** : identifiant Apple, mot de passe, certificat, `.p12`, `.mobileprovision`, token. Le workflow n'utilise aucun secret.
- **Honnêteté des résultats.** Un IPA produit par la CI n'est pas « installable » tant que le test réel sur iPhone n'est pas consigné dans `docs/TEST-RESULTS.md`. Distinguez toujours *compilé*, *vérifié* et *testé sur appareil*.
- Si une étape s'avère impossible gratuitement, arrêtez-vous et documentez le blocage. Proposez une alternative gratuite marquée « non validée ».

## Technique

- Expo SDK 58, React Native 0.88, TypeScript. Ajoutez une dépendance avec `npx expo install <pkg>`, et seulement si c'est indispensable (en principe, jamais).
- `ios/` est **généré** par `expo prebuild` sur le runner. Il est ignoré par Git et ne s'édite jamais à la main. La config passe par `app.json`.
- `expo prebuild --platform ios` **ne fonctionne pas sous Windows**. C'est attendu.
- Le workflow détecte dynamiquement le nom du workspace, du scheme et du `.app` : ne codez pas `READLOGiOSTEST` en dur.
- Runner : `macos-26`, car Expo SDK 58 exige Xcode ≥ 26.4 et `macos-15` ne dépasse pas 26.3. Le workflow vérifie la version d'Xcode.
- Build : `xcodebuild … -configuration Release -sdk iphoneos CODE_SIGNING_ALLOWED=NO`, puis `Payload/<App>.app` est zippé en `.ipa`.
- Version affichée : lue depuis `app.json` (`expo.version`, `expo.ios.buildNumber`). Pour changer de version, modifiez seulement `app.json`.

## Vérifications avant de déclarer une tâche finie

```powershell
npm ci
npm run typecheck
npm run doctor
```

Pour la partie iOS, seul le run GitHub Actions fait foi, puis le test sur iPhone (`docs/TEST-PROTOCOL.md`).
