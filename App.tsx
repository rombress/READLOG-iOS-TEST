import { StyleSheet, Text, View } from 'react-native';

import appConfig from './app.json';

// Version lue depuis app.json (même source que CFBundleShortVersionString / CFBundleVersion
// générés par `expo prebuild`). Aucune logique métier READLOG ici : écran de test uniquement.
const VERSION = appConfig.expo.version;
const BUILD = appConfig.expo.ios.buildNumber;

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>READLOG — TEST iOS</Text>
      <Text style={styles.version}>
        Version {VERSION} (build {BUILD})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },
  version: {
    marginTop: 12,
    fontSize: 16,
    color: '#555555',
  },
});
