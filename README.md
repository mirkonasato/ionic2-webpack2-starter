# Ionic 2 Webpack Starter

Ionic 2 starter project using Webpack 2 and [@ngtools/webpack](https://github.com/angular/angular-cli/tree/master/packages/webpack) for AoT template compilation.

Includes Sass support for [theming your app](https://ionicframework.com/docs/v2/theming/theming-your-app/). Styles can be encapsulated in the component, without the need for a `selector` metadata property like in projects generated with the Ionic CLI.

```typescript
@Component({
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage { }
```

## Usage

### Create a Cordova project

If you want to build a mobile app with Cordova clone this project
```
git clone https://github.com/mirkonasato/ionic2-webpack2-starter
```
then create a new Cordova project for your app using this project as the template:
```
cordova create myapp --template ./ionic2-webpack2-starter
```
Install all the dependencies (this only needs to be done once):
```
cd myapp
npm install
```

### Create a web-only project

If you want to create a mobile website and don't need Cordova you can simply cloned this project and use it as it is, or rename it to whatever you like.

### NPM Tasks

To start a local development web server with livereload type:
```
npm run serve
```
Your application will be accessible at [localhost:8080](http://localhost:8080/) by default. See the [webpack-dev-server docs](https://webpack.github.io/docs/webpack-dev-server.html) if you want to customise anything.

To package the app into the `www` folder do
```
npm run build
```
to build it with development settings, or
```
npm run build:prod
```
to enable production optimisations, like Angular Ahead-of-Time template compilation and code obfuscation/minification.

### Run as a mobile app

If using Cordova you can then run what's in the `www` folder as as mobile app using the Cordova CLI. E.g. for Android first add the platform
```
cordova platform add android
```
then run the app in an emulator
```
cordova run android --emulator
```
Please refer to the [Cordova CLI docs](https://cordova.apache.org/docs/en/latest/guide/cli/) for more.
