"use strict";

var cslMap = require('./typeMap.json')

function find(arr, fn) {
  var found;
  for (var i = 0; i < arr.length; i++) {
    if (fn(arr[i])) {
      found = arr[i];
      break;
    }
  }
  return found;
}

function update(dest, src) {
  Object.keys(src).forEach(function (key) {
    dest[key] = src[key];
  });
}

function mapForZoteroType(zoteroType) {
  return find(cslMap.map.zTypes.typeMap, function (map) {
    return map['@zType'] === zoteroType;
  });
}

function getCSLField(zoteroFieldName, typeMap) {
  var field
    , lookup
    , value

  field = find(typeMap.field, function (map) {
    return !map.creatorType ?
      map['@value'] === zoteroFieldName :
      find(map.creatorType, function (creatorMap) {
        return creatorMap['@value'] === zoteroFieldName
      })
  });

  if (!field) {
    throw new Error(
      'Could not find field ' +
      zoteroFieldName +
      ' for item type ' +
      typeMap['@zType']
    )
  }

  lookup = field['@baseField'] || zoteroFieldName;

  value = find(cslMap.map.cslFieldMap.map, function (map) {
    return map['@zField'] === lookup;
  });

  value = value || find(cslMap.map.cslCreatorMap.map, function (map) {
    return map['@zField'] === lookup;
  });

  return value ? value['@cslField'] : null;
}

function getCreators(zoteroCreators, typeMap) {
  var cslCreators = {}

  zoteroCreators.forEach(function (creator) {
    var creatorObject = {}
      , cslCreatorType

    if (!(creator.firstName || creator.lastName || creator.name)) return;

    cslCreatorType = getCSLField(creator.creatorType, typeMap);

    if (!cslCreators[cslCreatorType]) {
      cslCreators[cslCreatorType] = [];
    }

    if (creator.firstName || creator.lastName) {
      creator.firstName && (creatorObject.given = creator.firstName);
      creator.lastName && (creatorObject.family = creator.lastName);
    } else {
      creatorObject.literal = creator.name;
    }

    cslCreators[cslCreatorType].push(creatorObject);
  });

  return cslCreators;
}


module.exports = function (zoteroData) {
  var cslObject = {}
    , itemType = zoteroData.itemType
    , typeMap = mapForZoteroType(itemType);

  cslObject.type = typeMap['@cslType'];

  Object.keys(zoteroData).forEach(function (key) {
    var val = zoteroData[key]
      , field

    if (!val) return;

    switch (key) {
      case 'itemType':
      case 'tags':
      case 'relations':
      case 'collections':
        // Not used to generate a citation
        break;
      case 'creators':
        update(cslObject, getCreators(val, typeMap));
        break;
      case 'date':
        if (val) cslObject.issued = { raw: val };
        break;
      default:
        field = getCSLField(key, typeMap);
        if (field) cslObject[field] = val;
        break;
    }
  });

  return cslObject;
}
