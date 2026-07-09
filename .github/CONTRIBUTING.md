# Contribution

## Getting started

1. Fork this repo

2. Log or pick an issue

3. ... (Make your code changes)

4. Profit! (Submit a Pull Request)

5. We all profit. (Your pr is integrated)

## Guidelines

### Linting

Use the ESLint configs under `apps/next`, `apps/legacy`, and `packages/shared` to lint your files. Include any ignores in your pull request documentation with a reason why.

### Commit messages

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`

Examples: `feat(synthesis): add table pagination`, `fix: hydrate timer panels`, `ci: bump cypress`

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `ci`, `chore`. Validated locally by husky (`commit-msg`) and in CI on pull requests.


### Running

1. Clone the repo. ```git clone https://github.com/WFCD/warframe-hub.git```

2. Install [pm2](http://pm2.keymetrics.io/docs/usage/quick-start/).

3. Add any applicable parameters to `pm2.json`, we just flex on the port (or whatever you called it).

4. Run `pm2 start pm2.json` to start the server.

5. View logs in `pm2 logs warframe-hub` if you wish to see logs for the process.

6. Check in your browser at http://localhost:8742 (vinext app) or whatever you changed the port to in `apps/next/dev.config.cjs`.

### Resources

Nothing here yet

## Contributors

MainlandHero
 * Primary dev, originally made the beginnings of this as another site, but came onto the team and is making cool things happen.
 
Tobiah (aliasfalse)
 * Other dude who's helping, checking reviews, tweaks, some formalities
