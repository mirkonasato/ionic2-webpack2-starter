import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { AppComponent } from './app.component';
import { HomePage } from './pages/home.page';

@NgModule({
  imports: [
    IonicModule.forRoot(AppComponent)
  ],
  declarations: [
    AppComponent,
    HomePage
  ],
  entryComponents: [
    AppComponent,
    HomePage    
  ],
  bootstrap: [IonicApp]
})
export class AppModule { }
