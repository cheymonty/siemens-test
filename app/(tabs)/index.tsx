import {
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useState, useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedSafeAreaView, ThemedView } from '@/components/ThemedView';
import {
  fetchCurrentTemperature,
  fetchThreeDayForecast,
  transformDate,
} from '@/services/weather-api';
import {
  HistoryTemperature,
  WeatherForecast,
} from '@/types/weather/WeatherTypes';
import { storeZipcode, getLastSearchedZipcodes } from '@/services/storage';
import { useFocusEffect } from 'expo-router';

export default function WeatherScreen() {
  const [zipcode, setZipcode] = useState('');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const [threeDayForecast, setThreeDayForecast] = useState<WeatherForecast[]>(
    []
  );
  const [historyTemperatures, setHistoryTemperatures] = useState<
    HistoryTemperature[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      async function setup() {
        await loadHistory();
      }
      setup();
    }, [])
  );

  async function loadHistory() {
    setIsLoadingHistory(true);
    const zipcodes = await getLastSearchedZipcodes();

    let history: HistoryTemperature[] = [];
    for (const zip of zipcodes) {
      const currTemp = await fetchCurrentTemperature(zip);
      history.push({
        currentTemperature: currTemp ? currTemp : 'Unavailable',
        zipcode: zip,
      });
    }
    setHistoryTemperatures(history);
    setIsLoadingHistory(false);
  }

  async function getZipcodeWeather() {
    const _zipcode = zipcode;
    setIsLoadingSearch(true);
    setError('');

    const _threeDayForecast = await fetchThreeDayForecast(_zipcode);
    if (_threeDayForecast.length === 0) {
      setError('Invalid zipcode');
      setIsLoadingSearch(false);
      return;
    }
    await storeZipcode(_zipcode);
    setThreeDayForecast(_threeDayForecast);
    setIsLoadingSearch(false);
    await loadHistory();
  }

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.innerContainer}>
        <ThemedView style={{ flexDirection: 'row', marginBottom: 12 }}>
          <TextInput
            value={zipcode}
            keyboardType='numeric'
            onChangeText={(text) => setZipcode(text)}
            style={styles.input}
            maxLength={5}
          />

          <Button
            onPress={async () => {
              await getZipcodeWeather();
            }}
            title='Search'
            color='#841584'
            disabled={zipcode.length !== 5 || isLoadingSearch}
          />
          {error && (
            <ThemedText type='error' style={styles.errorText}>
              {error}
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.titleContainer}>
          <ThemedText type='title'>Current Weather</ThemedText>
        </ThemedView>
        <ThemedView>
          {isLoadingSearch && <ActivityIndicator size='large' animating />}
          <FlatList
            data={threeDayForecast}
            keyExtractor={(item) => item.date}
            horizontal
            contentContainerStyle={styles.list}
            ListFooterComponent={<ThemedView style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText style={styles.date}>
                  {transformDate(item.date)}
                </ThemedText>
                <ThemedText style={styles.temp}>
                  {`${item.mintempF}° F / ${item.maxtempF}° F`}
                </ThemedText>
              </ThemedView>
            )}
          />
        </ThemedView>

        <ThemedView style={styles.titleContainer}>
          <ThemedText type='title'>History</ThemedText>
        </ThemedView>
        <ThemedView>
          {isLoadingHistory && <ActivityIndicator size='large' animating />}
          <FlatList
            data={historyTemperatures}
            keyExtractor={(item) => item.zipcode}
            horizontal
            contentContainerStyle={styles.list}
            ListFooterComponent={<ThemedView style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText style={styles.date}>{item.zipcode}</ThemedText>
                <ThemedText style={styles.temp}>
                  {`Current: ${item.currentTemperature}° F`}
                </ThemedText>
              </ThemedView>
            )}
          />
        </ThemedView>
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
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  errorText: {
    paddingLeft: 12,
    textAlignVertical: 'center',
  },
  input: {
    height: 40,
    width: 100,
    borderWidth: 1,
  },
  list: {
    gap: 15,
    margin: 12,
    justifyContent: 'center',
  },
  card: {
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
  date: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },

  temp: {
    fontSize: 16,
    fontWeight: '600',
  },
});
