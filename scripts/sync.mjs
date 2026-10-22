// Resets this repo to the latest released state of the course repo.
//
// Run before every lecture: `npm run sync`
//
// 1. Your current state (including uncommitted changes) is saved in a backup branch
//    and pushed to your fork, so nothing gets lost.
// 2. main is overwritten with upstream/main – no merge, no conflicts.
// 3. Your fork on GitHub is overwritten too (push --force).
// 4. Packages are installed, because the new state may need different ones.
import { execSync } from 'node:child_process'

const UPSTREAM = 'https://github.com/hfg-protolab/computationalThinking4.git'

function git(args, options = {}) {
  return execSync(`git ${args}`, { encoding: 'utf8', stdio: options.quiet ? 'pipe' : 'inherit' })?.trim()
}

function tryGit(args) {
  try {
    return git(args, { quiet: true })
  } catch {
    return null
  }
}

function step(message) {
  console.log(`\n→ ${message}`)
}

function fail(message) {
  console.error(`\n✗ ${message}`)
  process.exit(1)
}

step('Original-Repo als upstream eintragen')
if (tryGit('remote get-url upstream') === null) git(`remote add upstream ${UPSTREAM}`)

step('Neuen Stand holen')
git('fetch upstream')

const hasChanges = git('status --porcelain', { quiet: true }) !== ''
const isUpToDate = !hasChanges && git('rev-parse HEAD', { quiet: true }) === git('rev-parse upstream/main', { quiet: true })

if (isUpToDate) {
  console.log('  Schon auf dem neuesten Stand – kein Backup nötig.')
} else {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-')
  const backup = `backup-${stamp}`

  step(`Eigenen Stand sichern in ${backup}`)
  if (hasChanges) {
    git('add -A')
    if (tryGit('commit -m "Backup vor Sync"') === null) {
      fail('Commit fehlgeschlagen – nichts wurde überschrieben. Ist Git eingerichtet (git config user.name / user.email)?')
    }
  }
  git(`branch ${backup}`)
  if (tryGit(`push origin ${backup}`) === null) {
    console.log('  Backup konnte nicht zu GitHub gepusht werden – er liegt aber lokal.')
  }

  step('main mit dem Stand des Original-Repos überschreiben')
  git('switch --no-track -C main upstream/main')

  step('Fork auf GitHub überschreiben')
  if (tryGit('push --force -u origin main') === null) {
    fail('Push fehlgeschlagen. Bei GitHub angemeldet? Danach `git push --force origin main` wiederholen.')
  }
}

step('Pakete installieren')
execSync('npm i', { stdio: 'inherit' })

console.log('\n✓ Fertig. Starten mit `npm run dev`.')
