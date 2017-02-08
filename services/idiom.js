'use strict';

const Idioms = require('../idioms.json');
const Authors = require('../authors.json');
const Images = require('../images.json');
const shuffle = require('lodash.shuffle');
const pluralize = require('pluralize');
const upperCase = require('upper-case-first');

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const NOUN_TOKEN = 'noun';
const PLURAL_NOUN_TOKEN = 'nouns';
const ADJECTIVE_TOKEN = 'adj';

function randomIdiom() {
  const idioms = getRandomElements(Idioms, 2);

  console.log('MERGE', idioms.map((idiom) => idiom.idiom));

  return upperCase(mergeIdioms(...idioms));
}

function half() {
  return Math.random() > 0.5;
}

function mergeIdioms(entry1, entry2) {

  const idiom1 = getRandomElement(entry1.replacements);
  const idiom2 = getRandomElement(entry2.replacements);
  const maxPartLen = Math.max(idiom1.length, idiom2.length);
  const nouns = [].concat(entry1.nouns, entry2.nouns);
  const adjectives = [].concat(entry1.adjectives || [], entry2.adjectives || []);
  const parts = [];

  for (let i = 0; i < maxPartLen; i++) {
    const part = half() ? idiom1[i] || idiom2[i] : idiom2[i] || idiom1[i];

    parts.push(part);
  }

  let str = parts.join(' ');

  str = str.replace(/\{\{ (adj|nouns?) \}\}/g, (match, p1) => {
    if (p1 === NOUN_TOKEN) {
      const noun = getRandomElement(nouns, true);

      return pluralize.singular(noun);
    } else if (p1 === PLURAL_NOUN_TOKEN) {
      const noun = getRandomElement(nouns, true);

      return pluralize.plural(noun);
    } else if (p1 === ADJECTIVE_TOKEN) {
      const adj = getRandomElement(adjectives, true);

      return adj;
    }

    return '';
  });

  return fixArticles(str);
}

function fixArticles(str) {
  const matches = str.match(/ an? [a-z]/gi);

  if (matches) {
    matches.forEach((match) => {
      const lastChar = match.substr(match.length - 1).toLowerCase();

      if (VOWELS.includes(lastChar)) {
        str = str.replace(match, ` an ${ lastChar }`);
      }
    });
  }

  return str;
}

function getRandomElements(arr, num) {
  return shuffle(arr).slice(0, Math.min(num, arr.length));
}

function getRandomElement(arr, remove) {
  const idx = Math.floor(Math.random() * arr.length);

  if (remove) {
    return arr.splice(idx, 1)[0];
  }
  return arr[idx];
}

function randomAuthor() {
  return getRandomElement(Authors);
}

function randomImage() {
  return getRandomElement(Images);
}

exports.randomImage = randomImage;
exports.randomAuthor = randomAuthor;
exports.randomIdiom = randomIdiom;

