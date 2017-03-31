import { Input, ElementRef, Component, OnInit } from '@angular/core';

//import * as _ from "lodash";

import { Alignment } from './alignment';
import { Member } from './members/member';
import { Domain } from './domain';
import { Annotation, GoAnnotation, EcAnnotation } from './annotations/annotation';

import { UniprotService } from './uniprot.service';
import { AlignmentService } from './alignment.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'cath-cluster',
  template: `
    <div class="cath-cluster container-fluid bg-fade">
      <div class="row">
        <div class="col-md-12 panel-header">
          <div class="">{{name}} <small>{{accession}}</small></div>
        </div>
      </div>
      <div class="row" *ngIf="selectedDomain">
        <div class="col-md-9 col-sm-9 panel-main">
          <cath-structure [pdbId]="selectedDomain.pdb_id" [selectedDomain]="selectedDomain"></cath-structure>
          <cath-structure-sequence [domain]="selectedDomain"></cath-structure-sequence>
        </div>
        <div class="col-md-3 col-sm-3 panel-side">
          <pdb-summary [pdbId]="selectedDomain.pdb_id"></pdb-summary>
          <cath-structure-details [pdbId]="selectedDomain.pdb_id" [domain]="selectedDomain"></cath-structure-details>
          <div class="card structure-details">
            <h4 class="card-header card-inverse card-success">
              CATH Domain: {{selectedDomain.id}}
            </h4>
            <div class="card-block">
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-9 col-sm-9">
          <ngb-tabset type="tabs" *ngIf="alignment">
            <ngb-tab>
              <template ngbTabTitle>Members</template>
              <template ngbTabContent>
                <member-list [mdaFocus]="cathSfamId" [members]="alignment.members"></member-list>
              </template>
            </ngb-tab>
            <ngb-tab>
              <template ngbTabTitle>Alignment</template>
              <template ngbTabContent>
                <cath-msa [alignment]="alignment"></cath-msa>
              </template>
            </ngb-tab>
          </ngb-tabset>
        </div>
        <div class="col-md-3 col-sm-3 panel-side">
        </div>
      </div>
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
      padding-top: 20px;
    }
    :host /deep/ .tab-pane.active {
      background-color: white;
      padding: 20px;
    }
    footer {
      padding-bottom: 20px;
    }
    .structure-details h4 {
      font-size: 1.1em;
      font-weight: normal;
      color: white;
    }
  `],
  providers: [
    AlignmentService
  ]
})

export class AppComponent implements OnInit {
  @Input()
  accession: string = '1.1.1.1/FF/1';

  cathSfamId: string;
  cathFunfamNum: number;
  alignment: Alignment;

  selectedDomain: Domain;

  goLookup: Array<GoAnnotation>;
  ecLookup: Array<EcAnnotation>;

  @Input()
  name: string = '<Funfam name>';

  @Input()
  repid: string = '1abcA01';

  constructor(public elementRef: ElementRef, private alignmentService: AlignmentService) {
    var native = this.elementRef.nativeElement;
    var acc = native.getAttribute('accession') || this.accession;
    var name = native.getAttribute('name') || this.name;
    this.accession = acc;
    this.parseAccession( acc );
    this.name = name;
  }

  ngOnInit(): void {
    this.getAlignment();
  }

  public onSelectDomain( domain: Domain ): void {
    this.selectedDomain = domain;
  }

  public getAlignment() {
    this.alignmentService.getAlignment().then( alignment => {
      this.alignment = alignment;
      console.log( "getAlignment", alignment );
      let structuralRep: Member = this.alignment.getFirstMemberWithStructure();
      this.name = alignment.description;
      this.accession = alignment.id;
      if ( structuralRep ) {
        let pdbAnns = structuralRep.getStructuralAnnotations();
        console.log( "structuralAnnotations", structuralRep, pdbAnns );
        let firstPdbAnnotation = pdbAnns[0];
        this.onSelectDomain( firstPdbAnnotation.pdbDomain );
      }
      
      // get descriptions for all the uniq GO / EC terms
      let unique_go_anns = alignment.filterAllAnnotations( { type: 'GO' } );
    });
  }
  

  private parseAccession(ffid: string): void {
    var parts = ffid.split('/');
    this.cathSfamId = parts[0];
    this.cathFunfamNum = parseInt( parts[2] );
  }
}
