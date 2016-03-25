'use strict';
import React, {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  AsyncStorage,
  TouchableHighlight,
  StatusBarIOS
} from 'react-native';

import Forecast from './Forecast';
import Icon from 'react-native-vector-icons/FontAwesome';


const API_STEM = 'http://api.openweathermap.org/data/2.5/weather?';
const API_KEY = '3696bdcc673594db06c301efa401f5e0';
const STORAGE_KEY = '@SunnyApp:city';

var Sunny = React.createClass({
  getInitialState() {
    return ({
      forecast: null,
      city: null
    });
  },
  componentDidMount() {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value !== null) {
          this._getForecastForCity(value);
        }else{
          this._getInitialForecast();
        }
      })
      .catch((error) => console.log('AsyncStorage error: ' + error.message))
      .done();

      StatusBarIOS.setStyle(1, true);
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
  _storeCity(){
    let city = this.state.city;
    AsyncStorage.setItem(STORAGE_KEY, city)
      .then(() => console.log('Saved selection to disk: ' + city))
      .catch((error) => console.log('AsyncStorage error: ' + error.message))
      .done();
  },
  _handleTextChange(event) {
    var city = event.nativeEvent.text;
    this._getForecastForCity(city);
  },
  _getForecastForCity(city) {
    this.setState({city: city})
    this._getForecast(`${API_STEM}q=${city}&units=metric&APPID=${API_KEY}`);
  },
  _getForecastForCoords(lat, lon) {
    this._getForecast(`${API_STEM}lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`);
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
    var position = "Current position";
    if (this.state.city !== null){
      position = this.state.city
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
              <Text style={styles.posText}>
                {position}
              </Text>
              {content}
              <TouchableHighlight
                style={styles.touchIcon}
                onPress={this._storeCity}
                underlayColor='rgba(255,255,255,0.3)'
                activeOpacity={0.5}>
                  <Icon name="heart" style={styles.heartIcon} />
              </TouchableHighlight>
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
  posText: {
    flex: 1,
    fontSize: 40,
    color: '#FFFFFF'
  },
  heartIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    margin: 10
  },
  touchIcon: {
    borderRadius: 25,
    width: 50,
    height: 50
  }
});

export default Sunny;
