# Runbook — Local Supabase

> **Docs version:** `0.1.0` · **Last updated:** 2026-08-05

# Prerequisites

- Docker
- Supabase CLI

## Start

```bash
docker info                # must succeed first
npm run db:start
```

Prints API URL, anon key, service role key, Studio URL and the Postgres connection string. Copy
the API URL and **anon** key into `.env`. The service role key stays out of `.env` — it belongs
in `.dev.vars` only.

## Apply migrations to a clean database

```bash
npm run db:reset
```

Drops everything, replays every migration in filename order, then runs `supabase/seed.sql`.
**Destroys local data.** Run it before every push — a migration that only applies on top of your
current state will break staging.

## Apply a `config.toml` change

```bash
npm run db:stop
npm run db:start
```

**`db:reset` will not do this.** The CLI reads `config.toml` when it _creates_ the containers and
bakes the result into each container's environment; Docker never re-reads it. `db:reset` rebuilds
the database only. Edit `config.toml`, run `db:reset`, and the file looks correct while the
running services carry on with the old settings — which is indistinguishable from the change not
working. This applies to auth settings, captcha, rate limits, redirect URLs and email templates.

Verify a setting actually took by inspecting the container, naming it in full:

```bash
docker inspect supabase_auth_btw-website-production \
  --format '{{range .Config.Env}}{{println .}}{{end}}' | grep -i captcha
```

Avoid `docker ps -qf name=supabase_auth` — that filter is a substring match across every running
project, so with two stacks up you inspect whichever Docker lists first.

## Check what is applied

```bash
npm run db:status
```

## Create a migration

```bash
npm run db:new -- add_pass_tokens
# edit supabase/migrations/<timestamp>_add_pass_tokens.sql
npm run db:reset
npm run db:types && npm run prisma:pull
```

## Capture a change made in Studio

```bash
npm run db:diff -- -f describe_the_change
```

Review the generated SQL carefully — the diff tool does not produce RLS policies or grants. Add
them by hand.

## Regenerate types

```bash
npm run db:types      # → src/auth/database.types.ts
npm run prisma:pull   # → prisma/schema.prisma
```

Commit both. CI fails if either has drifted.

## Read local email

Magic links go to Inbucket at http://127.0.0.1:54324, not to a real inbox.

## Stop

```bash
npm run db:stop            # keeps data
npm run db:stop -- --no-backup   # discards data
```

## Link to a hosted project (staging only)

```bash
npx supabase link --project-ref <staging-ref>
npm run db:status          # compare local files against the hosted project
npx supabase db push       # apply — MANUAL, REVIEWED, STAGING ONLY
```

Never link to production from a laptop. Production migrations run through the manual-dispatch
CI workflow with a named approver.

## Common failures

| Symptom                                                 | Fix                                                                          |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `db:start` hangs                                        | Docker Desktop is not running                                                |
| `port 54322 already allocated`                          | `npx supabase stop --project-id <other>`                                     |
| `permission denied for table X`                         | RLS is working. Add a policy or route via a Worker.                          |
| `new row violates row-level security policy`            | Insert policy is missing `with check`                                        |
| Migration applies on your machine but not on `db:reset` | It depends on state a previous manual change left behind. Fix the migration. |

### Ennvironment Variables :

# Option 1: Displays all active local URLs and keys

npx supabase status

# Option 2: Formats output directly as environment variables (USE THIS )

npx supabase status -o env

