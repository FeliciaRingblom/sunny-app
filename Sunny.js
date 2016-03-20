'use strict';
import React, {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image
} from 'react-native';

import Forecast from './Forecast';
import Icon from 'react-native-vector-icons/FontAwesome';


const API_STEM = 'http://api.openweathermap.org/data/2.5/weather?';
const API_KEY = '3696bdcc673594db06c301efa401f5e0';

var Sunny = React.createClass({
  getInitialState() {
    return ({
      forecast: null
    });
  },
  componentDidMount() {
    this._getInitialForecast();
  },
  _getInitialForecast() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this._getForecastForCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {alert(error.message)},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },
  _handleTextChange(event) {
    var city = event.nativeEvent.text;
    this._getForecastForCity(city);
  },
  _getForecastForCity(city) {
    this._getForecast(
      `${API_STEM}q=${city}&units=metric&APPID=${API_KEY}`);
  },
  _getForecastForCoords: function(lat, lon) {
    this._getForecast(
      `${API_STEM}lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`);
  },
  _getForecast(url){
    fetch(url)
      .then((response) => response.json())
      .then((responseJSON) => {
        this.setState({
          forecast: {
            main: responseJSON.weather[0].main,
            description: responseJSON.weather[0].description,
            temp: responseJSON.main.temp.toFixed(1)
          }
        });
      })
      .catch((error) => {
        console.warn(error);
      });
  },
  render() {
    var content = null;
    if (this.state.forecast !== null) {
      content = <Forecast
                  main={this.state.forecast.main}
                  description={this.state.forecast.description}
                  temp={this.state.forecast.temp}/>;
    }
    return (
      <View style={styles.container}>
        <Image source={require('image!flowers')}
             resizeMode='cover'>
           <View style={styles.overlay}>
              <View style={styles.row}>
                <Text style={styles.mainText}>
                  Show weather for
                </Text>
                <View style={styles.cityContainer}>
                  <TextInput
                    style={[styles.city, styles.mainText]}
                    onSubmitEditing={this._handleTextChange}
                    maxLength={50}/>
                </View>
              </View>
              {content}
              <Icon name="heart" style={styles.heartIcon} />
          </View>
        </Image>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  overlay: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0)',
    padding: 20
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 30
  },
  cityContainer: {
    flex: 2,
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1
  },
  city: {
    width: 100,
    height: 16,
    color: '#FFFFFF'
  },
  mainText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF'
  },
  heartIcon: {
    color: '#FFFFFF',
    fontSize: 30
  }
});

export default Sunny;
