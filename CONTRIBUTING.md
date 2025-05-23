# Contributing to Basemaps

We would love for you to contribute to basemaps and help make it even better than it is today! As a contributor, here are the guidelines we would like you to follow:

## Building

This repository requires [NodeJs](https://nodejs.org/en/) > 18

Use [n](https://github.com/tj/n) or [fnm](https://github.com/Schniz/fnm) to manage nodeJs versions

```bash
# Download the latest nodejs 
n latest
# Install node deps
npm install

# Build everything into /build
npm run build

# Run the unit tests
npm run test
```

For a fresh rebuild

```bash
npm run clean
```

## Packages

this repository is a monorepo for everything related to basemaps

- [@basemaps/test](packages/__tests__/) - Testing utilities and assets
- [@basemaps/infra](packages/_infra/) - Infrastructure code using [AWS CDK](https://github.com/aws/aws-cdk)
- [@basemaps/attribution](packages/attribution/) - Calculate the attribution for given map location
- [@basemaps/bathymetry](packages/bathymetry/) - Convert bathymetry from [GEBCO](https://www.gebco.net/) into colorized HillShade geotiff.
- [@basemaps/cli](packages/cli/) - cli that using for CICD process
- [@basemaps/cli-raster](packages/cli-raster/) - CLI to re-tile imagery into a Cloud Optimised Geotiffs (COG)
- [@basemaps/config](packages/config/) - Configurations for Basemaps system
- [@basemaps/geo](packages/geo/) - Utility to work with QuadKeys, Tiles and Projections.
- [@basemaps/lambda-analytics](packages/lambda-analytics/) - Generate analytics from CloudFront distribution statistics
- [@basemaps/lambda-tiler](packages/lambda-tiler/) - Lambda server for WMTS/XYZ map generation
- [@basemaps/landing](packages/landing/) - The landing page for Basemaps
- [@basemaps/server](packages/server/) - cli for WMTS/XYZ Tile server
- [@basemaps/shared](packages/shared/) - Shared Utilities for other Basemaps packages
- [@basemaps/smoke](packages/smoke/) - Smoke tests
- [@basemaps/sprites](packages/sprites/) - sprite sheet generation
- [@basemaps/tiler](packages/tiler/) - Compose CogGeoTiffs for xyz tile server
- [@basemaps/tiler-sharp](packages/tiler-sharp/) - Generate tiles by using [sharp](https://github.com/lovell/sharp) and [libvips](https://github.com/libvips/libvips)
- [@linzjs/docker-command](packages/linzjs-docker-command/) - Utilities for running commands inside Docker
- [@linzjs/geojson](packages/linzjs-geojson/) - Utility for working with GeoJSON
- [@linzjs/metrics](packages/linzjs-metrics/) - Simple timing metric tracker for NodeJS


## Commit message

This repository uses [Conventional Commits](https://www.conventionalcommits.org/)

We have very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking through the project history. But also, we use the git commit messages to generate the change log.

### Type

Must be one of the following:

- build: Changes that affect the build system or external dependencies
- ci: Changes to our CI configuration files and scripts
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- style: Changes that do not affect the meaning of the code
- test: Adding missing tests or correcting existing tests
