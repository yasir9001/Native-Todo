import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import MainScreen from './components/mainscreen/MainScreen';
import {createBottomTabNavigator, createAppContainer } from 'react-navigation'
import Completed from './components/completed/Completed'


// const bottomNavigator = createBottomTabNavigator({
//   All:MainScreen,
//   Completed:Completed
// })





export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MainScreen />
      </View>
    );
  }
}

// export default createAppContainer(bottomNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});