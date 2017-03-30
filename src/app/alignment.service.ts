import { Injectable } from '@angular/core';

import { Alignment } from './alignment';

import { STOCKHOLM_ALIGNMENT } from './mock-alignment';

@Injectable()
export class AlignmentService {
    getAlignment(): Promise<Alignment> {
      return Promise.resolve( STOCKHOLM_ALIGNMENT );
    }
}
