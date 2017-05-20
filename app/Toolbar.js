import React from 'react'
import Expo, { AppLoading } from 'expo'
import { CameraRoll, Animated, Easing, Image, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default class Toolbar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      spinValue: new Animated.Value(0),
    }
  }

  spin () {
    this.props.shuffle()
    this.state.spinValue.setValue(0)
    Animated.timing(
      this.state.spinValue,
      {
        toValue: 1,
        duration: 250,
        easing: Easing.linear,
      }
    ).start()
  }

  render () {
    // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    })

    return (
      <View style={ styles.toolbar }>
        <TouchableOpacity onPress={ () => this.props.favorite() }>
          <FontAwesome name='star' size={ 50 } color={ this.props.favorited ? '#fc0' : '#fff' } style={ styles.button } />
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => this.spin() }>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <FontAwesome name='refresh' size={ 50 } color='#fff' style={ styles.button } />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => this.props.download() }>
          <FontAwesome name='download' size={ 50 } color='#fff' style={ styles.button } />
        </TouchableOpacity>
      </View>
    )
  }
}

const shadowStyles = {
  shadowColor: '#000',
  shadowOffset: { height: 1, width: 1 },
  shadowOpacity: 50,
  shadowRadius: 1,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderWidth: 1,
  },
  toolbar: {
    alignItems: 'center',
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    ...shadowStyles,
    padding: 25,
  },
  shadow: {
    ...shadowStyles,
  },
  text: {
    fontWeight: 'bold',
    color: '#fff',
    ...shadowStyles,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  malaphor: {
    fontSize: 40,
    textAlign: 'center',
    color: '#fff',
  },
  author: {
    fontSize: 15,
    textAlign: 'right',
    color: '#fff',
    width: '100%',
  },
  adblock: {
    height: 50,
    width: '100%',
    backgroundColor: '#900',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
