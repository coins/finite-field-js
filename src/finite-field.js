// import { assert } from '../utils.js'
import { mod_inv } from '../../numbers-js/src/numbers.js';

function _n(other) {
    return BigInt((other.n || other.n === 0n || other.n === 0) ? other.n : other)
}

// An abstract class for field elements in FQ. Wrap a number in this class,
// and it becomes a field element.
// subclasses need to implement `FQ.modulus`
export class _FQ {

    constructor(n) {
        n = _n(n)
        this.n = n % this.constructor.modulus
        if (this.n < 0)
            this.n += this.constructor.modulus // Fix sign of x mod n for negative x
    }

    add(other) {
        const on = _n(other)
        return new this.constructor(this.n + on)
    }

    mul(other) {
        const on = _n(other)
        return new this.constructor(this.n * on)
    }

    sub(other) {
        const on = _n(other)
        return new this.constructor(this.n - on)
    }

    div(other) {
        const on = _n(other)
        return new this.constructor(this.n * mod_inv(on, this.constructor.modulus))
    }

    inv() {
        return new this.constructor(mod_inv(this.n, this.constructor.modulus))
    }

    squared() {
        return this.mul(this)
    }

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

    eq(other) {
        const on = _n(other)
        return this.n == on
    }

    ne(other) {
        return !this.eq(other)
    }

    neg(self) {
        return new this.constructor(-this.n)
    }

    static one() {
        return new this.prototype.constructor(1n)
    }

    static zero() {
        return new this.prototype.constructor(0n)
    }
}

