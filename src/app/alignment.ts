import { Utils } from './helper/utils'; 
import { Member } from './members/member';
import * as _ from "lodash";

export class IAlignment {
  id: string;
  label: string;
  members?: Member[];  
}

export class Alignment {
  id: string;
  label: string;
  members?: Member[];

  constructor(opts?: IAlignment) {
    this.id = opts.id;
    this.label = opts.label;
    this.members = opts.members || [];
  }

  getFirstMemberWithStructure(): Member {
    var member: Member = _.find( this.members, function(m) { return m.hasPdbId() } );
    return member;
  }
}
