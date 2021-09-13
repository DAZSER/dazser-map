# dazser-map

[![Node.js CI](https://github.com/DAZSERMgmt/dazser-map/actions/workflows/test-dist.yml/badge.svg)](https://github.com/DAZSERMgmt/dazser-map/actions/workflows/test-dist.yml) [![CodeQL](https://github.com/DAZSERMgmt/dazser-map/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/DAZSERMgmt/dazser-map/actions/workflows/codeql-analysis.yml)

This is the initial Landing page for www.dazser.com

Comes with Geolocation API

## Testing
- `npm run test` will run a build in `.build` and start a test server

## Build and deploy instructions
- `npm run dist` will run a build, then convert it to a wordpress compatible theme.
- For now, `dist/style.css`'s `Version: ` should be updated to the same version as `package.json` (Hoping to [automate this](https://superuser.com/questions/1675983/using-the-output-of-a-piped-sed-for-the-replacement-value-of-a-second-sed); see `package.json`'s `dist:replace:version`)
- Upload the `dist` folder to `/mnt/efs/fs1/wordpress/wp-content/themes/dazser-map`
