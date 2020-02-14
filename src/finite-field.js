import { mod_inv, mod_exp, mod_sqrt } from '../../numbers-js/numbers.js';

/** 
 * Abstract class for finite field elements.
 * To instantiate a subclass use `instantiateField(m)`.
 * @private
 */
class AbstractFieldElement {

    /**
     * Create a field element.
     * @param {number} n - The element's integer.
     */
    constructor(n) {
        n = toBigInt(n)
        this.n = n % this.constructor.modulus
        if (this.n < 0) // Fix sign of x mod n for negative x
            this.n += this.constructor.modulus
    }

    /**
     * Add a field element to this element.
     * @param {FieldElement} other - The other element.
     * @return {FieldElement} The sum of both elements.
     */
    add(other) {
        const n = toBigInt(other)
        return new this.constructor(this.n + n)
    }

    /**
     * Subtract a field element from this element.
     * @param {FieldElement} other - The other element.
     * @return {FieldElement} The difference of both elements.
     */
    sub(other) {
        const n = toBigInt(other)
        return new this.constructor(this.n - n)
    }

    /**
     * Multiply a field element by this element.
     * @param {FieldElement} other - The other element.
     * @return {FieldElement} The product of both elements.
     */
    mul(other) {
        const n = toBigInt(other)
        return new this.constructor(this.n * n)
    }

    /**
     * Multiply this element by another element's inverse.
     * @param {FieldElement} other - The other element.
     * @return {FieldElement} The quotient of both elements.
     */
    div(other) {
        const n = toBigInt(other)
        const div = this.n * mod_inv(n, this.constructor.modulus)
        return new this.constructor(div)
    }

    /**
     * Modular exponentiation with this element as base.
     * @param {BigInt} exponent - The exponent.
     * @return {FieldElement} This element raised to the power of the exponent.
     */
    pow(exponent) {
        const pow = mod_exp(this.n, exponent, this.constructor.modulus)
        return new this.constructor(pow)
    }

    /**
     * Negate this element.
     * @return {FieldElement} The negative element.
     */
    neg() {
        const negative = -this.n
        return new this.constructor(negative)
    }

    /**
     * Compute the modular inverse of this element.
     * @return {FieldElement} The inverted element.
     */
    inv() {
        const inverse = mod_inv(this.n, this.constructor.modulus)
        return new this.constructor(inverse)
    }

    /**
     * Square this element.
     * @return {FieldElement} This element squared.
     */
    square() {
        return this.mul(this)
    }

    /**
     * Modular square root
     * @return {FieldElement} This element raised to the power of the exponent.
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
        const n = toBigInt(other)
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
     * Encode this element in hex.
     * @return {String} - The hex string.
     */
    toHex() {
        let hex = this.n.toString(16)
        if (hex.length % 2) { hex = '0' + hex }
        return hex
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
     * The field's modulus. Every subclass has to implement this.
     * @return {BigInt} - The modulus.
     */
    static get modulus() {
        throw 'Error: abstract method!';
    }

    /**
     * The order of the group of field elements.
     * @return {BigInt} - The order.
     */
    static get order() {
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

        /**
         * The order of the group of field elements.
         * @return {BigInt} - The order.
         */
        static get order() {
            return m - 1n
        }
    }

    return FieldElement
}

/** 
 * Helper method to get a FieldElement's BigInt.
 * @param {FieldElement} other - The other field.
 * @return {BigInt} - The field element's BigInt.
 */
function toBigInt(other) {
    return BigInt((other.n || other.n === 0n || other.n === 0) ? other.n : other)
}