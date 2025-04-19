import React from 'react';
import { StyleSheet } from 'react-native';
import { BleDeviceData } from '@/app/(tabs)/bluetoothScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedSafeAreaView, ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';

export default function bleDeviceDataScreen() {
  const { data } = useLocalSearchParams();

  const parsedDevice: BleDeviceData = data ? JSON.parse(data as string) : null;
  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.innerContainer}>
        <ThemedText style={{ fontWeight: 'bold' }}>Services:</ThemedText>
        {parsedDevice.services?.map((service) => (
          <ThemedText key={service.uuid}>{service.uuid}</ThemedText>
        ))}

        <ThemedText style={{ fontWeight: 'bold' }}>Characteristics:</ThemedText>
        {parsedDevice.characteristics?.map((char) => (
          <ThemedText key={char.uuid}>
            {`${char.uuid} - ${char.isReadable ? 'Readable' : ''} ${
              char.isWritableWithResponse ? 'Writable' : ''
            }`}
          </ThemedText>
        ))}
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    marginLeft: 12,
    marginRight: 12,
    marginTop: 24,
  },
});
