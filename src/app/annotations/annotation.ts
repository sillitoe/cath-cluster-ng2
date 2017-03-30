import { Domain } from '../domain';

type PdbId = string;

export class IAnnotation {
  type: string;
  id: string;
  description?: string;
}

export class Annotation {
  type: string;
  id: string;
  description?: string;
  
  constructor(opts?: IAnnotation) {
    if ( opts ) {
      this.type = opts.type;
      this.id = opts.id;
      this.description = opts.description;
    }
  }
}

export class StructuralAnnotation extends Annotation {
  pdbId: PdbId;
  pdbDomain: Domain;
  constructor() {
    super();
  }
}
