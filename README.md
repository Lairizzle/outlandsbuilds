# UO Outlands Hugo Theme

A lightweight Hugo theme for showcasing Ultima Online Outlands builds,
farming guides and news.

## Quick start

Install Hugo, enter the project directory and run:

    hugo server

Then open the local address Hugo prints.

## Structure

- `content/builds/` — build pages
- `content/news/` — news and guide pages
- `layouts/` — Hugo templates
- `assets/css/main.css` — theme styling
- `hugo.toml` — site configuration

## Creating a build

Create a Markdown file in:

    content/builds/

Example:

    ---
    title: "My Build"
    description: "Short description."
    date: 2026-09-07
    categories: ["PvE"]
    tags: ["Archery", "Farming"]
    difficulty: "Medium"
    gold: "High"
    playstyle: "Ranged PvE"
    skills: ["Archery", "Tactics"]
    featured: false
    ---

    Your build content goes here.

## Theme

The default palette is inspired by the Midnight Crystal aesthetic:
deep blue-black surfaces, cool blue accents, muted text, purple/cyan
secondary accents and restrained borders.

The theme uses CSS custom properties, so the palette can be changed
in one place.

## License

MIT
