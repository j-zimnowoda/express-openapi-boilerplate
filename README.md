# Typescript Express OpenApi boilerplate

Implements simple REST application that fetches file list from S3 bucket.

## Project highlights

```
├── .github                   # CI pipeline
├── chart                     # Helm chart
│   ├── values.schema.json    # Helm values validation
├── dist                      # Nodejs build artifacts
├── src                       # App source code
│   ├── api-doc.yml           # Openapi spec definition
│   ├── api-routes
│   │   └── files.ts          # endpoint implementation with dependecy injection
│   ├── app.ts                # entrypoint
│   ├── env.ts                # spec for environment variables
│   └── spec.ts               # unit tests
```

## Local development
```
yarn install
yarn dev:watch
curl http://127.0.0.1:8080/files
```

Learn more about other existing commands by running `yarn run`

## Deploy in kubernetes
```
helm install myapp chart
```
