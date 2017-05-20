import React from 'react'
import Expo, { AppLoading } from 'expo'
import { Animated, AsyncStorage, CameraRoll, Easing, Image, InteractionManager, LayoutAnimation, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getRandomElement, randomAuthor, randomIdiom } from './services/idiom'
import { FontAwesome } from '@expo/vector-icons'
import backgrounds from './assets/images.json'
import Screenshot from './Screenshot'
import Ad from './Ad'
import Content from './Content'
import Toolbar from './Toolbar'
import Logo from './Logo'
import Drawer from 'react-native-drawer'

// const images = backgrounds
//   .map((image) => require(`./assets/backgrounds/${ image }`))
const images = [
  'https://malaphors.flexsites.io/mobile/backgrounds/_xve6pkgile-yasin-aribuga.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/aaron-burden-160103.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/alexandr-schwarz-660.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/arno-smit-165176.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/dominik-lange-62977.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/erik-zunder-100052.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/ezra-jeffrey-67140.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/felipe-santana-330.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/gabor-monori-2199.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/haq5cw9s6oo-bruno-marinho.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/hoach-le-dinh-91879.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/ixhfyja49m8-davey-heuser.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/jan-erik-waider-144380.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/john-towner-117317.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/jonatan-pie-224170.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/jonatan-pie-234237.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/kwi60pbam9i-gabriele-diwald.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/kzlaswr-7j4-thomas-kelley.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/matthew-henry-20172.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/nasa-89127.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/neven-krcmarek-123617.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/nithya-ramanujam-47.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/paul-gilmore-145802.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/paul-itkin-46110.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/petar-petkovski-157391.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/quin-stevenson-14794.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/rbthqzjd_vu-thaddaeus-lim.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/rebecca-matthews-132115.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/serge-kutuzov-239840.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/sergey-pesterev-222155.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/sven-scheuermeier-108248.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/xy9tbpyhr34-i-m-priscilla.jpg',
  'https://malaphors.flexsites.io/mobile/backgrounds/yun-xu-236938.jpg',
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
      favorites: [],
      drawerOpen: false,
    }

    this.onScreenshotSave = this.onScreenshotSave.bind(this)
    this.favorite = this.favorite.bind(this)
    this.download = this.download.bind(this)
    this.display = this.display.bind(this)
  }

  display ({ idiom = randomIdiom(), author = randomAuthor(), background = getRandomElement(images), favorited = false } = {}) {
    this.setState({
      idiom,
      author,
      background,
      favorited,
      drawerOpen: false,
    })
  }

  favorite () {
    const current = {
      idiom: this.state.idiom,
      author: this.state.author,
      background: this.state.background,
    }
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('favorites')
        .then((favorites = '[]') => JSON.parse(favorites || '[]'))
        .then((favorites) => {
          favorites.push(current)

          console.log('saving favorite')

          this.setState({ favorites })

          return AsyncStorage.setItem('favorites', JSON.stringify(favorites))
        })
    })

    this.setState({
      favorited: true,
    })
  }

  download () {
    this.setState({
      pending: true,
    }, () => {
      this.capture()
        .then(() => {
          this.setState({
            pending: false,
          })
        })
    })
  }

  componentDidMount () {
    LayoutAnimation.spring()

    AsyncStorage.getItem('favorites')
      .then((favorites) => {
        return JSON.parse(favorites || '[]')
      })
      .then((favorites) => {
        this.setState({ favorites })
      })
  }

  componentWillMount () {
    return this.preload(images)
      .then((results) => {
        console.log('all preloaded');
        this.setState({
          loaded: true,
        })
      })
  }

  onScreenshotSave (err, data) {
    console.log('screenshot saved', err, data)
    this.setState({
      pending: false,
      errorMessage: err && err.message,
    })
  }

  preload (assets) {
    if (Array.isArray(assets)) {
      return Promise.all(
        assets.map(this.preload.bind(this))
      )
    } else if (typeof assets === 'string') {
      console.log('preloading', assets)
      return Image.prefetch(assets)
    } else {
      return Expo.Asset.fromModule(assets).downloadAsync()
    }
  }

  capture () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Expo.takeSnapshotAsync(this.myBackground, {
          format: 'jpg',
          quality: 1,
          result: 'file',
          height: 1334,
          width: 750,
        })
        .then((image) => CameraRoll.saveToCameraRoll(image))
        .then(() => resolve({ message: 'Success' }))
        .catch((ex) => reject(new Error({ message: `Failed to save screenshot: ${ ex.message }` })))
      }, 1000)
    })
  }

  render () {
    if (!this.state.loaded) {
      return <AppLoading />
    }

    return (
      <Drawer
        open={ this.state.drawerOpen }
        type="overlay"
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        panOpenMask={0.2}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}
        content={
          <View style={ styles.drawer }>
            <Text style={ styles.drawerTitle }>Favorites</Text>
            <ScrollView style={ styles.drawerContent }>
              {
                this.state.favorites.map((favorite) => {
                  favorite.favorited = true
                  return (
                    <TouchableOpacity key={ favorite.idiom + favorite.author } onPress={ () => this.display(favorite) }>
                      <View style={ styles.drawerItem }>
                        <Text style={ styles.drawerItemText }>{ favorite.idiom }</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
            </ScrollView>
          </View>
        }
        captureGestures={ true }
        >
        <Image
          source={ { uri: this.state.background } }
          style={ [ styles.container ] }
          ref={ (myBackground) => this.myBackground = myBackground }
        >
          <Content
            idiom={ this.state.idiom }
            author={ this.state.author }
            style={{ marginTop: this.state.pending ? 200 : 0 }}
          />
          {
            !this.state.pending &&
            <Toolbar
              shuffle={ this.display }
              download={ this.download }
              favorite={ this.favorite }
              favorited={ this.state.favorited }
            />
          }
          <View style={{ alignItems: 'center', height: 50 }}>
            <Logo width={ 125 } style={ styles.shadow } />
          </View>
          {
            !this.state.pending &&
            <View style={{ width: '100%', height: 70 }}>
              <Ad />
            </View>
          }
        </Image>
      </Drawer>
    )
  }
}

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}

const shadowStyles = {
  shadowColor: '#000',
  shadowOffset: { height: 1, width: 1 },
  shadowOpacity: 50,
  shadowRadius: 1,
}

const styles = StyleSheet.create({
  drawer: {
    // backgroundColor: '#f00',
    paddingTop: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    padding: 20,
  },
  drawerContent: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  drawerItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#444',
  },
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
  favoriteList: {
    backgroundColor: '#f0f',
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
