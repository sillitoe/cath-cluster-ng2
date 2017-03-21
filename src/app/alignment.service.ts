import { Injectable } from '@angular/core';

import { Alignment } from './alignment';

import { ALIGNMENT } from './mock-alignment';

@Injectable()
export class AlignmentService {
    getAlignment(): Promise<Alignment> {
      return Promise.resolve(ALIGNMENT);
    }
}
