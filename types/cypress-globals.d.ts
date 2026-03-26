declare namespace Cypress {
  interface Chainable<Subject = any> {}
}

declare var cy: any
declare function describe(name: string, fn: Function): void
declare function it(name: string, fn: Function): void
declare function before(fn: Function): void
declare function after(fn: Function): void
declare function expect(...args: any[]): any
