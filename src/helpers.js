import fs from 'fs';

export const readFile = path => {
  try {
    const file = fs.readFileSync(path, 'utf8');

    return JSON.parse(file);
  } catch (error) {
    return;
  }
};

export const writeToFile = (name, data) => fs.writeFileSync(name, JSON.stringify(data));
