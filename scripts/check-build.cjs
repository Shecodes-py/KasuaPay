const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..','dist');
for(const file of fs.readdirSync(root).filter(x=>x.endsWith('.js')))execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'inherit'});
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g))if(!fs.existsSync(path.join(root,match[1])))throw Error('Missing asset: '+match[1]);
console.log('All browser scripts and referenced assets checked. Static output: dist/');
