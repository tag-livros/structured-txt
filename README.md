# StructuredTXT 📃

A 0-dependency and 100% code-coverage library to build a structured TXT file in plain 

![License](https://img.shields.io/npm/l/structured-txt?style=plastic)
![Version](https://img.shields.io/npm/v/structured-txt)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/structured-txt?label=size)
![Tests](https://github.com/tag-livros/structured-txt/workflows/Test/badge.svg)

## Use cases

This library is intended to use, when you want to build a `.txt`-like file with structured data, this is, the position of the data in the file matters. This file format is mainly used to interact with old applications, where more structured data formats input is not available.

## Examples and Usage

The library returns a buffer, which can easily be converted to string with `Buffer.toString()`.

The usage of the available blueprints parameter can be seen below:

* `content`: function which receives the `data` (or the data parsed by `itemsBuilder`) and returns the item value
* `length`: length this field will occupy in the text
* `fillEnd` (optional, default: `' '`): what we will fill in the end of the field, if the size of the field is less than `length`
* `fillStart` (optional): if this value is passed, `fillEnd` is ignored. What we will fill in the start of the field, if the size of the field is less than `length` 

```javascript
const structuredTXT = require( 'structured-txt' )

const data = {
    id: 5,
    name: 'Very long person name'
}

const FIRST_BLOCK = {
    blueprints: [
        { content: () => 'HEADER', length: 6 },
        { content: () => '1', length: 2 },
        { content: (data) => data.id, length: 4, fillEnd: '# },
    ]
}
const SECOND_BLOCK = {
    blueprints: [
        { content: () => 'OTHER_LINE', length: 20, fillStart: ' ' },
        { content: (data) => data.name, length: 15 },
    ]
}

const blocks = [FIRST_BLOCK, SECOND_BLOCK]
const resultBuffer = structuredTXT.jsonToStructuredTxt(block, data)
```

The result if it was written to a file would be the following:
```
HEADER1 5###
          OTHER_LINEVery long perso
```

### itemsBuilder

If you want to build several lines, with the same block structure, you can use the `itemsBuilder` property in the `block` object. Example:

```javascript
const structuredTXT = require( 'structured-txt' )

const data = {
    id: 5,
    products: [ 'Product 1', 'Other Product with long name' ]
}

const block = {
    blueprints: [
        { content: () => 'LINE', length: 6 },
        { content: (data) => data.id, length: 4, fillEnd: '# },
        { content: (data) => data.idx, length: 2 },
        { content: (data) => data.productName, length: 20 },
    ],
    itemsBuilder: (data) => data.products.map( (productName, idx) => { ...data, productName, idx: idx + 1 } )
}

const resultBuffer = structuredTXT.jsonToStructuredTxt([block], data)
```

The result if it was written to a file would be the following:
```
LINE  5###1 Product 1           
LINE  5###2 Other Product with l
```

## License

This project is licensed with [ISC](./LICENSE.md)