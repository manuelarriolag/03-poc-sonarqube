import fs from 'fs';

const newLineExpression = /\r\n|\n\r|\n|\r/g;

const removeDuplicatedAndEmptyLines = (text: string) => {
  return text.split(newLineExpression)
    .filter((item) => item.trim() !== '') // remove empty lines
    .filter((item, index, array) => array.indexOf(item) === index) // remove duplicated lines
    .join('\n');
};

export async function cleanContent(filename: string) {
  try {
    let data = fs.readFileSync(filename, 'utf8');
    let newData = removeDuplicatedAndEmptyLines(data);
    fs.writeFileSync(filename, newData);
    console.log(filename + ' FIXED');
  } catch (err) {
    console.log('Error', err);
  }
}

export function copyContent(outputDir: string, filename: string) {
  const newFilename = replaceOutDirectory(outputDir, filename);
  fs.copyFileSync(filename, newFilename);
  console.log(newFilename + ' COPIED');
}

function replaceOutDirectory(outputDir: string, originalPath: string): fs.PathLike {
  return originalPath.replace(outputDir, process.env.POSTGRESQL_DATA as string);
}
