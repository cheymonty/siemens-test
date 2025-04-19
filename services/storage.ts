import AsyncStorage from '@react-native-async-storage/async-storage';

const ZIPCODE_STORAGE_KEY = 'zipcode-storage';
const MAX_HISTORY_ITEMS = 5;

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
    if (zipcodesArray.includes(zipcode)) {
      return;
    }
    zipcodesArray.push(zipcode);
    if (zipcodesArray.length > MAX_HISTORY_ITEMS) {
      zipcodesArray.shift();
    }
    await AsyncStorage.setItem(
      ZIPCODE_STORAGE_KEY,
      JSON.stringify(zipcodesArray)
    );
  } catch (e) {
    // error reading value
  }
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
    // error reading value
  }
}
