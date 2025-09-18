# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.

## Rename template
- Rename nodeDemo (match case) with your project name. -> e. testAppDemo
- Rename nodedemo (match case) with your project name. -> e. testappdemo
- Rename folder in app-> nodedemo-uimodule with your project name -> e. testappdemo-uimodule

## Setup db PostgreSQL
- npm add @cap-js/postgres
    cds env requires.db --for production
    output:
    {
        impl: '@cap-js/postgres',
        dialect: 'postgres',
        kind: 'postgres'
    }

## Profile pg-hybrid
- cf enable-ssh testRename-srv
- cf restart testRename-srv
- cf ssh -L 5432:<host>:<port> testRename-srv -> test in locale da bas

## DBeaver
- choco install cloudfoundry-cli
- cf login
- cf ssh -L 5432:<host>:<port> testRename-srv
- config DBeaver
    -host: localhost
    -port: 5432
    -database: nlnQABRfEtSE
    -nome: df1025bb5ab5
    -pass: 2fc8f6e204be910d9f2a779225d313