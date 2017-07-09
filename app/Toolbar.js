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

    const iconColor = this.props.inverted ? '#000' : '#fff'
    const styles = this.props.inverted ? inverted : standard

    return (
      <View style={ styles.toolbar }>
        <TouchableOpacity onPress={ () => this.props.favorite() }>
          <FontAwesome name='star' size={ 50 } color={ this.props.favorited ? '#fc0' : iconColor } style={ styles.button } />
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => this.spin() }>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <FontAwesome name='refresh' size={ 50 } color={ iconColor } style={ styles.button } />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => this.props.download() }>
          <FontAwesome name='download' size={ 50 } color={ iconColor } style={ styles.button } />
        </TouchableOpacity>
      </View>
    )
  }
}

const invertedShadowStyles = {
  shadowColor: '#fff',
  shadowOffset: { height: 1, width: 1 },
  shadowOpacity: 50,
  shadowRadius: 1,
}

const inverted = StyleSheet.create({
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
    ...invertedShadowStyles,
    padding: 25,
  },
  shadow: {
    ...invertedShadowStyles,
  },
  text: {
    fontWeight: 'bold',
    color: '#fff',
    ...invertedShadowStyles,
  },
})


const standardShadowStyles = {
  shadowColor: '#000',
  shadowOffset: { height: 1, width: 1 },
  shadowOpacity: 50,
  shadowRadius: 1,
}

const standard = StyleSheet.create({
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
    ...standardShadowStyles,
    padding: 25,
  },
  shadow: {
    ...standardShadowStyles,
  },
  text: {
    fontWeight: 'bold',
    color: '#fff',
    ...standardShadowStyles,
  },
})
