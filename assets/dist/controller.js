import { Controller } from '@hotwired/stimulus';
import { WebHaptics } from 'web-haptics';

export default class HapticsController extends Controller {
    static values = {
        preset:     { type: String,  default: '' },
        pattern:    { type: Array,   default: [] },
        intensity:  { type: Number,  default: 0.5 },
        event:      { type: String,  default: 'click' },
        auto:       { type: Boolean, default: false },
        debug:      { type: Boolean, default: false },
        showSwitch: { type: Boolean, default: false },
    };

    haptics = null;
    boundHandler = null;

    connect() {
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

    disconnect() {
        if (this.boundHandler) {
            this.element.removeEventListener(this.eventValue, this.boundHandler);
            this.boundHandler = null;
        }
        if (this.haptics) {
            this.haptics.destroy();
            this.haptics = null;
        }
    }

    triggerHaptic() {
        if (!this.haptics) return;

        const options = { intensity: this.intensityValue };

        if (this.presetValue) {
            this.haptics.trigger(this.presetValue, options);
        } else if (Array.isArray(this.patternValue) && this.patternValue.length > 0) {
            this.haptics.trigger(this.patternValue, options);
        } else {
            this.haptics.trigger(undefined, options);
        }
    }

    cancelHaptic() {
        if (this.haptics) {
            this.haptics.cancel();
        }
    }
}
