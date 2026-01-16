import vue3TreeOrg from 'vue3-tree-org';

import SvgIcon from '#/assets/svg/index.vue';
import { isArrayEmpty, isObjEmpty } from '#/utils/toolUtils';

import 'virtual:svg-icons-register';

import '#/assets/css/global.css';
import 'vue3-tree-org/lib/vue3-tree-org.css';

function extendDirective(app: any) {
  app.use(vue3TreeOrg);
  app.component('SvgIcon', SvgIcon);
  app.config.globalProperties.isObjEmpty = isObjEmpty;
  app.config.globalProperties.isObjEmpty = isArrayEmpty;
  app.directive('focus', {
    mounted(el: any) {
      el.focus();
    },
  });
  app.directive('enter-number', {});
}

export { extendDirective };
