# Octopush

A GUI for Capistrano

## Install

```
git clone https://github.com/octahedron/octopush.git
npm install
```

## Starting the App

In a shell, run `npm run dev`.  This will build `build/server.js` which contains the server-side
code to be run by nodejs and will run in watch mode to rebuild when changes are made.

In a separate shell, run `docker-compose up` to start the application in a docker container.
Docker has been configured to map port 80 of the host to port 3001 of the container which the
web-dev-server listens on.

## Adding Users

Adding users can be done via the CLI.  In the nodejs docker container, run `npm link` to provision
the `octopush` CLI utility.  Adding a user can the be achieved by passing a name and email to the
`users:add` command:

```
octopush users:add "Jane Doe" jane@doe.com
```

## Licence

[MIT](./LICENSE)
