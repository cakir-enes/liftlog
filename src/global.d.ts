import { onCleanup } from "solid-js";

export function clickOutside(el, accessor) {
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      clickOutside: () => void;
    }
  }
}
