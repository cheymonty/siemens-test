import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { BleDeviceData } from '@/app/(tabs)/bluetoothScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedScrollView, ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function bleDeviceDataScreen() {
  const { _data } = useLocalSearchParams();
  const data: BleDeviceData = _data ? JSON.parse(_data as string) : null;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: 'Device Details' });
  }, []);

  return (
    <ThemedScrollView>
      <ThemedView style={styles.innerContainer}>
        <ThemedText type='title'>{data.device.name}</ThemedText>

        <ThemedText style={{ fontWeight: 'bold' }}>Local name:</ThemedText>
        <ThemedText>{data.device.localName}</ThemedText>

        <ThemedText style={{ fontWeight: 'bold' }}>Services:</ThemedText>
        {data?.services?.map((service) => (
          <ThemedText key={service.uuid}>{service.uuid}</ThemedText>
        ))}

        <ThemedText style={{ fontWeight: 'bold' }}>Characteristics:</ThemedText>
        {data?.characteristics?.map((char) => (
          <ThemedText key={char.uuid}>
            {`${char.uuid} - ${char.isReadable ? 'Readable' : ''} ${
              char.isWritableWithResponse ? 'Writable' : ''
            }`}
          </ThemedText>
        ))}
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
