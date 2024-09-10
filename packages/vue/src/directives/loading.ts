import { createVNode, render } from 'vue';
import { Loading } from '@src/components';

export function vLoading(el: any, binding: any) {
  if (binding.value !== false) {
    if (binding.oldValue !== true) {
      const vnode = createVNode(Loading);
      el.classList.add('loading-parent--relative');
      const mask = document.createElement('div');
      mask.classList.add('loading-mask');
      render(vnode, mask);

      el.loading = mask;
      el.appendChild(mask);
    }
  } else {
    if (el.loading && el.loading.parentNode) {
      el.classList.remove('loading-parent--relative');
      el.loading.parentNode.removeChild(el.loading);
      render(null, el.loading);
    }
  }
}
