import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html'
})
export class HomePage {

  appName = 'Ionic 2 App';

  constructor(private navController: NavController) { }

}
