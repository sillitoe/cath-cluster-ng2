import { Component, Input, ElementRef, OnChanges, SimpleChange } from '@angular/core';

import { Domain } from './domain';

import * as PDBe from './pdbe';

import { StructureService } from './structure.service';

@Component({
  selector: 'cath-structure-details',
  template: `
    <div class="row">
      <div class="col-sm-6">
        <div class="card card-inverse card-info mb-3 text-center">
          <div class="card-block">Binding Sites
            <span class="badge badge-large badge-inverse badge-pill">{{bindingSites.length}}</span>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card card-inverse card-warning mb-3 text-center">
          <div class="card-block">Mutations
            <span class="badge badge-large badge-inverse badge-pill">{{mutatedResidues.length}}</span>
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

  bindingSites: PDBe.BindingSite[] = [];
  mutatedResidues: PDBe.MutatedResidue[] = [];
  mode = 'Observable';

  constructor(private structureService: StructureService) {}

  ngOnChanges( changes: {[propKey: string]: SimpleChange }) {
    if ( this.pdbId ) {
      this.getBindingSites();
      this.getMutatedResidues();
    }
  }

  getBindingSites() {
    this.structureService.getPdbBindingSites(this.pdbId)
      .subscribe(
        bindingSites => this.bindingSites = bindingSites,
        error => this.errorMessage = <any>error
      );
  }

  getMutatedResidues() {
    this.structureService.getPdbMutatedResidues(this.pdbId)
      .subscribe(
        mutatedResidues => this.mutatedResidues = mutatedResidues,
        error => this.errorMessage = <any>error
      );
  }

}
