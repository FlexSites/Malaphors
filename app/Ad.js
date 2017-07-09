import React from 'react'
import { View } from 'react-native'
import { FacebookAds } from 'expo'



// FacebookAds.AdSettings.addTestDevice('74f5086de8cd75b7956f16b25b85110e1be8ee85')

class AdComponent extends React.Component {
  render () {
    console.log('rendered ad!')
    return (
      <View>
        <Text>{ this.props.nativeAd.description }</Text>
      </View>
    );
  }
}

export default FacebookAds.withNativeAd(AdComponent)
