import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Weather',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name='cloud' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='bluetoothScreen'
        options={{
          title: 'Bluetooth',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name='bluetooth' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='wifiScreen'
        options={{
          title: 'Wifi',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name='wifi' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='barcodeScreen'
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name='barcode-reader' color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
