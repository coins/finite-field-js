// TODO: cleanup this file! 

// A class for elements in extension fields
export class _FQP {

    constructor(coeffs) {
        // assert(coeffs.length == this.degree)
        this.coeffs = coeffs.map(c => new this.constructor.FQ(c))
    }

    get degree() {
        return this.constructor.modulus_coeffs.length
    }

    add(other) {
        if (!isinstance(other, this.class)) throw Error();
        return new this.constructor(zip(this.coeffs, other.coeffs).map(e => e[0].add(e[1])))
    }

    sub(other) {
        if (!isinstance(other, this.class)) throw Error();
        return new this.constructor(zip(this.coeffs, other.coeffs).map(e => e[0].sub(e[1])))
    }

    mul(other) {
        if (other instanceof this.constructor.FQ || typeof(other) == 'bigint' || typeof(other) == 'number') {
            return new this.constructor(this.coeffs.map(c => c.mul(other)))
        } else {
            assert(other instanceof this.prototype.constructor)
            let b = zeros(this.degree * 2 - 1).map(z => new this.constructor.FQ(z))

            for (let i = 0; i < this.degree; i++) {
                for (let j = 0; j < this.degree; j++) {
                    b[i + j] = b[i + j].add(this.coeffs[i].mul(other.coeffs[j]))
                }
            }

            while (b.length > this.degree) {
                let exp = b.length - this.degree - 1
                let top = b.pop()
                for (let i = 0; i < this.degree; i++) {
                    b[exp + i] = b[exp + i].sub(top.mul(this.constructor.modulus_coeffs[i]))
                }
            }

            return new this.constructor(b)
        }

    }

    div(other) {
        if (other instanceof this.constructor.FQ || other instanceof BigInt) {
            return new this.constructor(this.coeffs.map(c => c.div(other)))
        } else {
            assert isinstance(other, this.class)
            return this.mul(other.inv())
        }
    }

    pow(other) {
        if (other == 0n)
            return this.constructor.one()
        else if (other == 1n)
            return new this.constructor(this.coeffs)
        else if (other % 2n == 0n)
            return this.mul(this).pow(other / 2n)
        else
            return this.mul(this).pow(other / 2n).mul(this)
    }

    // Extended euclidean algorithm used to find the modular inverse
    inv() {
        let lm = [1].concat(zeros(this.degree)).map(c => new this.constructor.FQ(c))
        let hm = zeros(this.degree + 1).map(c => new this.constructor.FQ(c))

        let low = this.coeffs.concat([new this.constructor.FQ(0)])
        let high = this.constructor.modulus_coeffs.concat([new this.constructor.FQ(1)])

        while (deg(low)) {
            let r = poly_rounded_div(high, low, this.constructor.FQ)
            r = r.concat(zeros(this.degree + 1 - r.length))
            let nm = hm.map(x => new this.constructor.FQ(x))
            let next = high.map(x => new this.constructor.FQ(x))
            for (let i = 0; i < this.degree + 1; i++) {
                for (let j = 0; j < this.degree + 1 - i; j++) {
                    nm[i + j] = nm[i + j].sub(lm[i].mul(r[j]));
                    next[i + j] = next[i + j].sub(low[i].mul(r[j]));
                }
            }
            [lm, low, hm, high] = [nm, next, lm, low]
        }
        return new this.constructor(lm.slice(0, this.degree)).div(low[0])
    }

    squared() {
        return this.mul(this)
    }

    eq(other) {
        for (let i = 0; i < this.coeffs.length; i++) {
            if (this.coeffs[i].ne(other.coeffs[i]))
                return false
        }
        return true
    }

    ne(other) {
        return !this.eq(other)
    }

    neg(self) {
        return new this.constructor(this.coeffs.map(c => c.neg()))
    }

    static one() {
        const v = zeros(this.prototype.degree - 1)
        v.unshift(1)
        return new this.prototype.constructor(v)
    }

    static zero() {
        return new this.prototype.constructor(zeros(this.prototype.degree))
    }

}

// Utility methods for polynomial math
function deg(p) {
    let d = p.length - 1
    while ((p[d] === 0n || p[d].n === 0n) && d) {
        d -= 1
    }
    return d
}

function zip(a, b) {
    const r = []
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
        r.push([a[i], b[i]])
    }
    return r
}

function zeros(n) {
    const v = []
    for (let i = 0; i < n; i++) {
        v.push(0n)
    }
    return v
}

function poly_rounded_div(a, b, FQ) {
    let dega = deg(a)
    let degb = deg(b)
    let temp = a.map(x => new FQ(x))
    let o = a.map(x => new FQ(0n))
    for (let i = dega - degb; i > -1; i--) {
        o[i] = o[i].add(temp[degb + i].div(b[degb]))
        for (let c = 0; c < degb + 1; c++) {
            temp[c + i] = temp[c + i].sub(o[c])
        }
    }
    return o.slice(0, deg(o) + 1)
}