import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { useState, useCallback, useRef } from 'react';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
import { ThemedSafeAreaView, ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect, useRouter } from 'expo-router';
import { requestWifiPermission } from '@/services/permissions';
import { MaterialIcons } from '@expo/vector-icons';

export default function WifiScreen() {
  const [hasWifiPermission, setHasWifiPermission] = useState(true);
  const [allWifis, setAllWifis] = useState<WifiEntry[]>([]);
  const [connectedWifi, setConnectedWifi] = useState<WifiEntry | null>(null);
  const connectedBssid = useRef('');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      async function setup() {
        const hasPermission = await requestWifiPermission();
        setHasWifiPermission(hasPermission);
        if (!hasPermission) {
          return;
        }
        await getCurrentConnection();
        await scanForWifi();
      }
      setup();
    }, [])
  );

  async function getCurrentConnection() {
    if (!(await WifiManager.connectionStatus())) {
      return;
    }
    const bssid = await WifiManager.getBSSID();
    connectedBssid.current = bssid.toUpperCase();
  }

  async function scanForWifi() {
    try {
      const list = await WifiManager.loadWifiList();
      const visibleNetworks = list.filter((item) => item.SSID.trim() !== '');

      const uniqueBySSID = Array.from(
        visibleNetworks
          .reduce((map, wifi) => {
            const bssid = wifi.BSSID.toUpperCase();

            if (bssid === connectedBssid.current && !connectedWifi) {
              setConnectedWifi(wifi);
              return map;
            }

            const existing = map.get(wifi.SSID);

            // Keep the strongest signal
            if (!existing || wifi.level > existing.level) {
              map.set(wifi.SSID, wifi);
            }

            return map;
          }, new Map<string, WifiEntry>())
          .values()
      );
      setAllWifis(uniqueBySSID);
    } catch (e: any) {
      Alert.alert(`Failed to scan for networks`, e.message);
    }
  }

  if (!hasWifiPermission) {
    <ThemedSafeAreaView>
      <ThemedView style={styles.innerContainer}>
        <ThemedText type='title'>
          Turn on Wifi Permission to continue
        </ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>;
  }

  return (
    <ThemedSafeAreaView>
      {connectedWifi && (
        <>
          <ThemedView style={styles.innerContainer}>
            <ThemedText type='title'>Connected Network</ThemedText>
          </ThemedView>
          <ThemedView style={{ marginLeft: 12, marginTop: 6 }}>
            <Pressable
              onPress={() => {
                router.navigate({
                  pathname: '/wifiDataScreen',
                  params: {
                    _data: JSON.stringify(connectedWifi),
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
                <MaterialIcons
                  name='check'
                  size={22}
                  color='blue'
                  style={{ marginRight: 12 }}
                />
                <ThemedText>{connectedWifi.SSID}</ThemedText>

                <MaterialIcons
                  name='info-outline'
                  size={22}
                  style={{ position: 'absolute', right: 24 }}
                />
              </ThemedView>
            </Pressable>
          </ThemedView>
        </>
      )}

      <ThemedView
        style={[
          styles.innerContainer,
          { flexDirection: 'row', gap: 12, alignItems: 'center' },
        ]}
      >
        <ThemedText type='title'>Available Networks</ThemedText>
        <ActivityIndicator animating size='large' />
      </ThemedView>
      <FlatList
        data={allWifis}
        keyExtractor={(item) => item.BSSID}
        contentContainerStyle={styles.list}
        ListFooterComponent={<ThemedView style={{ marginBottom: 12 }} />}
        renderItem={({ item }) => {
          return (
            <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name='wifi'
                size={22}
                style={{ marginRight: 12 }}
              />
              <ThemedText>{item.SSID}</ThemedText>
            </ThemedView>
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
});
