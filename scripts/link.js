const fs = require('fs-extra');
const path = require('path');

const libsToLink = [
    {
        name: '@richapps/components',
        src: './dist/components',
    },
];

function link(target) {
    const name = target.name;
    const fromPath = path.resolve(target.src);
    const toPath = path.resolve(path.join(__dirname, '..', 'node_modules', name));
    const parentToDir = path.dirname(toPath);
    fs.ensureDirSync(parentToDir);

    if (fs.existsSync(path.resolve(fromPath))) {
        try {
            fs.symlinkSync(fromPath, toPath, 'junction');
            console.log('Symlink for ' + name + ' created.');
        } catch (e) {
            console.log('Symlink for ' + name + ' already exists.');
        }
    }
}

libsToLink.forEach((lib)=>{
    link(lib);
})
