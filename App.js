import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import SearchInput from './components/SearchInput';
import getImageForWeather from './utils/getImageForWeather';
import {fetchLocationId, fetchWeather} from './utils/api/';

export default class WeatherClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      location: '',
      temperature: 0,
      weather: '',
    };
  }
  handleUpdateLocation = async city => {
    if (!city) return;

    this.setState({loading: true}, async () => {
      try {
        const locationId = await fetchLocationId(city);
        const {location, weather, temperature} = await fetchWeather(locationId);

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
        });
        console.log(
          'Location:',
          location,
          'Weather:',
          weather,
          'Temperature:',
          temperature,
        );
      } catch (e) {
        this.setState({
          error: true,
          loading: false,
        });
        console.log('error: ', e.error);
      }
    });
  };
  componentDidMount() {
    console.log('Component has mounted!');
  }
  render() {
    const {location, loading, error, weather, temperature} = this.state;
    return (
      <KeyboardAvoidingView style={styles.view} behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}>
          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Could not load weather, please try different city.
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      {weather}
                    </Text>
                    <Text
                      style={[
                        styles.largeText,
                        styles.textStyle,
                      ]}>{`${Math.round(temperature)}º`}</Text>
                  </View>
                )}

                <SearchInput
                  placeholder="Search any city"
                  onSubmit={this.handleUpdateLocation}
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  textStyle: {
    textAlign: 'center',
    // eslint-disable-next-line eqeqeq
    fontFamily: Platform.OS == 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: '#000',
  },
  view: {
    flex: 1,
    backgroundColor: '#FFFA90',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  imageContainer: {
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
});
