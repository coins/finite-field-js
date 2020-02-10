import './jasmine-3.5.0/boot.js'
import { instantiateField } from '../finite-field.js'

describe('A FieldElement', function() {
    let modulus = 59n
    let FieldElement = instantiateField(modulus)
    let fieldElement;

    beforeEach(function() {
        fieldElement = new FieldElement(42n)
    })

    describe('has binary operations', function() {

        it('can add another element', function() {
            const other = new FieldElement(20n);
            expect(fieldElement.add(other).n).toBe(3n)
        })

        it('can subtract another element', function() {
            const other = new FieldElement(20n);
            expect(fieldElement.sub(other).n).toBe(22n)
        })

        it('can multiply another element', function() {
            const other = new FieldElement(10n);
            expect(fieldElement.mul(other).n).toBe(7n)
        })

        it('can be exponentiated', function() {
            const exponent = 42n
            expect(fieldElement.pow(exponent).n).toBe(15n)
        })
    })



    describe('has unary operations', function() {

        it('can negate itself', function() {
            expect(fieldElement.neg().n).toBe(17n)
        })

        it('can invert itself', function() {
            expect(fieldElement.inv().n).toBe(52n)
        })

        it('can square itself', function() {
            expect(fieldElement.square().n).toBe(53n)
        })

        it('can compute the square root of itself', function() {
            expect(fieldElement.sqrt().n).toBe(31n)
        })

    })
})