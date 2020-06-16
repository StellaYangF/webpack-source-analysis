function readonly(target, key, descriptor) {
  descriptor.writable = false;
}

class Person {
  @readonly PI = 3.14;
}

Promise.resolve('OK').finally(() => console.log('finally OK'));