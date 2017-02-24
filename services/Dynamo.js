'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const stringify = require('querystring').stringify;
const db = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: 'us-west-2',
});

const PRIMARY_KEY = 'idiom';

exports.get = (id) => {
  if (!id) {
    return Promise.reject(new Error('Missing required field ID'));
  }

  return db.get({
    TableName: 'idioms',
    Key: {
      id: PRIMARY_KEY,
      sort: id,
    },
  })
  .promise()
  .then((results) => {
    return results.Item;
  });
};

exports.create = ({ text, author }) => {
  return db.put({
    TableName: 'idioms',
    Item: {
      id: 'idiom',
      sort: uuid.v4(),
      text,
      author,
    },
  })
  .promise();
};

function random(key, sort, reverse) {
  if (!sort) {
    sort = uuid.v4();
  }

  const params = {
    TableName: 'idioms',
    Limit: 1,
    ProjectionExpression: 'id, sort, #text, author',
    KeyConditionExpression: `#sort ${ reverse ? '>' : '<' } :sort and #id = :id`,
    ExpressionAttributeNames: {
      '#sort': 'sort',
      '#text': 'text',
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': PRIMARY_KEY,
      ':sort': sort,
    },
  };

  if (key) {
    params.ExclusiveStartKey = {
      // id: PRIMARY_KEY,
      // sort: key,
      id: 'idiom',
      sort: key,
    };
  }

  return db.query(params)
    .promise()
    .then((results) => {
      const item = results.Items[0];

      console.log(results)

      const lastKey = (results.LastEvaluatedKey && results.LastEvaluatedKey.sort) || '';

      if (!item) {
        console.log('no item found');

        return random(null, sort, !reverse);
      }

      return {
        href: `/${ item.sort }`,
        next: `/random/${ lastKey }?${ stringify({ sort, reverse: !!reverse }) }`,
      };
    });
}

exports.random = random;
