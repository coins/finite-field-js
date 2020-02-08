import { mod_inv } from '../../numbers-js/src/numbers.js';


/** 
 * Instantiate a FieldElement class for a given modulus
 * @param {BigInt} m - The field's modulus
 * @return {FieldElement} - The field element class
 *
 */
export function instantiateField(m) {

    return class Field extends FieldElement {

        static get modulus() {
            return m
        }
    }
}

/** 
 * An abstract class for finite field elements.
 *
 */
export class FieldElement {

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
     * @param {FieldElement} other - The other element.
     * @return {FieldElement} The sum of both elements.
     */
    add(other) {
        const on = _n(other)
        return new this.constructor(this.n + on)
    }

    /**
     * Multiply a field element by this element.
     * @param {FieldElement} other - The other element.
     * @return {FieldElement} The product of both elements.
     */
    mul(other) {
        const on = _n(other)
        return new this.constructor(this.n * on)
    }

    /**
     * Subtract a field element from this element.
     * @param {FieldElement} other - The other element.
     * @return {FieldElement} The difference of both elements.
     */
    sub(other) {
        const on = _n(other)
        return new this.constructor(this.n - on)
    }

    /**
     * Multiply this element by another element's inverse.
     * @param {FieldElement} other - The other element.
     * @return {FieldElement} The quotient of both elements.
     */
    div(other) {
        const on = _n(other)
        return new this.constructor(this.n * mod_inv(on, this.constructor.modulus))
    }

    /**
     * Modular exponentiation with this element as base.
     * @param {BigInt} exponent - The exponent.
     * @return {FieldElement} This element raised to the power of the exponent.
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
     * Negate this element.
     * @return {FieldElement} The negative element.
     */
    neg() {
        return new this.constructor(-this.n)
    }

    /**
     * Compute the modular inverse of this element.
     * @return {FieldElement} The inverted element.
     */
    inv() {
        return new this.constructor(mod_inv(this.n, this.constructor.modulus))
    }

    /**
     * Square this element.
     * @return {FieldElement} This element squared.
     */
    square() {
        return this.mul(this)
    }


    /**
     * Compare if another element is equal to this element.
     * @return {boolean} Result of the comparison.
     */
    eq(other) {
        const on = _n(other)
        return this.n == on
    }

    /**
     * Compare if another element is not equal to this element.
     * @return {boolean} Result of the comparison.
     */
    ne(other) {
        return !this.eq(other)
    }

    /**
     * The additive neutral element.
     * @return {boolean} Result of the comparison.
     */
    static zero() {
        return new this.prototype.constructor(0n)
    }

    /**
     * The multiplicative neutral element.
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


function _n(other) {
    return BigInt((other.n || other.n === 0n || other.n === 0) ? other.n : other)
}