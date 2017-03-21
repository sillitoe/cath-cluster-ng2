import { Component, Input, OnInit } from '@angular/core';
import { Annotation } from './annotations/annotation';

@Component({
  selector: 'cath-mda-badge',
  template: `
    <div class="mda-container">
      <span *ngFor="let id of mdaIds"
        class="badge {{id == mdaFocus ? 'badge-success' : 'badge-default'}}">{{id}}</span>
    </div>
  `,
  styles: [`
    .mda-container {
      white-space: nowrap;
    }
    .badge-default {
      background-color: #999;
    }
  `]
})

export class CathMdaBadgeComponent implements OnInit {
  @Input()
  mdaAnnotation: Annotation;
  
  @Input()
  mdaFocus: string;
  
  mdaIds: string[] = [];
  
  ngOnInit(): void {
    let mda = this.mdaAnnotation;
    if ( mda ) {
      this.mdaIds = mda.id.split('_');      
    }
  }
}
