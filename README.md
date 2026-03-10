# Symfony UX Web Haptics

Haptic feedback for the mobile web in Symfony, powered by [web-haptics](https://haptics.lochie.me/) and Stimulus.

## Installation

```bash
composer require zairigimad/ux-haptics
```

If you're using AssetMapper, also run:

```bash
php bin/console importmap:require web-haptics
```

## Usage

### With `stimulus_controller()` (recommended)

```twig
{# Preset #}
<button {{ stimulus_controller('zairigimad/ux-haptics/haptics', { preset: 'success' }) }}>
    Tap me
</button>

{# Custom pattern #}
<button {{ stimulus_controller('zairigimad/ux-haptics/haptics', {
    pattern: [
        { duration: 30 },
        { delay: 60, duration: 40, intensity: 1 },
    ],
}) }}>
    Custom haptic
</button>
```

### With bundled Twig helpers

```twig
<button {{ haptics_preset('success') }}>Tap me</button>
<button {{ haptics_preset('error', { intensity: 1.0 }) }}>Delete</button>

<button {{ haptics_pattern([{ 'duration': 100 }]) }}>Ping</button>
```

### Plain HTML

```html
<button
    data-controller="zairigimad--ux-haptics--haptics"
    data-zairigimad--ux-haptics--haptics-preset-value="success"
>
    Tap me
</button>
```

## Available Options

| Option       | Type    | Default   | Description                                      |
|--------------|---------|-----------|--------------------------------------------------|
| `preset`     | String  | `''`      | Predefined preset name                           |
| `pattern`    | Array   | `[]`      | Custom `{duration, delay?, intensity?}` steps    |
| `intensity`  | Number  | `0.5`     | Global intensity (0.0–1.0)                       |
| `event`      | String  | `'click'` | DOM event that triggers the haptic               |
| `auto`       | Boolean | `false`   | Fire on page load instead of event               |
| `debug`      | Boolean | `false`   | Audio feedback for desktop testing               |
| `show_switch`| Boolean | `false`   | Show web-haptics toggle UI                       |

## Built-in Presets

`success` · `nudge` · `error` · `buzz` · `warning` · `light` · `medium` · `heavy` · `soft` · `rigid` · `selection`

## Requirements

- PHP 8.2+
- Symfony 7.x or 8.x
- `symfony/stimulus-bundle` ^2.9

## License

MIT
