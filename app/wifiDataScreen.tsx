import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedScrollView, ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { WifiEntry } from 'react-native-wifi-reborn';

export default function WifiDataScreen() {
  const { _data } = useLocalSearchParams();
  const data: WifiEntry = _data ? JSON.parse(_data as string) : null;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: 'Wifi Details' });
  }, []);

  return (
    <ThemedScrollView>
      <ThemedView style={styles.innerContainer}>
        <ThemedText type='title'>{data.SSID}</ThemedText>

        <ThemedText style={{ fontWeight: 'bold' }}>BSSID:</ThemedText>
        <ThemedText>{data.BSSID}</ThemedText>

        <ThemedText style={{ fontWeight: 'bold' }}>Capabilities:</ThemedText>
        <ThemedText>{data.capabilities}</ThemedText>

        <ThemedText style={{ fontWeight: 'bold' }}>Frequency:</ThemedText>
        <ThemedText>{data.frequency}</ThemedText>

        <ThemedText style={{ fontWeight: 'bold' }}>Level:</ThemedText>
        <ThemedText>{data.level}</ThemedText>

        <ThemedText style={{ fontWeight: 'bold' }}>Timestamp:</ThemedText>
        <ThemedText>{data.timestamp}</ThemedText>
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    marginLeft: 12,
    marginRight: 12,
    paddingTop: 12,
  },
});
