import { File, Paths } from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Alert, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/theme/tokens';

export default function Settings() {
  const router = useRouter();
  const { memories, collections } = useStore();

  const onExport = async () => {
    try {
      const data = {
        app: 'Hey, Love',
        exportedAt: new Date().toISOString(),
        collections,
        memories,
      };
      const file = new File(Paths.cache, `hey-love-${Date.now()}.json`);
      if (file.exists) file.delete();
      file.create();
      file.write(JSON.stringify(data, null, 2));

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Export your keepsakes' });
      } else {
        Alert.alert('Export ready', `Saved to ${file.uri}`);
      }
    } catch (e) {
      Alert.alert('Export failed', 'Something went wrong creating your export.');
    }
  };

  return (
    <Screen>
      <TopBar onBack={() => router.back()} backLabel="Keepsakes" />
      <AppText variant="display">Yours, always.</AppText>

      <View style={styles.section}>
        <AppText variant="serifBody" color={colors.textSecondary}>
          {memories.length} {memories.length === 1 ? 'memory' : 'memories'} kept in{' '}
          {collections.length} {collections.length === 1 ? 'box' : 'boxes'}.
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="heading">Your privacy</AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.cardText}>
          Everything you keep lives on this device. There are no feeds, no followers, no likes, and
          no algorithms. Your voices and moments are never sold, shared, or used to train anything.
          They are simply yours.
        </AppText>
      </View>

      <View style={styles.section}>
        <Button label="Export my keepsakes" onPress={onExport} />
        <AppText variant="small" color={colors.textMuted} style={styles.note} center>
          Exports a readable copy of your memories’ details and notes. Your recordings remain safe on
          your device.
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppText variant="serifBody" color={colors.textMuted} center>
          Capture life. Close the app. Go and live it.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl, gap: spacing.md },
  card: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  cardText: { marginTop: spacing.md, lineHeight: 25 },
  note: { marginTop: spacing.sm },
  footer: { marginTop: spacing.huge, alignItems: 'center' },
});
