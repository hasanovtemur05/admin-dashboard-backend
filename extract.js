const fs = require('fs');
const path = require('path');
const content = fs.readFileSync('scaffold.py', 'utf8');

// A simple parser
const entries = [];
const lines = content.split('\n');
let currentFile = null;
let currentContent = [];
let inString = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!inString) {
    const match = line.match(/^\s*'([^']+)'\s*:\s*textwrap\.dedent\('''(.*)$/);
    const matchEmpty = line.match(/^\s*'([^']+)'\s*:\s*'',/);
    if (match) {
      currentFile = match[1];
      inString = true;
      if (match[2]) {
        currentContent.push(match[2]);
      }
    } else if (matchEmpty) {
      entries.push({ file: matchEmpty[1], content: '' });
    }
  } else {
    if (line.match(/^'''\),?/)) {
      inString = false;
      let text = currentContent.join('\n');
      if (text.startsWith('\n')) text = text.slice(1);
      entries.push({ file: currentFile, content: text });
      currentFile = null;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
}

entries.forEach(e => {
  const p = path.join(__dirname, e.file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, e.content);
  console.log('Created ' + e.file);
});
