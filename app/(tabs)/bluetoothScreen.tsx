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
import { getDeviceServicesAndCharactertistics } from '@/services/ble';

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
  const [isConnectingIds, setIsConnectingIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function setup() {
        const hasPermission = await requestBluetoothPermission();
        setHasBluetoothPermission(hasPermission);
        if (!hasPermission) {
          return;
        }
        await scanForPeripherals();
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
      setIsConnectingIds((prev) => [...prev, device.id]);

      const { connectedDevice, services, characteristics } =
        await getDeviceServicesAndCharactertistics(device);

      setConnectedDevices((prev) => [
        ...prev,
        {
          device: connectedDevice,
          services: services,
          characteristics: characteristics,
        },
      ]);
      setAllDevices((prev) => {
        return prev.filter((item) => item.id !== device.id);
      });
    } catch (e: any) {
      Alert.alert(`Failed to connect`, e.message);
    } finally {
      setIsConnectingIds((prev) => prev.filter((id) => id !== device.id));
    }
  }

  async function scanForPeripherals() {
    await bleManager.startDeviceScan(null, null, async (_, device) => {
      if (!device || !device.name) {
        return;
      }

      if (await device.isConnected()) {
        const { connectedDevice, services, characteristics } =
          await getDeviceServicesAndCharactertistics(device);
        setConnectedDevices((prev) => {
          const exists = prev.some((item) => item.device.id === device.id);
          if (exists) return prev;
          return [
            ...prev,
            {
              device: connectedDevice,
              services: services,
              characteristics: characteristics,
            },
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
              router.navigate({
                pathname: '/bleDeviceDataScreen',
                params: {
                  _data: JSON.stringify(item),
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
        style={[
          styles.innerContainer,
          { flexDirection: 'row', gap: 12, alignItems: 'center' },
        ]}
      >
        <ThemedText type='title'>Available Devices</ThemedText>
        <ActivityIndicator animating size='large' />
      </ThemedView>
      <FlatList
        data={allDevices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListFooterComponent={<ThemedView style={{ marginBottom: 12 }} />}
        renderItem={({ item }) => {
          const isConnecting = isConnectingIds.includes(item.id);
          return (
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
              <ThemedView
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <MaterialIcons name='bluetooth' size={22} />
                <ThemedText>{item.name}</ThemedText>
                {isConnecting && (
                  <ActivityIndicator
                    animating
                    size='small'
                    style={{ marginLeft: 12 }}
                  />
                )}
              </ThemedView>
            </Pressable>
          );
        }}
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
