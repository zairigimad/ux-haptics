<?php

declare(strict_types=1);

namespace Zairigimad\UxHaptics\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Twig extension providing haptic helper functions.
 *
 * Requires symfony/stimulus-bundle for stimulus_controller() to be available.
 */
class HapticsExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('haptics_controller', [$this, 'hapticsController'], ['is_safe' => ['html']]),
            new TwigFunction('haptics_preset', [$this, 'hapticsPreset'], ['is_safe' => ['html']]),
            new TwigFunction('haptics_pattern', [$this, 'hapticsPattern'], ['is_safe' => ['html']]),
        ];
    }

    /**
     * Render full stimulus_controller attributes for a haptic element.
     *
     * Usage in Twig:
     *   <button {{ haptics_controller({ preset: 'success', intensity: 0.8 }) }}>Tap</button>
     *   <button {{ haptics_controller({ pattern: [{'duration': 30}, {'delay': 60, 'duration': 40, 'intensity': 1}] }) }}>Tap</button>
     *
     * @param array{
     *     preset?: string,
     *     pattern?: array<array{duration: int, delay?: int, intensity?: float}>,
     *     intensity?: float,
     *     event?: string,
     *     auto?: bool,
     *     debug?: bool,
     *     show_switch?: bool,
     * } $options
     */
    public function hapticsController(array $options = []): string
    {
        $values = $this->buildValues($options);
        return $this->renderDataAttributes('ux--haptics', $values);
    }

    /**
     * Convenience: render controller attributes for a named preset.
     *
     * Usage: <button {{ haptics_preset('success') }}>Tap</button>
     *
     * Available presets: success, nudge, error, buzz, warning,
     *                    light, medium, heavy, soft, rigid, selection
     */
    public function hapticsPreset(string $preset, array $options = []): string
    {
        return $this->hapticsController(array_merge($options, ['preset' => $preset]));
    }

    /**
     * Convenience: render controller attributes for a custom pattern.
     *
     * Usage:
     *   <button {{ haptics_pattern([{'duration': 30}, {'delay': 60, 'duration': 40, 'intensity': 1}]) }}>Tap</button>
     *
     * @param array<array{duration: int, delay?: int, intensity?: float}> $pattern
     */
    public function hapticsPattern(array $pattern, array $options = []): string
    {
        return $this->hapticsController(array_merge($options, ['pattern' => $pattern]));
    }

    private function buildValues(array $options): array
    {
        $values = [];

        if (!empty($options['preset'])) {
            $values['preset'] = $options['preset'];
        }

        if (!empty($options['pattern'])) {
            $values['pattern'] = $options['pattern'];
        }

        if (isset($options['intensity'])) {
            $values['intensity'] = (float) $options['intensity'];
        }

        if (!empty($options['event'])) {
            $values['event'] = $options['event'];
        }

        if (!empty($options['auto'])) {
            $values['auto'] = (bool) $options['auto'];
        }

        if (!empty($options['debug'])) {
            $values['debug'] = (bool) $options['debug'];
        }

        if (!empty($options['show_switch'])) {
            $values['showSwitch'] = (bool) $options['show_switch'];
        }

        return $values;
    }

    /**
     * Render data-controller and data-*-value attributes for a Stimulus controller.
     */
    private function renderDataAttributes(string $controller, array $values): string
    {
        $attrs = sprintf('data-controller="%s"', htmlspecialchars($controller, \ENT_QUOTES));

        foreach ($values as $key => $value) {
            // Convert camelCase to kebab-case for Stimulus attribute naming
            $kebab = strtolower(preg_replace('/[A-Z]/', '-$0', lcfirst($key)));
            $attrName = sprintf('data-%s-%s-value', $controller, $kebab);

            if (is_array($value)) {
                $attrValue = htmlspecialchars(json_encode($value, \JSON_THROW_ON_ERROR), \ENT_QUOTES);
            } elseif (is_bool($value)) {
                $attrValue = $value ? 'true' : 'false';
            } else {
                $attrValue = htmlspecialchars((string) $value, \ENT_QUOTES);
            }

            $attrs .= sprintf(' %s="%s"', $attrName, $attrValue);
        }

        return $attrs;
    }
}
