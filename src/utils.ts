import fs from 'fs';

const newLineExpression = /\r\n|\n\r|\n|\r/g;

const removeDuplicatedLines = (text: string) => {
    return text.split(newLineExpression)
        .filter((item, index, array) => array.indexOf(item) === index)
        .join('\n');
};

export async function removeDuplicatedHeaders(filename: string){
    try {
        let data = fs.readFileSync(filename, 'utf8');
        let newData = removeDuplicatedLines(data);
        fs.writeFileSync(filename, newData);                    
        console.log(filename + ' FIXED');
      } catch (err) {
        console.log('Error', err);
      }
}


