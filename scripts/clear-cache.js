const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');

if (fs.existsSync(nextDir)) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('Successfully cleared .next build cache!');
  } catch (err) {
    console.error('Error removing .next:', err);
  }
} else {
  console.log('.next directory does not exist.');
}
