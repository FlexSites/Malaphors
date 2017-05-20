import React from 'react'
import Expo from 'expo'
import { CameraRoll, Image, StyleSheet, Text, View } from 'react-native'

export default class App extends React.Component {
  capture (props) {
    setTimeout(() => {
    }, 250)
  }
  componentWillReceiveProps (nextProps) {
    this.capture(nextProps)
  }
  componentWillMount () {
    this.capture(this.props)
  }
  componentDidMount () {
    this.capture(this.props)
  }

  render () {
    return (
      <Image
        source={ this.props.background }
        style={ styles.container }
        ref={ (fullComponent) => this.fullComponent = fullComponent }
      >
        <View style={ styles.content }>
          <Text style={ [ styles.text, styles.malaphor ] }>{ this.props.idiom }</Text>
          <Text style={ [ styles.text, styles.author ] }>{ this.props.author }</Text>
        </View>
      </Image>
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
    marginTop: 100,
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
})
