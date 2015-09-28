"use strict";

var test = require('tape')

test('Convert to CSL JSON', function (t) {
  var zoteroToCSL = require('./')

  t.plan(1);

  t.deepEqual(
    zoteroToCSL({
      itemType: 'book', 
      title: 'The Russian Anarchists',
      creators: [
        { creatorType: 'author', lastName: 'Avrich', firstName: 'Paul' }
      ],
      date: '1980'
    }),
    {
      type: 'book',
      author: [ { family: 'Avrich', given: 'Paul' } ],
      title: 'The Russian Anarchists',
      issued: { raw: '1980' }
    }
  )
});

test('Ignore fields not used for citations', function (t) {
  var zoteroToCSL = require('./')

  t.plan(1);

  t.deepEqual(
    zoteroToCSL({
      itemType: 'book',
      collections: [],
      relations: {},
      tags: []
    }),
    { type: 'book' }
  )
});
