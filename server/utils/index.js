/* eslint-disable */
const Console = {
  log: (...args) => {
    console.log(...args);
  },
  error: (...args) => {
    console.error(...args);
  },
};

const makeQuery = user => {
  return Object.entries(user).reduce((query, [k, v], i) => {
    if (!v) return query;
    return `${query}${i > 0 ? '&' : ''}${k}=${v}`;
  }, '');
};

export { Console, makeQuery };
