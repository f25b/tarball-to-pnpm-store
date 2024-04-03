# @systex-f25b/tarball-to-pnpm-store

A tool that helps convert tarballs within a directory into the pnpm-store directory structure.

## Install

```sh
npm i -g @systex-f25b/tarball-to-pnpm-store
```

## Usage

```sh
t2p -h

# Usage: t2p [options] [command]

# A cli tool that helps convert tarballs within a directory into the pnpm-store directory structure.

# Options:
#   -h, --help      display help for command

# Commands:
#   convert|c       Convert tarballs within a directory into the pnpm-store directory structure.
#   help [command]  display help for command

t2p convert -h
# Usage: t2p-convert [options]

# Options:
#   -s, --store-dir <string>    pnpm store directory location
#   -p, --package-dir <string>  package directory location
#   -h, --help                  display help for command
```
