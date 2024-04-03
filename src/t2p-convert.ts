import { createClient } from '@pnpm/client'
import { createCafsStore } from '@pnpm/create-cafs-store'
import { resolveFromLocal } from '@pnpm/local-resolver'
import { createPackageRequester } from '@pnpm/package-requester'
import { finishWorkers } from '@pnpm/worker'
import { type FetchPackageToStoreFunction } from '@pnpm/store-controller-types'
import fs from 'fs'
import path from 'path'
import commander from 'commander'

async function recursive (
  fetchPackageToStore: FetchPackageToStoreFunction,
  cwdDir: string,
  currentDir: string,
  projectDir: string
): Promise<void> {
  const paths = fs.readdirSync(currentDir)

  for (const aPath of paths) {
    const absPath = path.resolve(currentDir, aPath)
    const relativePath = path.relative(cwdDir, absPath)
    const fileRelativePath = 'file:' + relativePath

    if (fs.statSync(absPath).isDirectory()) {
      await recursive(fetchPackageToStore, cwdDir, absPath, projectDir)

      continue
    }

    if (!absPath.endsWith('.tgz')) {
      continue
    }

    const tarballInfo = await resolveFromLocal(
      { pref: fileRelativePath },
      { projectDir }
    )

    if (tarballInfo == null) {
      continue
    }

    const { id, resolution } = tarballInfo

    fetchPackageToStore({
      force: true,
      lockfileDir: projectDir,
      pkg: {
        id,
        resolution
      }
    })

    console.log(`${id} resolved`)
  }
}

async function task (storeDir: string, packageDir: string): Promise<void> {
  const absCwdDir = process.cwd()
  const absProjectDir = absCwdDir
  const absStoreDir = path.isAbsolute(storeDir)
    ? storeDir
    : path.resolve(absCwdDir, storeDir)
  const absPackageDir = path.isAbsolute(packageDir)
    ? packageDir
    : path.resolve(absCwdDir, packageDir)

  const { resolve, fetchers } = createClient({
    authConfig: { registry: 'https://registry.npmjs.org' },
    cacheDir: '.store',
    rawConfig: {}
  })

  const cafs = createCafsStore(absStoreDir)

  const requester = createPackageRequester({
    resolve,
    fetchers,
    cafs,
    storeDir: absStoreDir,
    verifyStoreIntegrity: false
  })

  const { fetchPackageToStore } = requester

  await recursive(fetchPackageToStore, absCwdDir, absPackageDir, absProjectDir)

  await finishWorkers()
}

async function main (): Promise<void> {
  commander.program
    .option(
      '-s, --store-dir <string>',
      'pnpm store directory location'
    )
    .option(
      '-p, --package-dir <string>',
      'package directory location')

  await commander.program.parseAsync()

  const storeDir = commander.program.getOptionValue('store-dir') as
    | string
    | undefined ?? '.pnpm-store'
  const packageDir = commander.program.getOptionValue('package-dir') as
    | string
    | undefined ?? 'packages'

  console.log(storeDir)
  console.log(packageDir)

  await task(storeDir, packageDir)
}

void main()
