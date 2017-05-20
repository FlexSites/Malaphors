import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default (props) => {
  return (
    <View style={ [ ...props.style, styles.content ] }>
      <Text style={ [ styles.text, styles.malaphor ] }>{ props.idiom }</Text>
      <Text style={ [ styles.text, styles.author ] }>{ props.author }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: '#fff',
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
