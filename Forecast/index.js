'use strict';
import React, {
  StyleSheet,
  Text,
  View
} from 'react-native';

import styles from './style';

var Forecast = React.createClass({
  render() {
    return (
      <View style={styles.weatherInfo}>
        <Text style={styles.bigText}>
          {this.props.main}
        </Text>
        <Text style={styles.mainText}>
          {this.props.description}
        </Text>
        <Text style={styles.bigText}>
          {this.props.temp}°C
        </Text>
      </View>
    );
  }
});

export default Forecast;
