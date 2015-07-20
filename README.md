# Zotero to CSL
Convert [Zotero] JSON to [CSL-JSON], using the field mappings from
[https://github.com/aurimasv/z2csl](https://github.com/aurimasv/z2csl).

Before use in this library, the mapping file is converted to JSON using the
Python program [xml2json](https://github.com/hay/xml2json). This is done to
enable the library to work in both browsers and Node without having to deal
with differing XML parsers.

# Usage

```js
var zoteroToCSL = require('zotero-to-csl');

var zoteroData = {
  itemType: 'book',
  title: 'Deportation: Its meaning and menace.',
  creators: [
    {
      creatorType: 'author', 
      lastName: 'Berkman',
      firstName: 'Alexander',
    },
    {
      creatorType: 'author', 
      lastName: 'Goldman',
      firstName: 'Emma',
    }
  ],
  date: '1919'
}

var cslData = zoteroToCsl(zoteroData);
console.log(cslData)
/*
{
  type: 'book',
  title: 'Deportation: Its meaning and menace.'
  author: [
    { given: 'Alexander', family: 'Berkman' }
    { given: 'Emma', family: 'Goldman' }
  ],
  issued: { raw: '1919' }
}
*/
```

[Zotero]: http://zotero.org/
[CSL-JSON]: https://github.com/citation-style-language/schema
