import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { CathStructureComponent }  from './cath-structure.component';
import { CathRepComponent }  from './cath-rep.component';
import { CathRepFeaturesComponent }  from './cath-rep-features.component';
import { CathMsaComponent }  from './cath-msa.component';

@NgModule({
  imports:      [ 
    BrowserModule,
  ],
  declarations: [ 
    AppComponent,
    CathStructureComponent,
    CathRepComponent,
    CathRepFeaturesComponent,
    CathMsaComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
