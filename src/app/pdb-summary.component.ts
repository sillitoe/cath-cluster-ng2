import { Component, Input, ElementRef, OnChanges, SimpleChange } from '@angular/core';

import * as PDBe from './pdbe';

import { StructureService } from './structure.service';

@Component({
  selector: 'pdb-summary',
  template: `
    <div *ngIf="pdbSummary">
      <blockquote>{{pdbSummary.title}}</blockquote>
      <dl class="row">
        <dt class="col-sm-3">PDB</dt>
        <dd class="col-sm-9">
          {{pdbId | uppercase}}
          <span class="pdb-links float-right">
            <a *ngFor="let link of links"
              href="{{link.href}}{{pdbId}}"
              class="badge badge-primary">{{link.text}}</a>
          </span>
        </dd>
        <dt class="col-sm-3">Authors</dt>
        <dd class="col-sm-9">{{pdbSummary.entry_authors.join(', ')}}</dd>
        <dt class="col-sm-3">Released</dt>
        <dd class="col-sm-9">{{pdbSummary.release_date | date}}</dd>
      </dl>
    </div>
    <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
      <strong>ERROR: </strong> {{errorMessage}}
    </div>
  `,
  styles: [`
  `],
  providers: [
    StructureService
  ]
})

export class PdbSummaryComponent implements OnChanges {
  errorMessage: string;

  @Input()
  pdbId: string;

  pdbSummary: PDBe.PdbSummary;
  mode = 'Observable';

  links = [
    { text: 'PDBe', href: 'https://www.ebi.ac.uk/pdbe/entry/pdb/' },
  ];

  constructor(private structureService: StructureService) {}

  ngOnChanges( changes: {[propKey: string]: SimpleChange }) {
    if ( this.pdbId ) {
      this.getPdbSummary();
    }
  }

  getPdbSummary() {
    this.structureService.getPdbSummary(this.pdbId)
      .subscribe(
        pdbSummary => this.pdbSummary = pdbSummary,
        error => this.errorMessage = <any>error
      );
  }

}
