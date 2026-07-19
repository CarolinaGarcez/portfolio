const fs=require('fs');
let c=fs.readFileSync('index.html', 'utf8');
c = c.replace(/ \/ width=/g, ' width=');
c = c.replace(/loading="eager">/g, 'loading="eager" />');
c = c.replace(/loading="lazy">/g, 'loading="lazy" />');
fs.writeFileSync('index.html', c);
