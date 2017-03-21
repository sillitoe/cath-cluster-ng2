import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { CathStructureComponent }  from './cath-structure.component';
import { CathStructureDetailsComponent }  from './cath-structure-details.component';
import { CathStructureSequenceComponent }  from './cath-structure-sequence.component';
import { CathMsaComponent }  from './cath-msa.component';
import { CathMdaBadgeComponent }  from './cath-mda-badge.component';
import { MemberListComponent }  from './members/member-list.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StructureModule } from './structure/structure.module';

@NgModule({
  imports:      [ 
    BrowserModule, 
    NgbModule.forRoot(), 
    HttpModule
  ],
  declarations: [
    AppComponent,
    CathStructureComponent,
    CathStructureDetailsComponent,
    CathStructureSequenceComponent,
    CathMsaComponent,
    CathMdaBadgeComponent,
    MemberListComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
