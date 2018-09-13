class Complex {
  constructor(real, img) {
    this.real = real
    this.img = img
  }

  add(other) {
    return new Complex(this.real + other.real, this.img + other.img)
  }

  minus(other) {
    return new Complex(this.real - other.real, this.img - other.img)
  }

  multiply(other) {
    return new Complex(this.real * other.real - this.img * other.img, this.real * other.img + this.img * other.real)
  }

  divide(other) {
    var other_length_square = other.length_square()
    if (other_length_square == 0) {
      throw "Can't divide 0"
    }

    return new Complex((this.real * other.real + this.img * other.img) / other_length_square,
      (this.img * other.real - this.real * other.img) / other_length_square)
  }

  length_square() {
    return this.real * this.real + this.img * this.img;
  }

  length() {
    return Math.sqrt(this.length_square())
  }

  uminus() {
    return new Complex(-this.real, -this.img)
  }

  theta() {
    var length = this.length()
    return Math.atan2(this.img / length, this.real / length)
  }

  pow(other) {
    var myLength = this.length()
    var myTheta = this.theta()

    var length = Math.pow(myLength, other.real)
    var realNumber = new Complex(length * Math.pow(Math.E, -myTheta * other.img), 0)

    var imgTheta = myTheta * other.real + other.img * Math.log(myLength)
    var imgPart = Complex.fromLengthAndAngel(1.0, imgTheta)

    return realNumber.multiply(imgPart)
  }

  toString() {
    if (this.img == 0)
      return this.real.toString()

    if (this.real == 0) {
      return this.img + "i";
    }

    if (this.img > 0)
      return this.real + "+" + (this.img == 1 ? "" : this.img) + "i"
    if (this.img < 0)
      return this.real + "" + (this.img == -1 ? "-" : this.img) + "i"
  }

  equals(other) {
    if (Math.abs(this.real - other.real ) < Complex.EPS && Math.abs( this.img - other.img) < Complex.EPS) {
      return true;
    }

    return false;
  }

  static fromLengthAndAngel(length, angel) {
    return new Complex(length * Math.cos(angel), length * Math.sin(angel))
  }

  static fromString(val) {
    var numberRE = /([0-9\.]+)\+([0-9\.]*)i/

    var match1 = val.match(numberRE)
    if (match1) {
      var firstPart = match1[1]
      var secondPart = match1[2] ? match1[2] : 1
      return new Complex(Number(firstPart), Number(secondPart))
    }

    var pureImgRE = /([0-9\.]+)i/
    var match3 = val.match(pureImgRE)
    if (match3) {
      return new Complex(0, Number(match3[1]))
    }

    var pureRealRE = /([0-9\.]+)/
    var match2 = val.match(pureRealRE)
    if (match2) {
      return new Complex(Number(match2[1]), 0)
    }

    throw "Can't parse variable"
  }
}

Complex.EPS = 0.000001

export {Complex}
