'use strict'

const Idioms = require('../assets/idioms.json')
const dupHash = Idioms.map((idiom) => clean(idiom.idiom))
const Authors = require('../assets/authors.json')
const Images = require('../assets/images.json')
const shuffle = require('lodash.shuffle')
const pluralize = require('pluralize')
const upperCase = require('upper-case-first')
const VERBS = require('../assets/verbs.json')

const VOWELS = [ 'a', 'e', 'i', 'o', 'u' ]

const ALL_VERBS = Idioms.reduce((prev, curr) => {
  return prev.concat(curr.verbs || []);
}, [])

console.log(ALL_VERBS)

console.log(Object.keys(VERBS))


function randomIdiom () {
  const idioms = getRandomElements(Idioms, 3)//eslint-disable-line no-magic-numbers

  console.log('MERGING\n\n', idioms.map(({ idiom }) => idiom).join(' + \n'));
  const merge = upperCase(mergeIdioms(...idioms)) // eslint-disable-line node/no-unsupported-features
  const cleaned = clean(merge)

  if (dupHash.includes(cleaned)) {
    return randomIdiom()
  }
  return merge
}

function clean (text) {
  return text.toLowerCase().replace(/[^a-z]/g, '');
}

function half () {
  return Math.random() > 0.5//eslint-disable-line no-magic-numbers
}

function mergeIdioms (...entries) {
  const [ entry1, entry2 ] = entries
  const idiom1 = getRandomElement(entry1.replacements)
  const idiom2 = getRandomElement(entry2.replacements)
  const maxPartLen = Math.max(idiom1.length, idiom2.length)
  const parts = []

  for (let i = 0; i < maxPartLen; i++) {
    const part = half() ? idiom1[i] || idiom2[i] : idiom2[i] || idiom1[i]

    parts.push(part)
  }

  let str = parts.join(' ')

  const malaphor = new Malaphor(...entries)

  return fixArticles(malaphor.parse(str))
}

function fixArticles (str) {
  const matches = str.match(/ an? [a-z]/gi)

  if (matches) {
    matches.forEach((match) => {
      const lastChar = match.substr(match.length - 1).toLowerCase()//eslint-disable-line no-magic-numbers

      if (VOWELS.includes(lastChar)) {
        str = str.replace(match, ` an ${ lastChar }`)
      }
    })
  }

  return str
}

function getRandomElements (arr, num) {
  return shuffle(arr).slice(0, Math.min(num, arr.length))//eslint-disable-line no-magic-numbers
}

function getRandomElement (arr = [], remove = false) {
  const idx = Math.floor(Math.random() * arr.length)

  if (!arr.length) {
    return null
  }

  if (remove) {
    return arr.splice(idx, 1)[0] // eslint-disable-line no-magic-numbers
  }

  return arr[idx]
}

function randomAuthor () {
  return getRandomElement(Authors)
}

function randomImage () {
  return getRandomElement(Images)
}

exports.randomImage = randomImage
exports.randomAuthor = randomAuthor
exports.randomIdiom = randomIdiom
exports.getRandomElement = getRandomElement;


exports.getRandomElement = getRandomElement


export default class Malaphor {
  constructor (...sources) {
    this.sources = sources

    this.nouns = []
    this.verbs = []
    this.adjectives = []
    this.abstract_nouns = []
    this.mass_nouns = []
    this.proper_nouns = []

    this.sources.reduce((prev, curr) => {
      prev.nouns = prev.nouns.concat(curr.nouns || [])
      prev.abstract_nouns = prev.abstract_nouns.concat(curr.abstract_nouns || [])
      prev.mass_nouns = prev.mass_nouns.concat(curr.mass_nouns || [])
      prev.proper_nouns = prev.proper_nouns.concat(curr.proper_nouns || [])
      prev.verbs = prev.verbs.concat(curr.verbs || [])
      prev.adjectives = prev.adjectives.concat(curr.adjectives || [])
      return prev
    }, this)
  }

  abstract (type) {
    return getRandomElement(this.abstract_nouns, true)
  }
  mass (type) {
    const potential = this.mass_nouns.concat(this.nouns);
    return getRandomElement(potential, true)
  }
  proper (type) {
    console.log('proper_nouns', type)
    return getRandomElement(this.proper_nouns, true) || getRandomElement(this.nouns, true)
  }

  noun (type) {
    const noun = getRandomElement(this.nouns, true)

    if (type === 'plural') {
      return pluralize.plural(noun)
    }

    return noun
  }

  adjective (type) {
    return getRandomElement(this.adjectives, true)
  }

  verb (type) {
    const verb = getRandomElement(this.verbs, true)
    const pos = VERBS[verb]

    if (pos) {
      return pos[type]
    }

    if (type === 'present') {
      return verb
    } else if (type === 'continuous') {
      return `${ verb }ing`
    } else if (type === 'past') {
      return `${ verb }ed`
    } else if (type === 'future') {
      return `will ${ verb }`
    }
  }

  parse (str) {
    return str.replace(/\{\{ (.*?) \}\}/g, (match, p1) => {
      const [ pos, type ] = p1.split('_')


      return this[pos](type)
    })
  }
}
