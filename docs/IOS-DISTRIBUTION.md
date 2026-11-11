# Distribution iOS à 0 € — choix et limites

## Pourquoi cette chaîne

| Besoin | Solution gratuite retenue | Solution écartée (et pourquoi) |
|---|---|---|
| Un Mac pour compiler | Runner GitHub Actions `macos-26`, gratuit en **dépôt public** | Mac physique, cloud Mac payant |
| Générer le projet iOS | `expo prebuild` sur le runner | `expo prebuild` sous Windows : refusé par Expo (« Run npx expo prebuild again from macOS or Linux ») |
| Compiler | `xcodebuild` Release `iphoneos` avec `CODE_SIGNING_ALLOWED=NO` | EAS Build : la sortie installable exige un compte Apple Developer payant |
| Signer | AltServer (Windows) avec **compte Apple gratuit**, sur le PC | Ad Hoc, TestFlight, Enterprise : abonnement de 99 $/an |
| Installer | AltStore/AltServer | App Store : abonnement payant |

**Principe :** la CI produit un IPA **non signé**, qui ne contient aucun secret. AltServer le **re-signe** localement avec un certificat de développement gratuit, émis par Apple au nom de votre identifiant Apple.

## Coûts GitHub Actions

- **Dépôt public** : les runners standard, macOS compris, sont gratuits.
- **Dépôt privé** : les minutes macOS sont décomptées du quota inclus dans le plan, puis facturées (0,062 $/min pour macOS, selon la documentation GitHub de facturation consultée le 2026-11-11). Restez en **public** pour garantir le 0 €, et réglez une limite de dépense à 0 $ si vous passez en privé.
- N'utilisez jamais les labels `-large`, `-xlarge` ou `-intel` « larger » : ils sont facturés même en public.

## Limites connues du compte Apple gratuit

Ces limites sont documentées publiquement par AltStore et la communauté. Elles ne sont **pas encore vérifiées** sur ce projet.

- La signature **expire après 7 jours**. Il faut un rafraîchissement depuis AltStore avec AltServer actif sur le même réseau.
- **3 apps** signées actives au maximum par appareil, AltStore compris.
- **10 App IDs** au maximum par période de 7 jours.
- Pas de capabilities avancées (push, iCloud, Sign in with Apple, App Groups étendus…). Ce projet n'en utilise aucune.
- iOS ≥ 16 : le **Mode développeur** doit être activé sur l'iPhone.
- Il est possible qu'AltStore modifie le bundle identifier (`com.readlog.iostest`) pour le rendre unique à votre équipe. *Hypothèse non vérifiée : à observer pendant le test.*

## Identifiants Apple

- Saisis **uniquement dans AltServer**, sur votre PC. Jamais dans le dépôt, jamais dans les secrets GitHub.
- Un identifiant Apple **secondaire**, dédié aux tests, est recommandé.

## Si AltServer échoue : alternatives gratuites (non validées)

À n'essayer qu'en cas de blocage, en consignant le résultat dans TEST-RESULTS.md :

1. **Sideloadly** (Windows, gratuit) : il signe un IPA avec un identifiant Apple gratuit, en USB. Les mêmes limites (7 jours, 3 apps) s'appliquent.
2. **SideStore** : un fork d'AltStore qui rafraîchit les apps sans PC, via un VPN local. Il demande quand même un ordinateur pour l'installation initiale (fichier d'appairage).
3. **Simulateur iOS sur le runner** : la CI peut compiler pour `iphonesimulator` et lancer l'app dans le simulateur, avec capture d'écran. Cela prouve que l'app *tourne*, mais **pas** qu'elle s'installe sur un iPhone. Ce n'est donc pas un substitut au test physique.

Aucune de ces alternatives n'est présentée ici comme fonctionnelle : elles n'ont pas été testées.
