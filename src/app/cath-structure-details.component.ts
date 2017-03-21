import { Component, Input, ElementRef, OnChanges, SimpleChange } from '@angular/core';

import { Domain } from './domain';

import { PdbSummary } from './pdb-summary';
import { PdbBindingSite } from './pdb-binding-site';
import { PdbMutatedResidue } from './pdb-mutated-residue';
import { StructureService } from './structure.service';

@Component({
  selector: 'cath-structure-details',
  template: `
    <div *ngIf="pdbSummary">
      <blockquote>{{pdbSummary.title}}</blockquote>
      <dl class="row">
        <dt class="col-sm-3">PDB</dt>
        <dd class="col-sm-9">{{pdbId | uppercase}}</dd>
        <dt class="col-sm-3">Authors</dt>
        <dd class="col-sm-9">{{pdbSummary.entry_authors.join(', ')}}</dd>
        <dt class="col-sm-3">Released</dt>
        <dd class="col-sm-9">{{pdbSummary.release_date | date}}</dd>
      </dl>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <div class="card card-inverse card-info mb-3 text-center">
          <div class="card-block">Binding Sites
            <span class="badge badge-large badge-inverse badge-pill">{{pdbBindingSites.length}}</span>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card card-inverse card-warning mb-3 text-center">
          <div class="card-block">Mutations
            <span class="badge badge-large badge-inverse badge-pill">{{pdbMutatedResidues.length}}</span>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
      <strong>ERROR: </strong> {{errorMessage}}
    </div>
  `,
  styles: [`
    h4 {
      font-size: 1.0em;
      font-weight: normal;
      font-style: italic;
      padding-bottom: 10px; 
    }
    blockquote {
    }
    .badge-large {
      font-size: 2em;
    }
  `],
  providers: [
    StructureService
  ]
})

export class CathStructureDetailsComponent implements OnChanges {
  errorMessage: string;
  
  @Input()
  pdbId: string;

  @Input()
  domain: Domain;
  
  pdbSummary: PdbSummary;
  pdbBindingSites: PdbBindingSite[] = [];
  pdbMutatedResidues: PdbMutatedResidue[] = [];
  mode = 'Observable';
  
  constructor(private structureService: StructureService) {}
  
  ngOnChanges( changes: {[propKey: string]: SimpleChange }) {
    if ( this.pdbId ) {
      this.getPdbSummary();
      this.getPdbBindingSites();
      this.getPdbMutatedResidues();
    }
  }  
  
  getPdbSummary() {
    this.structureService.getPdbSummary(this.pdbId)
      .subscribe(
        pdbSummary => this.pdbSummary = pdbSummary,
        error => this.errorMessage = <any>error
      );
  }

  getPdbBindingSites() {
    this.structureService.getPdbBindingSites(this.pdbId)
      .subscribe(
        pdbBindingSites => this.pdbBindingSites = pdbBindingSites,
        error => this.errorMessage = <any>error
      );
  }

  getPdbMutatedResidues() {
    this.structureService.getPdbMutatedResidues(this.pdbId)
      .subscribe(
        pdbMutatedResidues => this.pdbMutatedResidues = pdbMutatedResidues,
        error => this.errorMessage = <any>error
      );
  }

}
