const notifier = require('node-notifier');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const srcFolder = path.join(__dirname, '..', 'src');
const yamlDir = path.join(srcFolder, 'config');
const notify = (title, message) => {
  notifier.notify(
    {
      title,
      message,
      sound: true,
      wait: false,
    },
  );
};
exports.yamlToJSON = () => {
  const yamlFiles = fs.readdirSync(yamlDir);
  const JSON_DATA = {
    PT_SITE: {
    },
  };
  try {
    yamlFiles.forEach(file => {
      const fileName = file.replace('.yaml', '');
      const source = fs.readFileSync(yamlDir + '/' + file, 'UTF-8');
      JSON_DATA.PT_SITE[fileName] = YAML.parse(source);
    });
    fs.writeFileSync(`${srcFolder}/config.json`, JSON.stringify(JSON_DATA, null, 2));
  } catch (error) {
    notify('yamlToJSON Error', `${error.name}:${error.message}`);
    console.log(error);
  }
};

exports.notify = notify;
