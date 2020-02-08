# Finite Field
Experimental finite field implementation

## Usage
```javascript
const { FiniteField } = await import('https://coins.github.io/finite-field-js/src/finite-field.js');

const FQ = instantiateField(101n);

const a = new FQ(2n);
const b = new FQ(13n);
console.log( a.add(b) )
```