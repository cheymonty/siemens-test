import { BarcodeData } from '@/app/(tabs)/barcodeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ZIPCODE_STORAGE_KEY = 'zipcode-storage';
const BARCODE_STORAGE_KEY = 'barcode-storage';
const MAX_BARCODE_HISTORY = 5;
const MAX_ZIPCODE_HISTORY = 5;

export async function storeZipcode(zipcode: string) {
  try {
    const zipcodesStr = await AsyncStorage.getItem(ZIPCODE_STORAGE_KEY);
    if (zipcodesStr === null) {
      await AsyncStorage.setItem(
        ZIPCODE_STORAGE_KEY,
        JSON.stringify([zipcode])
      );
      return;
    }

    const zipcodesArray: string[] = JSON.parse(zipcodesStr);

    zipcodesArray.unshift(zipcode);
    if (zipcodesArray.length > MAX_ZIPCODE_HISTORY) {
      zipcodesArray.pop();
    }
    await AsyncStorage.setItem(
      ZIPCODE_STORAGE_KEY,
      JSON.stringify(zipcodesArray)
    );
  } catch (e) {}
}

export async function getLastSearchedZipcodes(): Promise<string[]> {
  try {
    const zipcodesStr = await AsyncStorage.getItem(ZIPCODE_STORAGE_KEY);
    if (zipcodesStr !== null) {
      const zipcodesArray: string[] = JSON.parse(zipcodesStr);
      return zipcodesArray;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
}

export async function storeBarcodeData(barcodeData: BarcodeData) {
  try {
    const barcodeDataStr = await AsyncStorage.getItem(BARCODE_STORAGE_KEY);
    if (barcodeDataStr === null) {
      await AsyncStorage.setItem(
        BARCODE_STORAGE_KEY,
        JSON.stringify([barcodeData])
      );
      return;
    }

    const barcodeDataArr: BarcodeData[] = JSON.parse(barcodeDataStr);
    barcodeDataArr.unshift(barcodeData);
    if (barcodeDataArr.length > MAX_BARCODE_HISTORY) {
      barcodeDataArr.pop();
    }
    await AsyncStorage.setItem(
      BARCODE_STORAGE_KEY,
      JSON.stringify(barcodeDataArr)
    );
  } catch (e) {}
}

export async function getLastSearchedBarcodeData(): Promise<BarcodeData[]> {
  try {
    const barcodeDataStr = await AsyncStorage.getItem(BARCODE_STORAGE_KEY);
    if (barcodeDataStr !== null) {
      const barcodeDataArr: BarcodeData[] = JSON.parse(barcodeDataStr);
      return barcodeDataArr;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
}
