import React from 'react'
import Expo, { AppLoading } from 'expo'
import { CameraRoll, Animated, Easing, Image, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import { getRandomElement, randomAuthor, randomIdiom } from './services/idiom'
import { FontAwesome } from '@expo/vector-icons'
import backgrounds from './assets/images.json'
import Ad from './Ad'

// const images = backgrounds
//   .map((image) => require(`./assets/backgrounds/${ image }`))
const images = [
  require('./assets/backgrounds/_xve6pkgile-yasin-aribuga.jpg'),
  require('./assets/backgrounds/aaron-burden-160103.jpg'),
  require('./assets/backgrounds/alexandr-schwarz-660.jpg'),
  require('./assets/backgrounds/arno-smit-165176.jpg'),
  require('./assets/backgrounds/dominik-lange-62977.jpg'),
  require('./assets/backgrounds/erik-zunder-100052.jpg'),
  require('./assets/backgrounds/ezra-jeffrey-67140.jpg'),
  require('./assets/backgrounds/felipe-santana-330.jpg'),
  require('./assets/backgrounds/gabor-monori-2199.jpg'),
  require('./assets/backgrounds/haq5cw9s6oo-bruno-marinho.jpg'),
  require('./assets/backgrounds/hoach-le-dinh-91879.jpg'),
  require('./assets/backgrounds/ixhfyja49m8-davey-heuser.jpg'),
  require('./assets/backgrounds/jan-erik-waider-144380.jpg'),
  require('./assets/backgrounds/john-towner-117317.jpg'),
  require('./assets/backgrounds/jonatan-pie-224170.jpg'),
  require('./assets/backgrounds/jonatan-pie-234237.jpg'),
  require('./assets/backgrounds/kwi60pbam9i-gabriele-diwald.jpg'),
  require('./assets/backgrounds/kzlaswr-7j4-thomas-kelley.jpg'),
  require('./assets/backgrounds/matthew-henry-20172.jpg'),
  require('./assets/backgrounds/nasa-89127.jpg'),
  require('./assets/backgrounds/neven-krcmarek-123617.jpg'),
  require('./assets/backgrounds/nithya-ramanujam-47.jpg'),
  require('./assets/backgrounds/paul-gilmore-145802.jpg'),
  require('./assets/backgrounds/paul-itkin-46110.jpg'),
  require('./assets/backgrounds/petar-petkovski-157391.jpg'),
  require('./assets/backgrounds/quin-stevenson-14794.jpg'),
  require('./assets/backgrounds/rbthqzjd_vu-thaddaeus-lim.jpg'),
  require('./assets/backgrounds/rebecca-matthews-132115.jpg'),
  require('./assets/backgrounds/serge-kutuzov-239840.jpg'),
  require('./assets/backgrounds/sergey-pesterev-222155.jpg'),
  require('./assets/backgrounds/sven-scheuermeier-108248.jpg'),
  require('./assets/backgrounds/xy9tbpyhr34-i-m-priscilla.jpg'),
  require('./assets/backgrounds/yun-xu-236938.jpg'),
]

export default class App extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      idiom: randomIdiom(),
      author: randomAuthor(),
      loaded: false,
      spinValue: new Animated.Value(0),
      favorited: false,
      pending: false,
      background: getRandomElement(images),
    }
  }

  randomize () {
    this.spin();
    this.setState({
      idiom: randomIdiom(),
      author: randomAuthor(),
      background: getRandomElement(images),
      favorited: false,
    })
  }

  favorite () {
    this.setState({
      favorited: true,
    })
  }

  download () {
    this.setState({
      pending: true,
    }, () => {
      Expo.takeSnapshotAsync(this.fullComponent, {
        format: 'jpg',
        quality: 1,
        result: 'file',
        height: 1334,
        width: 750,
      })
      .then((image) => CameraRoll.saveToCameraRoll(image))
      .then(() => {
        this.setState({
          pending: false,
        })
      })
      .catch((ex) => {
        this.setState({
          pending: false,
          errorMessage: ex.message,
        })
        console.error(ex);
      })
    })
  }

  componentWillMount () {
    return this.preload(images)
      .then(() => {
        this.setState({
          loaded: true,
        })
      })
  }

  preload (assets) {
    if (Array.isArray(assets)) {
      return Promise.all(
        assets.map(this.preload.bind(this))
      )
    } else if (typeof assets === 'string') {
      return Image.prefetch(assets)
    } else {
      return Expo.Asset.fromModule(assets).downloadAsync()
    }
  }

  spin () {
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
    if (!this.state.loaded) {
      return <AppLoading />
    }

     // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    })

    return (
      <Image
        ref={ (fullComponent) => this.fullComponent = fullComponent }
        source={ this.state.background }
        style={ styles.container }
      >
        <View style={ styles.content }>
          <Text style={ [ styles.text, styles.malaphor ] }>{ this.state.idiom }</Text>
          <Text style={ [ styles.text, styles.author ] }>{ this.state.author }</Text>
        </View>
        { !this.state.pending &&
          <View style={ styles.toolbar }>
            <TouchableOpacity onPress={ () => this.favorite() }>
              <FontAwesome name='star' size={ 50 } color={ this.state.favorited ? '#fc0' : '#fff' } style={ styles.button } />
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => this.randomize() }>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <FontAwesome name='refresh' size={ 50 } color='#fff' style={ styles.button } />
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => this.download() }>
              <FontAwesome name='download' size={ 50 } color='#fff' style={ styles.button } />
            </TouchableOpacity>
          </View>
        }
        {
          !this.state.pending &&
          <View style={{ width: '100%', height: 70 }}>
            <Ad />
          </View>
        }
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
