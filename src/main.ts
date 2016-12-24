import './theme/variables.scss';
import './theme/app.scss';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

function bootstrap() {
  platformBrowserDynamic().bootstrapModule(AppModule);
}

console.info(`build info: target=${build.target} mode=${build.mode}`);
if (build.mode === 'prod') {
  enableProdMode();
}

if (build.target === 'cordova') {
  document.addEventListener('deviceready', () => bootstrap());
} else {
  bootstrap();
}
