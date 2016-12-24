// the angular2-template-loader translates templateUrl into require() calls
declare function require(id: string): any;

// set using the Webpack DefinePlugin
declare var build: {
  mode: string;
  target: string;
};
