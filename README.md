# @resultify/rh-cli
Resultify command line tool

[![Run tests](https://github.com/Resultify/rh-cli/actions/workflows/test.yml/badge.svg)](https://github.com/Resultify/rh-cli/actions/workflows/test.yml)
![node-current](https://img.shields.io/node/v/@resultify/rh-cli)

## Install and use

```sh
npm -g install @resultify/rh-cli
```

## Commands
- `rh -h` get general help
- `rh` get info based on current directory

***

## Authentication for some commands

### One entry point to access keys

- Add access keys to `~/.rh/.env.root` file
```bash
hub_portalname=personal-access-key-for-hubspot-portal
hub_portalname2=personal-access-key-for-hubspot-portal
GITHUB_TOKEN=GitHub Classic Personal access token with full repo scope is required
```
***
