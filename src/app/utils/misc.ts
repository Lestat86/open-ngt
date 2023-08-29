// eslint-disable-next-line @typescript-eslint/no-var-requires
const iqr = require('compute-iqr');

export const getIqr = (values:number []) => {
  return Number(iqr(values));
};

export const downloadFile = (fileBlob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(fileBlob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
