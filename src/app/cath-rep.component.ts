import { Component, Input } from '@angular/core';

@Component({
  selector: 'cath-rep',
  template: `
    <div class="">CATH Rep
    </div>
  `
})

export class CathRepComponent {
  @Input()
  repid: string;
}
