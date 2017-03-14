import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { CathStructureComponent }  from './cath-structure.component';
import { CathRepComponent }  from './cath-rep.component';
import { CathRepFeaturesComponent }  from './cath-rep-features.component';
import { CathMsaComponent }  from './cath-msa.component';
import { CathClusterMembersComponent }  from './cath-cluster-members.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StructureModule } from './structure/structure.module';

@NgModule({
  imports:      [ 
    BrowserModule, NgbModule.forRoot(), StructureModule
  ],
  declarations: [
    AppComponent,
    CathStructureComponent,
    CathRepComponent,
    CathRepFeaturesComponent,
    CathMsaComponent,
    CathClusterMembersComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
