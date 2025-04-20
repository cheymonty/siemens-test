import {
  Device as BleDevice,
  Characteristic,
  Service,
} from 'react-native-ble-plx';

export async function getDeviceServicesAndCharactertistics(
  device: BleDevice
): Promise<{
  connectedDevice: BleDevice;
  services: Service[];
  characteristics: Characteristic[];
}> {
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

  return {
    connectedDevice: connected,
    services: services,
    characteristics: allCharacteristics,
  };
}
