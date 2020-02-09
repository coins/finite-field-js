import { mod_inv, mod_sqrt } from '../../numbers-js/src/numbers.js';

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
        const on = _n(other)
        return new this.constructor(this.n + on)
    }

    /**
     * Multiply a field element by this element.
     * @param {AbstractFieldElement} other - The other element.
     * @return {AbstractFieldElement} The product of both elements.
     */
    mul(other) {
        const on = _n(other)
        return new this.constructor(this.n * on)
    }

    /**
     * Subtract a field element from this element.
     * @param {AbstractFieldElement} other - The other element.
     * @return {AbstractFieldElement} The difference of both elements.
     */
    sub(other) {
        const on = _n(other)
        return new this.constructor(this.n - on)
    }

    /**
     * Multiply this element by another element's inverse.
     * @param {AbstractFieldElement} other - The other element.
     * @return {AbstractFieldElement} The quotient of both elements.
     */
    div(other) {
        const on = _n(other)
        return new this.constructor(this.n * mod_inv(on, this.constructor.modulus))
    }

    /**
     * Modular exponentiation with this element as base.
     * @param {BigInt} exponent - The exponent.
     * @return {AbstractFieldElement} This element raised to the power of the exponent.
     */
    pow(exponent) {
        if (exponent == 0n)
            return new this.constructor(1n)
        if (exponent == 1n)
            return new this.constructor(this.n)
        if (exponent < 0n)
            return this.inv().pow(-exponent)
        if (exponent % 2n == 0n)
            return this.mul(this).pow(exponent / 2n)
        else
            return this.mul(this).pow(exponent / 2n).mul(this)
    }

    /**
     * Modular square root
     * @param {BigInt} exponent - The exponent.
     * @return {AbstractFieldElement} This element raised to the power of the exponent.
     */
    sqrt() {
        return new this.constructor(mod_sqrt(this.n, this.constructor.modulus))
    }

    /**
     * Negate this element.
     * @return {AbstractFieldElement} The negative element.
     */
    neg() {
        return new this.constructor(-this.n)
    }

    /**
     * Compute the modular inverse of this element.
     * @return {AbstractFieldElement} The inverted element.
     */
    inv() {
        return new this.constructor(mod_inv(this.n, this.constructor.modulus))
    }

    /**
     * Square this element.
     * @return {AbstractFieldElement} This element squared.
     */
    square() {
        return this.mul(this)
    }


    /**
     * Compare if another element is equal to this element.
     * @return {boolean} Result of the comparison.
     */
    equals(other) {
        const on = _n(other)
        return this.n == on
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
        throw 'Called an abstract method!';
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

        static get modulus() {
            return m
        }
    }

    return FieldElement
}


function _n(other) {
    return BigInt((other.n || other.n === 0n || other.n === 0) ? other.n : other)
}