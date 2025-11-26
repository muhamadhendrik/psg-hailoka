// directives/clickOutside.ts
import type { Directive } from "vue";

export const clickOutside: Directive = {
  beforeMount(el, binding) {
    el.__ClickOutsideHandler__ = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.__ClickOutsideHandler__);
  },
  unmounted(el) {
    document.removeEventListener("click", el.__ClickOutsideHandler__);
    el.__ClickOutsideHandler__ = null;
  },
};
