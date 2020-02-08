# Finite Field
Experimental finite field implementation

## Usage
```javascript
const { _FQ } = await import('https://coins.github.io/finite-field-js/src/finite-field.js');

class FQ extends _FQ {
	static get modulus(){
		return 101n
	}
}

const a = new FQ(2n);
const b = new FQ(13n);
console.log( a.add(b) )
```