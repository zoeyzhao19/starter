import { createApp } from 'vue';
import '@unocss/reset/tailwind.css';
import './styles';
import 'uno.css';
import { createPinia } from 'pinia';
import App from './App.vue';
import { vLoading } from './directives';
import { router } from './router';

const pinia = createPinia();
const app = createApp(App);

app.directive('loading', vLoading);
app.use(pinia).use(router).mount('#app');
