import { Input, Component } from '@angular/core';

@Component({
  selector: 'cath-rep-features',
  template: `
    <div class="card">
      <div class="card-block">
        <h4 class="card-title">Structure</h4>
        <div class="card-text">
          CATH rep features
        </div>
      </div>
    </div>
  `
})

export class CathRepFeaturesComponent {

  @Input() repid: string;
}
