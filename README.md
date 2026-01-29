# GreenWind Wind Plant Planner System Prototype

This is a prototype web application for a Wind Park management company. It allows operators to view and interact with a simple simulation for wind turbines, as well as import wind park projects using an import script.

Made as part of the EuroSkills 2027 competition's Hungarian national selector, round 1.

## Technologies Used:

- Frontend: [Next.js 15](https://nextjs.org/) with TypeScript
- Data source: [json-server](https://www.npmjs.com/package/json-server) (required by the competition's rules)
- Styling: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- Package Manager: [PNPM](https://pnpm.io/) via [Corepack](https://nodejs.org/api/corepack.html)

## Features:

- Ability to select and interact with simulation projects
- Ability to import project folders via a python import script

## Running the project

### With docker (recommended)

1. Clone this repository.
2. Simply run `docker compose up` from the project's root directory.
3. Open http://localhost:3001 in your web browser.

For production deployment, run:

```bash
docker compose -f compose-prod.yml up
```

To stop the containers, press `Ctrl+C` in the terminal where the `docker compose` command was ran, or run:

```bash
docker compose down
# or for production
docker compose -f compose-prod.yml down
```

### Without docker

This project uses PNPM as its package manager. Make sure you have Node.js 20.x or later installed, then set up PNPM through Corepack:

```bash
corepack enable
corepack prepare pnpm@9.14.4 --activate
```

1. Clone this repository:

```bash
git clone https://github.com/Horvath-David/es2027-s09-r1-170.git && cd es2027-s09-r1-170
```

2. Start json-server:

```bash
pnpx json-server@0.17.4 data/database.json
```

Now open a new terminal session and let json-server run in the background

3. Install the project dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm run dev
```

5. Open http://localhost:3001 in your web browser.

For production, build and start:

```bash
pnpm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
HOSTNAME=0.0.0.0 PORT=3001 node .next/standalone/server.js
```

### Project Import Format

The system supports importing project data via PNG and TXT files. The expected format is:

```txt
OOOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOXXOOO
OOOOOOOOOOOOOOXXXXOO
OOOOOOOOOOOOOXXOOXOO
OOOOOOOOOOOOXXOOOXXO
OOOOOOOOOOOOXXOOOXXO
OOOOOOOOOOOOOXXXXXOO
OOOOXXOOOOOOOOXXXOOO
OOOXXXXOOOOOOOOOOOOO
OOXXXXXOOOOOOOOOOOOO
OXXXXXOOOOOOOOOOOOOO
OOXXOOOOOOOOOOOOOOOO
OOOXOOOOOOOOOOOOOOOO
OOOOOOOOOOOOXXOOOOOO
OOOOOOOOOOXXXXXXOOOO
OOOOOOOOOXXXXXXXOOOO
OOOOOOOOOOXXXXXXXOOO
OOOOOOOOOOOXXOOXOOOO
OOOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
```

Cell types:

- `O`: Grass cell
- `X`: Lake cell
- `#`: Mountain cell

### Import Script

The import script can be run with various options to customize its behavior:

```bash
python3 import-script/import.py <path_to_folder> [options]
```

| Option                    | Short | Description                                                 | Default                          |
| ------------------------- | ----- | ----------------------------------------------------------- | -------------------------------- |
| `--endpoint=<endpoint>`   | -     | Set the API endpoint to import to                           | `http://localhost:3000/projects` |
| `--log-level=<log_level>` | -     | Set the log level (DEBUG, INFO, WARNING, ERROR, SILENT)     | `WARNING`                        |
| `--dry-run`               | `-r`  | Process the data without actually importing it | `false`                          |
| `--debug`                 | `-d`  | Print debug messages (overrides log level)                  | -                                |
| `--silent`                | `-s`  | Print no messages (overrides log level)                     | -                                |
| `--help`                  | `-h`  | Print a help message                                        | -                                |

#### Example usage:

Basic import:

```bash
python3 import-script/import.py SomeFolder
```

Import with debug logging:

```bash
python3 import-script/import.py SomeFolder --debug
```

Dry run:

```bash
python3 import-script/import.py SomeFolder --dry-run
```

Import to custom endpoint:

```bash
python3 import-script/import.py SomeFolder --endpoint=http://api.example.com/projects
```
