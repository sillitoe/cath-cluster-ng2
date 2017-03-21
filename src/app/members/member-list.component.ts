import { Component, Input } from '@angular/core';

import { Member } from './member';

@Component({
  selector: 'member-list',
  template: `
  <p class="">The cluster contains {{members.length}} protein sequences.
  </p>
  <table class="table table-sm">
    <thead>
      <tr>
        <th>Source</th>
        <th>ID</th>
        <th>Organism</th>
        <th>Functional Annotations</th>
        <th>Enzyme Reactions</th>
        <th>Domain Arrangement</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let member of members">
        <td><span class="badge badge-default">{{member.source | uppercase}} {{member.db_version}}</span></td>
        <td>{{member.id}}</td>
        <td class="species">{{member.organism.split('_').join(' ')}}</td>
        <td class="annotation-go">
          <span *ngFor="let annotation of member.filterAnnotationsByType('GO')"
            class="badge badge-warning badge-go">
            {{annotation.id}}
          </span>
        </td>
        <td class="annotation-ec">
          <span *ngFor="let annotation of member.filterAnnotationsByType('EC');" 
            class="badge badge-info">
            {{annotation.id}}
          </span>
        </td>
        <td class="annotation-mda">
          <cath-mda-badge [mdaFocus]="mdaFocus" [mdaAnnotation]="member.findAnnotationByType('MDA')"></cath-mda-badge>
        </td>
      </tr>
    </tbody>
  </table>
  `,
  styles: [`
    .species {
      font-style: italic;
    }
    /deep/ span.badge {
      margin-right: 0.5em;
    }
  `]
})

export class MemberListComponent {

  @Input()
  members: Member[];

  @Input()
  mdaFocus: string;

}