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
} from '@/services/weather-api';
import {
  CurrentCondition,
  HistoryTemperature,
  WeatherForecast,
} from '@/types/weather/WeatherTypes';
import { storeZipcode, getLastSearchedZipcodes } from '@/services/storage';
import { useFocusEffect } from 'expo-router';
import { transformDate } from '@/services/date';

export default function WeatherScreen() {
  const [zipcode, setZipcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [threeDayForecast, setThreeDayForecast] = useState<{
    weather: WeatherForecast[];
    currentCondition: CurrentCondition | null;
    areaName: string;
  }>({ weather: [], currentCondition: null, areaName: '' });
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
  }

  async function getZipcodeWeather() {
    const _zipcode = zipcode;
    setIsLoading(true);
    setError('');

    const _threeDayForecast = await fetchThreeDayForecast(_zipcode);
    if (_threeDayForecast.weather.length === 0) {
      setError('Invalid zipcode');
      setIsLoading(false);
      return;
    }
    await storeZipcode(_zipcode);
    setThreeDayForecast(_threeDayForecast);
    setIsLoading(false);
    await loadHistory();
  }

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.innerContainer}>
        <ThemedView style={{ flexDirection: 'row', marginBottom: 12 }}>
          <TextInput
            value={zipcode}
            keyboardType='numeric'
            placeholder='Enter US zipcode'
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
            disabled={zipcode.length !== 5 || isLoading}
          />
          {error && (
            <ThemedText type='error' style={styles.errorText}>
              {error}
            </ThemedText>
          )}
          {isLoading && <ActivityIndicator size='large' animating />}
        </ThemedView>

        {threeDayForecast.weather.length !== 0 && (
          <ThemedView style={{ marginBottom: 24, alignItems: 'center' }}>
            <ThemedText type='title'>{threeDayForecast.areaName}</ThemedText>
            <ThemedText type='subtitle'>
              {`${threeDayForecast.currentCondition?.temp_F}° F`}
            </ThemedText>
            <ThemedText>
              {threeDayForecast.currentCondition?.weatherDesc[0].value}
            </ThemedText>
          </ThemedView>
        )}

        <ThemedView>
          <FlatList
            data={threeDayForecast.weather}
            keyExtractor={(item) => item.date}
            horizontal
            contentContainerStyle={styles.list}
            ListFooterComponent={<ThemedView style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText style={{ fontWeight: 'bold' }}>
                  {transformDate(item.date)}
                </ThemedText>
                <ThemedText>
                  {`${item.mintempF}° F / ${item.maxtempF}° F`}
                </ThemedText>
              </ThemedView>
            )}
          />
        </ThemedView>

        <ThemedView style={{ marginTop: 12 }}>
          <ThemedText type='title'>History</ThemedText>
        </ThemedView>
        <ThemedView>
          <FlatList
            data={historyTemperatures}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            contentContainerStyle={styles.list}
            ListFooterComponent={<ThemedView style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText style={{ fontWeight: 'bold' }}>
                  {item.zipcode}
                </ThemedText>
                <ThemedText>
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
  errorText: {
    paddingLeft: 12,
    textAlignVertical: 'center',
  },
  input: {
    height: 40,
    width: '50%',
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
});
