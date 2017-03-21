import { Component, Input } from '@angular/core';

import { Domain } from './domain';

@Component({
  selector: 'cath-structure-sequence',
  template: `
    <div class="">CATH Sequence
    </div>
  `
})

export class CathStructureSequenceComponent {
  @Input()
  domain: Domain;
}
