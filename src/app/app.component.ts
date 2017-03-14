import { Input, ElementRef, Component } from '@angular/core';
import { CathStructureComponent } from './cath-structure.component';
import { CathRepComponent } from './cath-rep.component';
import { CathRepFeaturesComponent } from './cath-rep-features.component';
import { CathClusterMembersComponent } from './cath-cluster-members.component';
import { CathMsaComponent } from './cath-msa.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StructureModule } from './structure/structure.module';

@Component({
  selector: 'cath-cluster',
  template: `
    <div class="cath-cluster container-fluid bg-fade">
      <div class="row">
        <div class="col-md-12 panel-header">
          <div class="">{{name}} <small>{{accession}}</small></div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-9 panel-main">
          <cath-structure class=""></cath-structure>
          <cath-rep repid={{repid}}></cath-rep>
        </div>
        <div class="col-md-3">
          <cath-rep-features></cath-rep-features>
        </div>
      </div>
      <ngb-tabset type="tabs">
        <ngb-tab>
          <template ngbTabTitle>Members</template>
          <template ngbTabContent>
            <cath-cluster-members></cath-cluster-members>
          </template>
        </ngb-tab>
        <ngb-tab>
          <template ngbTabTitle>Alignment</template>
          <template ngbTabContent>
            <cath-msa></cath-msa>
          </template>
        </ngb-tab>
      </ngb-tabset>
      <footer class="row">
      </footer>
    </div>
  `,
  styles: [`
    :host .bg-fade {
      background-color: #eee;
    }
    .panel-header {
      background-color: #444;
      color: #fff;
      padding: 10px;
      height: 50px;
    }
    .panel-main {
      min-height: 400px;
      padding: 20px;
      border: 1px solid #eee;
    }
    
    .panel-side {
      z-index: 1000;
      background-color: #ddd;
      border-left: 1px solid #ccc;
    }
    :host /deep/ .tab-pane.active {
      background-color: white;
      padding: 20px;
    }
    footer {
      padding-bottom: 20px;
    }
  `]
})

export class AppComponent { 
  @Input()
  accession: string = '1.1.1.1/FF/1';

  cathSfamId: string;
  cathFunfamNum: number;

  @Input()
  name: string = '<Funfam name>';
  
  @Input()
  repid: string = '1abcA01';
  
  constructor(public elementRef: ElementRef) {
    var native = this.elementRef.nativeElement;
    var acc = native.getAttribute('accession') || this.accession;
    var name = native.getAttribute('name') || this.name;
    this.accession = acc;
    this.parseAccession( acc );
    this.name = name;
  }
  
  private parseAccession(ffid: string): void {
    var parts = ffid.split('/');
    this.cathSfamId = parts[0];
    this.cathFunfamNum = parseInt( parts[2] );
  }
}
