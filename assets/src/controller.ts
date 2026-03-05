import { Controller } from '@hotwired/stimulus';
import { WebHaptics } from 'web-haptics';

/**
 * A single vibration step in a custom haptic pattern.
 */
interface Vibration {
    /** Duration of the vibration in milliseconds */
    duration: number;
    /** Delay before this step starts, in milliseconds */
    delay?: number;
    /** Intensity of the vibration, from 0 to 1 */
    intensity?: number;
}

/**
 * Built-in preset names supported by web-haptics.
 *
 * Predefined patterns:
 *  - success   → [{ duration: 50 }, { delay: 50, duration: 50 }]
 *  - nudge     → [{ duration: 80, intensity: 0.8 }, { delay: 80, duration: 50, intensity: 0.3 }]
 *  - error     → three sharp taps: [{ duration: 50, intensity: 0.75 }, ...] ×3
 *  - buzz      → [{ duration: 1000, intensity: 1 }]
 *  - warning   → medium double tap
 *  - light     → short soft tick
 *  - medium    → medium single tap
 *  - heavy     → strong single tap
 *  - soft      → very gentle tap
 *  - rigid     → sharp crisp tap
 *  - selection → subtle selection feedback
 */
type HapticPresetName =
    | 'success'
    | 'nudge'
    | 'error'
    | 'buzz'
    | 'warning'
    | 'light'
    | 'medium'
    | 'heavy'
    | 'soft'
    | 'rigid'
    | 'selection';

/**
 * Symfony UX Web Haptics Stimulus Controller
 *
 * Provides haptic feedback via HTML attributes. Attach to any element.
 *
 * ## Using a predefined preset
 * ```html
 * <button
 *   data-controller="ux--haptics"
 *   data-ux--haptics-preset-value="success"
 * >Tap me</button>
 * ```
 *
 * ## Using a custom pattern
 * ```html
 * <button
 *   data-controller="ux--haptics"
 *   data-ux--haptics-pattern-value='[{"duration":30},{"delay":60,"duration":40,"intensity":1}]'
 * >Tap me</button>
 * ```
 *
 * ## With Twig stimulus helpers
 * ```twig
 * <button {{ stimulus_controller('ux/haptics', {
 *     preset: 'success',
 *     intensity: 0.8,
 * }) }}>Tap me</button>
 * ```
 *
 * ## All available values (HTML attributes)
 * | Attribute                         | Type    | Default   | Description                                      |
 * |-----------------------------------|---------|-----------|--------------------------------------------------|
 * | `*-preset-value`                  | String  | `''`      | Predefined preset name (success, nudge, etc.)    |
 * | `*-pattern-value`                 | Array   | `[]`      | Custom pattern: JSON array of Vibration objects  |
 * | `*-intensity-value`               | Number  | `0.5`     | Global intensity override (0–1)                  |
 * | `*-event-value`                   | String  | `'click'` | DOM event that triggers the haptic               |
 * | `*-auto-value`                    | Boolean | `false`   | Trigger immediately on connect (no event needed) |
 * | `*-debug-value`                   | Boolean | `false`   | Enable audio feedback for desktop testing        |
 * | `*-show-switch-value`             | Boolean | `false`   | Show the web-haptics toggle switch UI            |
 */
export default class HapticsController extends Controller {
    static values = {
        /** Predefined preset name, e.g. "success", "error", "buzz" */
        preset: { type: String, default: '' },

        /**
         * Custom haptic pattern as a JSON array of Vibration objects.
         * Each object supports: duration (ms), delay (ms), intensity (0–1).
         *
         * Example:
         *   [{"duration":30},{"delay":60,"duration":40,"intensity":1}]
         */
        pattern: { type: Array, default: [] },

        /** Global intensity override (0–1). Applies to both presets and custom patterns. */
        intensity: { type: Number, default: 0.5 },

        /** DOM event that triggers haptic feedback. Defaults to "click". */
        event: { type: String, default: 'click' },

        /** If true, trigger the haptic immediately on connect (useful for page-load feedback). */
        auto: { type: Boolean, default: false },

        /** Enable audio feedback for testing on desktop browsers. */
        debug: { type: Boolean, default: false },

        /** Show the web-haptics built-in toggle switch UI element. */
        showSwitch: { type: Boolean, default: false },
    };

    declare presetValue: string;
    declare patternValue: Vibration[];
    declare intensityValue: number;
    declare eventValue: string;
    declare autoValue: boolean;
    declare debugValue: boolean;
    declare showSwitchValue: boolean;

    private haptics: WebHaptics | null = null;
    private boundHandler: EventListener | null = null;

    connect(): void {
        this.haptics = new WebHaptics({
            debug: this.debugValue,
            showSwitch: this.showSwitchValue,
        });

        if (this.autoValue) {
            this.triggerHaptic();
            return;
        }

        this.boundHandler = () => this.triggerHaptic();
        this.element.addEventListener(this.eventValue, this.boundHandler);
    }

    disconnect(): void {
        if (this.boundHandler) {
            this.element.removeEventListener(this.eventValue, this.boundHandler);
            this.boundHandler = null;
        }
        this.haptics?.destroy();
        this.haptics = null;
    }

    /**
     * Programmatically trigger haptic feedback.
     * Called automatically on the configured event, or call directly from JS.
     */
    triggerHaptic(): void {
        if (!this.haptics) return;

        const options = { intensity: this.intensityValue };

        if (this.presetValue) {
            this.haptics.trigger(this.presetValue as HapticPresetName, options);
        } else if (Array.isArray(this.patternValue) && this.patternValue.length > 0) {
            this.haptics.trigger(this.patternValue, options);
        } else {
            // Fallback: trigger a single tap using the intensity
            this.haptics.trigger(undefined, options);
        }
    }

    /**
     * Cancel any currently playing haptic pattern.
     */
    cancelHaptic(): void {
        this.haptics?.cancel();
    }
}
