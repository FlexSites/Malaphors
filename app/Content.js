import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'

export default function Content (props) {
  const styles = props.inverted ? inverted : standard
  return (
    <View style={ [ ...props.style, styles.content ] }>
      <Text style={ [ styles.text, styles.malaphor ] }>{ props.idiom }</Text>
      <Text style={ [ styles.text, styles.author ] }>{ props.author }</Text>
    </View>
  )
}

Content.propTypes = {
  inverted: PropTypes.bool,
  idiom: PropTypes.string,
  author: PropTypes.string,
  style: PropTypes.object,
}

const inverted = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: '#000',
    shadowColor: '#fff',
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 50,
    shadowRadius: 1,
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
    color: '#000',
  },
  author: {
    fontSize: 15,
    textAlign: 'right',
    color: '#000',
    width: '100%',
  },
})

const standard = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 1,
    shadowColor: '#000',
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 50,
    shadowRadius: 1,
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
})
