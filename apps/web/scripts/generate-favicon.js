const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

const input = path.join(__dirname, '..', 'public', 'brand-icon.png');
const output = path.join(__dirname, '..', 'public', 'favicon.ico');

if (!fs.existsSync(input)) {
  console.error('Input PNG not found:', input);
  process.exit(1);
}

pngToIco(input)
  .then((buf) => {
    fs.writeFileSync(output, buf);
    console.log('Generated', output);
  })
  .catch((err) => {
    console.error('Failed to generate favicon.ico:', err);
    process.exit(1);
  });
