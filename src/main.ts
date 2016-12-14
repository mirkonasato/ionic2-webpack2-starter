import './theme/variables.scss';
import './theme/app.scss';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

function bootstrap() {
  platformBrowserDynamic().bootstrapModule(AppModule);
}

console.info('app.environment:', app.environment);
if (app.environment === 'production') {
  enableProdMode();
}

if (window['cordova']) {
  document.addEventListener('deviceready', () => bootstrap());
} else {
  bootstrap();
}
