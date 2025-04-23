import { PermissionsAndroid } from 'react-native';
import * as Device from 'expo-device';

async function requestAndroid31Permissions() {
  const bluetoothScanPermission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    {
      title: 'Bluetooth Scan Permission',
      message: 'This app needs bluetooth scan permission to use bluetooth',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    }
  );
  const bluetoothConnectPermission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    {
      title: 'Bluetooth Connect Permission',
      message: 'This app needs bluetooth connect permission to use bluetooth',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    }
  );
  const fineLocationPermission = await requestLocationPermission();

  return (
    bluetoothScanPermission === 'granted' &&
    bluetoothConnectPermission === 'granted' &&
    fineLocationPermission
  );
}

export async function requestBluetoothPermission() {
  if ((Device.platformApiLevel ?? -1) < 31) {
    return await requestLocationPermission();
  } else {
    return await requestAndroid31Permissions();
  }
}

export async function requestWifiPermission() {
  return await requestLocationPermission();
}

export async function requestCameraPermission() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Camera Permission',
      message: 'This app needs camera permission to scan barcodes',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function requestLocationPermission() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message:
        'This app needs location permission to get current weather, use bluetooth, and scan for wifi networks',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}
