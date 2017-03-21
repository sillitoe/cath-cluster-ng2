import { Component, Input } from '@angular/core';

import { Alignment } from './alignment';

@Component({
  selector: 'cath-msa',
  template: `
    <div class="">CATH MSA
    </div>
  `
})

export class CathMsaComponent {
  
  @Input()
  alignment: Alignment;
}
