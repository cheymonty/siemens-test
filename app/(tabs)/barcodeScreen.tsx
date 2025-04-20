import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Button,
} from 'react-native';
import { useState, useCallback } from 'react';
import {
  CameraView,
  BarcodeSettings,
  BarcodeScanningResult,
} from 'expo-camera';
import { ThemedSafeAreaView, ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect } from 'expo-router';
import { requestCameraPermission } from '@/services/permissions';
import {
  getLastSearchedBarcodeData,
  storeBarcodeData,
} from '@/services/storage';
import dayjs from 'dayjs';
import { getTimeFromNow } from '@/services/date';

export type BarcodeData = {
  type: string;
  data: string;
  timeScanned: string;
};

const barcodeScannerSettings: BarcodeSettings = {
  barcodeTypes: [
    'aztec',
    'ean13',
    'ean8',
    'qr',
    'pdf417',
    'upc_e',
    'datamatrix',
    'code39',
    'code93',
    'itf14',
    'codabar',
    'code128',
    'upc_a',
  ],
};

export default function BarcodeScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [barcodeDataHistory, setBarcodeDataHistory] = useState<BarcodeData[]>(
    []
  );

  useFocusEffect(
    useCallback(() => {
      async function setup() {
        const hasPermission = await requestCameraPermission();
        setHasCameraPermission(hasPermission);
        if (hasPermission) {
          await loadHistory();
        }
      }
      setup();
    }, [])
  );

  async function loadHistory() {
    setIsLoadingHistory(true);
    const data: BarcodeData[] = await getLastSearchedBarcodeData();
    setBarcodeDataHistory(data);
    setIsLoadingHistory(false);
  }

  async function onBarcodeScanned(scanningResult: BarcodeScanningResult) {
    setIsCameraOpen(false);
    await storeBarcodeData({
      data: scanningResult.data,
      type: scanningResult.type,
      timeScanned: dayjs().toISOString(),
    });
    await loadHistory();
  }

  if (!hasCameraPermission) {
    return (
      <ThemedSafeAreaView>
        <ThemedView style={styles.innerContainer}>
          <ThemedText type='title'>
            Turn on Camera Permission to continue
          </ThemedText>
        </ThemedView>
      </ThemedSafeAreaView>
    );
  }

  if (isCameraOpen) {
    return (
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={barcodeScannerSettings}
        onBarcodeScanned={onBarcodeScanned}
      >
        <ThemedView style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => {
              setIsCameraOpen(false);
            }}
          >
            <ThemedText style={{ color: '#fff', textAlign: 'center' }}>
              Cancel
            </ThemedText>
          </Pressable>
        </ThemedView>
      </CameraView>
    );
  }

  return (
    <ThemedSafeAreaView>
      <ThemedView style={[styles.innerContainer, { flex: 1 }]}>
        <Button
          onPress={() => {
            setIsCameraOpen(true);
          }}
          title='Start scan'
          color='#841584'
        />

        <ThemedText>
          Supports {barcodeScannerSettings.barcodeTypes.join(', ')}
        </ThemedText>

        <ThemedText type='title' style={{ marginTop: 24 }}>
          History
        </ThemedText>

        {isLoadingHistory && <ActivityIndicator size='large' animating />}
        <FlatList
          data={barcodeDataHistory}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ThemedView style={{ borderBottomWidth: 2, borderTopWidth: 2 }}>
              <ThemedText>{`Type: ${item.type}`}</ThemedText>
              <ThemedText>{`Data: ${item.data}`}</ThemedText>
              <ThemedText>{`Time scanned: ${getTimeFromNow(
                item.timeScanned
              )}`}</ThemedText>
            </ThemedView>
          )}
        />
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
  camera: {
    flex: 1,
  },
  list: {
    gap: 26,
    marginLeft: 12,
    justifyContent: 'center',
    paddingBottom: 12,
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '50%',
    bottom: 24,
    backgroundColor: 'red',
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
});
