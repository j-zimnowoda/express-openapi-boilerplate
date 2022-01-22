# Typescript Express OpenApi boilerplate

Implements sample application REST application that fetches file list from S3 bucket.
## Project structure
```
├── .github       # CI pipeline
├── chart         # Helm chart definition
├── dist          # Yarn build artifacts
├── src           # app source code
├── terraform     # Infrastructure as a code (S3)
```

## Local development
```
yarn install
yarn dev:watch
```

Learn more about other existing commands by running `yarn run`

## Deploy in kubernetes
```
helm install myapp chart
```
