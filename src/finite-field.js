import { mod_inv, mod_exp, mod_sqrt } from '../../numbers-js/numbers.js';

/** 
 * Abstract class for finite field elements.
 * To instantiate a subclass use `instantiateField(m)`.
 */
export class AbstractFieldElement {

    /**
     * Create a field element.
     * @param {number} n - The element's integer.
     */
    constructor(n) {
        n = _n(n)
        this.n = n % this.constructor.modulus
        if (this.n < 0) // Fix sign of x mod n for negative x
            this.n += this.constructor.modulus
    }

    /**
     * Add a field element to this element.
     * @param {AbstractFieldElement} other - The other element.
     * @return {AbstractFieldElement} The sum of both elements.
     */
    add(other) {
        const n = _n(other)
        return new this.constructor(this.n + n)
    }

    /**
     * Subtract a field element from this element.
     * @param {AbstractFieldElement} other - The other element.
     * @return {AbstractFieldElement} The difference of both elements.
     */
    sub(other) {
        const n = _n(other)
        return new this.constructor(this.n - n)
    }

    /**
     * Multiply a field element by this element.
     * @param {AbstractFieldElement} other - The other element.
     * @return {AbstractFieldElement} The product of both elements.
     */
    mul(other) {
        const n = _n(other)
        return new this.constructor(this.n * n)
    }

    /**
     * Multiply this element by another element's inverse.
     * @param {AbstractFieldElement} other - The other element.
     * @return {AbstractFieldElement} The quotient of both elements.
     */
    div(other) {
        const n = _n(other)
        const div = this.n * mod_inv(n, this.constructor.modulus)
        return new this.constructor(div)
    }

    /**
     * Modular exponentiation with this element as base.
     * @param {BigInt} exponent - The exponent.
     * @return {AbstractFieldElement} This element raised to the power of the exponent.
     */
    pow(exponent) {
        const pow = mod_exp(this.n, exponent, this.constructor.modulus)
        return new this.constructor(pow)
    }

    /**
     * Negate this element.
     * @return {AbstractFieldElement} The negative element.
     */
    neg() {
        const negative = -this.n
        return new this.constructor(negative)
    }

    /**
     * Compute the modular inverse of this element.
     * @return {AbstractFieldElement} The inverted element.
     */
    inv() {
        const inverse = mod_inv(this.n, this.constructor.modulus)
        return new this.constructor(inverse)
    }

    /**
     * Square this element.
     * @return {AbstractFieldElement} This element squared.
     */
    square() {
        return this.mul(this)
    }

    /**
     * Modular square root
     * @param {BigInt} exponent - The exponent.
     * @return {AbstractFieldElement} This element raised to the power of the exponent.
     */
    sqrt() {
        const sqrt = mod_sqrt(this.n, this.constructor.modulus)
        return new this.constructor(sqrt)
    }

    /**
     * Compare if another element is equal to this element.
     * @return {boolean} Result of the comparison.
     */
    equals(other) {
        const n = _n(other)
        return this.n === n
    }

    /**
     * Compare if another element is not equal to this element.
     * @return {boolean} Result of the comparison.
     */
    notEquals(other) {
        return !this.equals(other)
    }

    /**
     * The neutral element of addition.
     * @return {boolean} Result of the comparison.
     */
    static zero() {
        return new this.prototype.constructor(0n)
    }

    /**
     * The neutral element of multiplication.
     * @return {boolean} Result of the comparison.
     */
    static one() {
        return new this.prototype.constructor(1n)
    }

    /** 
     * The field's modulus. Any subclass has to implement this.
     * @return {BigInt} - The modulus
     * 
     */
    static get modulus() {
        throw 'Error: abstract method!';
    }

}

/** 
 * Helper method to instantiate a FieldElement class with a particular modulus.
 * @param {BigInt} m - The field's modulus.
 * @return {FieldElement} - The field element class.
 */
export function instantiateField(m) {

    /**
     * Class for finite field elements.
     * @extends AbstractFieldElement
     */
    class FieldElement extends AbstractFieldElement {

        /** 
         * The field's modulus. 
         * @return {BigInt} - The modulus.
         * 
         */
        static get modulus() {
            return m
        }
    }

    return FieldElement
}

/** 
 * Helper method to get a FieldElement's BigInt.
 * @param {FieldElement} other - The other field.
 * @return {BigInt} - The field element's BigInt.
 */
function _n(other) {
    return BigInt((other.n || other.n === 0n || other.n === 0) ? other.n : other)
}