// import Vue from 'vue';
// import HelloWorld from '@/components/HelloWorld';
import {Complex} from '@/components/lib/Complex.js'

// describe('HelloWorld.vue', () => {
//   it('should render correct contents', () => {
//     const Constructor = Vue.extend(HelloWorld);
//     const vm = new Constructor().$mount();
//     expect(vm.$el.querySelector('.hello h1').textContent)
//       .toEqual('Welcome to Your Vue.js App');
//   });
// });

describe("Complex", () => {
  it('Complex operations are correct', () => {
    var complex1 = new Complex(1, 1)
    expect(complex1.real).toEqual(1)
    expect(complex1.img).toEqual(1)

    expect(Complex.fromString("1+i").equals(complex1)).toEqual(true)
    expect(Math.abs(complex1.length() - Math.sqrt(2)) < Complex.EPS).toEqual(true)
    expect(Math.abs(complex1.theta() - Math.PI / 4) < Complex.EPS).toEqual(true)

    var complex2 = new Complex(1, -1)
    expect(complex1.divide(complex2).equals(new Complex(0, 1))).toEqual(true)
    expect(complex1.pow(complex2).equals(new Complex(
      Math.sqrt(2) * Math.pow(Math.E, Math.PI / 4) * Math.cos(Math.PI / 4 - Math.log(2) / 2),
      Math.sqrt(2) * Math.pow(Math.E, Math.PI / 4) * Math.sin(Math.PI / 4 - Math.log(2) / 2)
      )
    )).toEqual(true)

    expect(complex1.add(complex2).equals(new Complex(2, 0))).toEqual(true)
    expect(complex1.minus(complex2).equals(new Complex(0, 2))).toEqual(true)

    expect(complex1.uminus().equals(new Complex(-1, -1))).toEqual(true)

    expect(new Complex(123.45, 456.78).equals(Complex.fromString("123.45+456.78i"))).toEqual(true)

    expect(new Complex(123.45, 0).equals(Complex.fromString("123.45"))).toEqual(true)

    expect(new Complex(0, 456.78).equals(Complex.fromString("456.78i"))).toEqual(true)

    expect(new Complex(0, 0).toString()).toEqual("0")

    expect(new Complex(1, 0).toString()).toEqual("1")
    expect(new Complex(1, 1).toString()).toEqual("1+i")
    expect(new Complex(1, -1).toString()).toEqual("1-i")
    expect(new Complex(0, 100).toString()).toEqual("100i")
    expect(new Complex(9.2, 9.33).toString()).toEqual("9.2+9.33i")
    expect(new Complex(9.2, -9.33).toString()).toEqual("9.2-9.33i")
    expect(complex1.equals(complex2)).toEqual(false)

    try {
      new Complex(0, 0).divide(new Complex(0, 0))
      fail("Can't divide by zero")
    } catch (e) {
    }

    try {
      Complex.fromString("asdfasdf")
      fail("Can't parse this string")
    } catch (e) {

    }
  })
})
