# finite-field-js
Finite field implementation using the native BigInt arithmetic.

## Usage
```javascript
const { instantiateField } = await import('https://coins.github.io/finite-field-js/src/finite-field.js');

const FieldElement = instantiateField(101n);

const a = new FieldElement(2n);
const b = new FieldElement(13n);
console.log( a.mul(b) )
```