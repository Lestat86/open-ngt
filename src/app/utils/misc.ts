// eslint-disable-next-line @typescript-eslint/no-var-requires
const iqr = require('compute-iqr');

export const getIqr = (values:number []) => {
  return Number(iqr(values));
};
