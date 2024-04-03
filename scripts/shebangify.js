const fs = require('fs')

const path = process.argv[2]
const data = '#!/usr/bin/env node\n\n' + fs.readFileSync(path)

fs.writeFileSync(path, data)
