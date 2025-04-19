import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { useState, useCallback } from 'react';
import {
  Device as BleDevice,
  BleManager,
  Characteristic,
  Service,
} from 'react-native-ble-plx';
import { ThemedSafeAreaView, ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect, useRouter } from 'expo-router';
import { requestBluetoothPermission } from '@/services/permissions';
import { MaterialIcons } from '@expo/vector-icons';

export type BleDeviceData = {
  device: BleDevice;
  services: Service[] | null;
  characteristics: Characteristic[] | null;
};

export default function BluetoothScreen() {
  const bleManager = new BleManager();
  const [hasBluetoothPermission, setHasBluetoothPermission] = useState(true);
  const [allDevices, setAllDevices] = useState<BleDevice[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<BleDeviceData[]>([]);
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function setup() {
        const hasPermission = await requestBluetoothPermission();
        setHasBluetoothPermission(hasPermission);
        if (!hasBluetoothPermission) {
          return;
        }
        scanForPeripherals();
      }
      setup();
      return () => {
        bleManager.stopDeviceScan();
        bleManager.destroy();
      };
    }, [])
  );

  async function connectToDevice(device: BleDevice) {
    try {
      setIsConnecting(true);
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();
      const services = await connected.services();

      let allCharacteristics: Characteristic[] = [];
      for (const service of services) {
        const characteristics = await connected.characteristicsForService(
          service.uuid
        );
        allCharacteristics = [...allCharacteristics, ...characteristics];
      }

      setConnectedDevices((prev) => [
        ...prev,
        {
          device: connected,
          services,
          characteristics: allCharacteristics,
        },
      ]);
      setAllDevices((prev) => {
        return prev.filter((item) => item.id !== device.id);
      });
    } catch (e: any) {
      Alert.alert(`Failed to connect`, e.message);
    } finally {
      setIsConnecting(false);
    }
  }

  async function scanForPeripherals() {
    await bleManager.startDeviceScan(null, null, async (_, device) => {
      if (!device || !device.name) {
        return;
      }

      if (await device.isConnected()) {
        setConnectedDevices((prev) => {
          const exists = prev.some((item) => item.device.id === device.id);
          if (exists) return prev;
          return [
            ...prev,
            { device: device, characteristics: null, services: null },
          ];
        });
      } else {
        setAllDevices((prev) => {
          let exists = prev.some((item) => item.id === device.id);
          if (exists) return prev;
          exists = connectedDevices.some(
            (item) => item.device.id === device.id
          );
          if (exists) return prev;
          return [...prev, device];
        });
      }
    });
  }

  if (!hasBluetoothPermission) {
    <ThemedSafeAreaView>
      <ThemedView style={styles.innerContainer}>
        <ThemedText type='title'>
          Turn on Bluetooth Permission to continue
        </ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>;
  }

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.innerContainer}>
        <ThemedText type='title'>Connected Devices</ThemedText>
      </ThemedView>
      <FlatList
        data={connectedDevices}
        keyExtractor={(item) => item.device.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <ThemedView>
            <ThemedText>No connected devices</ThemedText>
          </ThemedView>
        }
        ListFooterComponent={<ThemedView style={{ marginBottom: 12 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              // router.navigate(pathname: '/bleDeviceDataScreen', options: {
              //   data: JSON.stringify(deviceObj), // Serialize the object
              // })
              router.navigate({
                pathname: '/bleDeviceDataScreen',
                params: {
                  data: JSON.stringify(item),
                },
              });
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1,
              },
            ]}
          >
            <ThemedView
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <MaterialIcons name='bluetooth' size={22} />
              <ThemedText>{item.device.name}</ThemedText>
              <MaterialIcons
                name='info-outline'
                size={22}
                style={{ position: 'absolute', right: 0 }}
              />
            </ThemedView>
          </Pressable>
        )}
      />

      <ThemedView
        style={[styles.innerContainer, { flexDirection: 'row', gap: 12 }]}
      >
        <ThemedText type='title'>Available Devices</ThemedText>
        <ActivityIndicator animating size='large' />
      </ThemedView>
      <FlatList
        data={allDevices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListFooterComponent={<ThemedView style={{ marginBottom: 12 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={async () => {
              if (!isConnecting) {
                await connectToDevice(item);
              }
            }}
            disabled={isConnecting}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1,
              },
            ]}
          >
            <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name='bluetooth' size={22} />
              <ThemedText>{item.name}</ThemedText>
            </ThemedView>
          </Pressable>
        )}
      />
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    marginLeft: 12,
    marginRight: 12,
    marginTop: 24,
  },
  list: {
    gap: 26,
    margin: 12,
    justifyContent: 'center',
  },
  deviceContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: 180,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
