import { Annotation } from '../annotations/annotation';

export class Member {
  id: string;
  label: string;
  source: string;
  db_version: string;
  organism: string;
  annotations: Annotation[];
  sequence: string;
}
