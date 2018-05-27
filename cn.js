const classes = x => typeof x === 'object'
  ? Object.keys(x).reduce( (a, b) => `${a} ${ !!x[b] ? b : ''}`, '')
  : typeof x === 'string'
    ? x
    : JSON.stringify(x)

const dedupe = (strings, ...values) =>
  [ ...new Set (
    strings.map ( (string, index) =>
      values [index] ? `${ string }${ classes(values[index]) }` : string
    ).join('').split(/\s/)
  )].join(' ');

export default dedupe;
