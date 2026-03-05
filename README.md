# Symfony UX Web Haptics

Haptic feedback for the mobile web in Symfony, powered by [web-haptics](https://haptics.lochie.me/) and Stimulus.

Works with **AssetMapper** (recommended) or Webpack Encore.

---

## Installation

```bash
composer require zairigimad/ux-haptics
```

Then import the controller assets via AssetMapper:

```bash
php bin/console importmap:require web-haptics
```

---

## Usage

### 1. Using a predefined preset

Plain HTML:

```html
<button
    data-controller="ux--haptics"
    data-ux--haptics-preset-value="success"
>
    Tap me
</button>
```

With Twig `stimulus_controller()`:

```twig
<button {{ stimulus_controller('ux/haptics', {
    preset: 'success',
}) }}>
    Tap me
</button>
```

With the bundled Twig helper:

```twig
<button {{ haptics_preset('success') }}>Tap me</button>
```

---

### 2. Using a custom haptic pattern

Each step in the pattern is an object with:

| Key         | Type    | Required | Description                         |
|-------------|---------|----------|-------------------------------------|
| `duration`  | integer | Yes      | Vibration duration in milliseconds  |
| `delay`     | integer | No       | Pause before this step (ms)         |
| `intensity` | float   | No       | Vibration strength, 0.0–1.0         |

Plain HTML – inline JSON:

```html
<button
    data-controller="ux--haptics"
    data-ux--haptics-pattern-value='[
        {"duration": 30},
        {"delay": 60, "duration": 40, "intensity": 1}
    ]'
>
    Custom haptic
</button>
```

With the bundled Twig helper:

```twig
<button {{ haptics_pattern([
    {'duration': 30},
    {'delay': 60, 'duration': 40, 'intensity': 1},
]) }}>
    Custom haptic
</button>
```

With `stimulus_controller()`:

```twig
<button {{ stimulus_controller('ux/haptics', {
    pattern: [
        {duration: 30},
        {delay: 60, duration: 40, intensity: 1},
    ],
    intensity: 0.9,
}) }}>
    Custom haptic
</button>
```

---

### 3. Full Twig helper signature

```twig
{# haptics_controller(options) — most flexible #}
<div {{ haptics_controller({
    preset: 'success',        {# or pattern: [...] #}
    intensity: 0.8,
    event: 'click',           {# default: 'click' #}
    auto: false,              {# trigger on page load instead of event #}
    debug: false,             {# audio feedback for desktop testing #}
    show_switch: false,       {# show web-haptics toggle UI #}
}) }}></div>

{# haptics_preset(preset, options?) #}
<button {{ haptics_preset('error') }}>Delete</button>
<button {{ haptics_preset('buzz', {intensity: 1.0}) }}>Buzz!</button>

{# haptics_pattern(pattern, options?) #}
<button {{ haptics_pattern([{'duration': 100}]) }}>Ping</button>
```

---

## HTML Attribute Reference

All attributes use the Stimulus naming convention:
`data-{controller-name}-{value-name}-value`

The controller name (dashes) is: `ux--haptics`

| Attribute (suffix)    | Type    | Default   | Description                                                 |
|-----------------------|---------|-----------|-------------------------------------------------------------|
| `preset-value`        | String  | `''`      | Predefined preset name                                      |
| `pattern-value`       | Array   | `[]`      | JSON array of `{duration, delay?, intensity?}` steps        |
| `intensity-value`     | Number  | `0.5`     | Global intensity override, 0.0–1.0                          |
| `event-value`         | String  | `'click'` | DOM event that triggers the haptic                          |
| `auto-value`          | Boolean | `false`   | Fire haptic on connect (page load) instead of waiting       |
| `debug-value`         | Boolean | `false`   | Enable audio feedback for desktop testing                   |
| `show-switch-value`   | Boolean | `false`   | Show web-haptics built-in toggle UI                         |

---

## Built-in Presets

| Preset      | Pattern description                              |
|-------------|--------------------------------------------------|
| `success`   | Two taps – short pause between them             |
| `nudge`     | Strong tap followed by a soft tap               |
| `error`     | Three sharp taps                                 |
| `buzz`      | Long 1-second vibration                          |
| `warning`   | Medium double tap                                |
| `light`     | Short soft tick                                  |
| `medium`    | Medium single tap                                |
| `heavy`     | Strong single tap                                |
| `soft`      | Very gentle tap                                  |
| `rigid`     | Sharp crisp tap                                  |
| `selection` | Subtle selection feedback                        |

---

## JavaScript API

You can call the controller's actions from JavaScript using Stimulus outlets
or by dispatching custom events:

```javascript
// Get the controller instance
const el = document.querySelector('[data-controller*="haptics"]');
const controller = application.getControllerForElementAndIdentifier(
    el,
    'ux--haptics'
);

// Trigger programmatically
controller.triggerHaptic();

// Cancel a running haptic
controller.cancelHaptic();
```

---

## Building Assets (for development of this bundle)

```bash
cd assets
npm install
npm run build    # compiles src/controller.ts → dist/controller.js
npm run watch    # watch mode
```

---

## Requirements

- PHP 8.2+
- Symfony 7.x or Symfony 8.x
- `symfony/asset-mapper` ^7.0 or ^8.0 (recommended)
- `symfony/stimulus-bundle` ^2.9 (for `stimulus_controller()` Twig function)

---

## License

MIT
