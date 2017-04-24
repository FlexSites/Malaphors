import React from 'react'
import { View } from 'react-native'
import { FacebookAds } from 'expo'

export default () => {
  return (
    <FacebookAds.BannerView
      placementId="407871102925516_407871649592128"
      type="standard"
      style={{ width: '100%', height: 50 }}
      onClick={() => console.log('ad click')}
      onError={(err) => console.log('ad error', err)}
    />
  )
}
