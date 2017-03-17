import { Component } from '@angular/core';

import { MEMBERS } from './mock-members';

@Component({
  selector: 'member-list',
  template: `
  <dl *ngFor="let member of members">
    <dt><span class="badge badge-default">{{member.source | uppercase}} {{member.db_version}}</span> {{member.id}} <em>{{member.organism.split('_').join(' ')}}</em></dt>
    <dd>
      <ul>
      <li class="" *ngFor="let annotation of member.annotations">
        {{annotation.type}}: {{annotation.id}}
      </li>
      </ul>
    </dd>
  </dl>
  `,
  styles: [
    ``
  ]
})

export class MemberListComponent {
  members = MEMBERS;
}