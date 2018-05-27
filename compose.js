/**
 *  Take multiple functions and compose them to create new function.
 *  If no functions are given return the identity function.
 */

export default function compose (...funcs) {
  if (funcs.length === 0) return arg => arg
  if (funcs.length === 1) return funcs[0]
  return funcs.reduce( (a, b) => (...args) => a(b(...args)) )
}

