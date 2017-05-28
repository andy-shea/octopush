# Octopush

A GUI for Capistrano

## Install

```
git clone https://github.com/octahedron/octopush.git
cd octopush
yarn
```

## Starting the App

Run `docker-compose up` to start the application in a docker container.
Docker has been configured to map port 80 of the host to port 3000 of the container which the
express server listens on.  Hot updates will occur on both server-side and client-side code changes.

## Adding Users

Adding users can be done via the CLI.  In the nodejs docker container, run `npm link` to provision
the `octopush` CLI utility.  Adding a user can be achieved by passing a name and email to the
`users:add` command:

```
octopush users:add "Jane Doe" jane@doe.com
```

## Licence

[MIT](./LICENSE)
