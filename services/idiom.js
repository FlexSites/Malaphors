'use strict'

const Idioms = require('../assets/idioms.json')
const dupHash = Idioms.map((idiom) => clean(idiom.idiom))
const Authors = require('../assets/authors.json')
const Images = require('../assets/images.json')
const shuffle = require('lodash.shuffle')
const pluralize = require('pluralize')
const upperCase = require('upper-case-first')

const VOWELS = [ 'a', 'e', 'i', 'o', 'u' ]
const NOUN_TOKEN = 'noun'
const PLURAL_NOUN_TOKEN = 'nouns'
const VERB_TOKEN = 'verb'
const ADJECTIVE_TOKEN = 'adj'

const ALL_VERBS = Idioms.reduce((prev, curr) => {
  return prev.concat(curr.verbs || []);
}, [])

console.log(ALL_VERBS);

function randomIdiom () {
  const idioms = getRandomElements(Idioms, 2)//eslint-disable-line no-magic-numbers

  console.log('MERGE', idioms.map((idiom) => idiom.idiom))//eslint-disable-line

  return upperCase(mergeIdioms(...idioms))//eslint-disable-line node/no-unsupported-features
}

function half() {
  return Math.random() > 0.5//eslint-disable-line no-magic-numbers
}

function mergeIdioms(entry1, entry2) {
  const merge = upperCase(mergeIdioms(...idioms)) // eslint-disable-line node/no-unsupported-features
  const cleaned = clean(merge)

  if (dupHash.includes(cleaned)) {
    console.log('HAD TO REDO, DUPLICATE')
    return randomIdiom()
  }
  return merge
}

function clean(text) {
  return text.toLowerCase().replace(/[^a-z]/g, '');
}

function half () {
  return Math.random() > 0.5//eslint-disable-line no-magic-numbers
}

function mergeIdioms (entry1, entry2) {
  const idiom1 = getRandomElement(entry1.replacements)
  const idiom2 = getRandomElement(entry2.replacements)
  const maxPartLen = Math.max(idiom1.length, idiom2.length)
  const nouns = [].concat(entry1.nouns, entry2.nouns)
  const verbs = [].concat(entry1.verbs || [], entry2.verbs || [])
  const adjectives = [].concat(entry1.adjectives || [], entry2.adjectives || [])
  const parts = []

  for (let i = 0; i < maxPartLen; i++) {
    const part = half() ? idiom1[i] || idiom2[i] : idiom2[i] || idiom1[i]

    parts.push(part)
  }

  let str = parts.join(' ')

  str = str.replace(/\{\{ (adj|nouns?|verbs?) \}\}/g, (match, p1) => {
    if (p1 === NOUN_TOKEN) {
      const noun = getRandomElement(nouns, true)
    if (p1 === NOUN_TOKEN) {
      const noun = getRandomElement(nouns, true)
      return pluralize.singular(noun)
    } else if (p1 === PLURAL_NOUN_TOKEN) {
      const noun = getRandomElement(nouns, true)

      return pluralize.plural(noun)
    } else if (p1 === ADJECTIVE_TOKEN) {
      const adj = getRandomElement(adjectives, true)

      return adj
    } else if (p1 === VERB_TOKEN) {
      return getRandomElement(verbs, true)
    }

    return ''
  })

  return fixArticles(str)
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

function getRandomElement (arr, remove) {
  const idx = Math.floor(Math.random() * arr.length)

  if (remove) {
    return arr.splice(idx, 1)[0]//eslint-disable-line no-magic-numbers
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
