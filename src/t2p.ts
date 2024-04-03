import commander from 'commander'

async function main (): Promise<void> {
  const program = new commander.Command()

  program
    .name('t2p')
    .description(
      'A cli tool that helps convert tarballs within a directory into the pnpm-store directory structure.'
    )
    .command(
      'convert',
      'Convert tarballs within a directory into the pnpm-store directory structure.'
    )
    .alias('c')

  await program.parseAsync(process.argv)
}

void main()
