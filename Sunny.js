'use strict';
import React, {
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import Forecast from './Forecast';

var Sunny = React.createClass({
  getInitialState() {
    return ({
      city: '',
      forecast: null
    });
  },
  componentDidMount() {
    this._getForecast('Stockholm');
  },
  _handleTextChange(event) {
    var city = event.nativeEvent.text;
    this.setState({city: city});
    this._getForecast(city);
  },
  _getForecast(city){
    fetch('http://api.openweathermap.org/data/2.5/weather?q='
      + city + ',sv&units=metric&appid=3696bdcc673594db06c301efa401f5e0')
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
          </View>
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
    alignItems: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 30
  },
  cityContainer: {
    flex: 2,
    borderBottomColor: '#000000',
    borderBottomWidth: 1
  },
  city: {
    width: 100,
    height: 16,
  },
  mainText: {
    flex: 1,
    fontSize: 16
  }
});

export default Sunny;
