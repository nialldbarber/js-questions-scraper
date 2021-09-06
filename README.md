# JS Questions

I made a quick Deno scraper to grab questions from [this repo](https://github.com/sudheerj/javascript-interview-questions)

To get it up and running:

Firstly, you'll need Deno [installed](https://deno.land/manual/getting_started/installation)

Using Shell (macOS and Linux):

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Using Homebrew (macOS):

```bash
brew install deno
```

Using PowerShell (Windows):

```bash
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

Then just run the script:

```bash
deno run --unstable --allow-all scraper.ts
```
