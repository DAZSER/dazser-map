# dazser-map

[![Node.js CI](https://github.com/DAZSERMgmt/dazser-map/actions/workflows/test-dist.yml/badge.svg)](https://github.com/DAZSERMgmt/dazser-map/actions/workflows/test-dist.yml) [![CodeQL](https://github.com/DAZSERMgmt/dazser-map/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/DAZSERMgmt/dazser-map/actions/workflows/codeql-analysis.yml)

This is the initial Landing page for www.dazser.com

Comes with Geolocation API

## Testing
- `npm run test` will run a build in `.build` and start a test server

## Build and deploy instructions
- `npm run dist` will run a build, then convert it to a wordpress compatible theme.
- Upload the `dist` folder to `/mnt/efs/fs1/wordpress/wp-content/themes/dazser-map`
  - `sudo rm -rf /mnt/efs/fs1/wordpress/wp-content/themes/dazser-map`
  - `sudo mv ~/dist /mnt/efs/fs1/wordpress/wp-content/themes/dazser-map`
  - `sudo chown www-data:www-data /mnt/efs/fs1/wordpress/wp-content/themes/dazser-map -R`
