
// http://stackoverflow.com/a/35257367

export type SegmentCoordinateType = "PDB" | "PDBE" | "UNIPROT";
export type SegmentPosition = "START" | "STOP";

export const SegmentCoordinateType = {
  PDB: "PDB" as SegmentCoordinateType, 
  PDBE: "PDBE" as SegmentCoordinateType, 
  UNIPROT: "UNIPROT" as SegmentCoordinateType, 
};

export const SegmentPosition = {
  START: "START" as SegmentPosition,
  STOP: "STOP" as SegmentPosition,
};

export class Segment {
  pdb_chain_code: string = undefined;
  uniprot_start: number = undefined;
  uniprot_stop: number = undefined;
  pdbe_start: number = undefined;
  pdbe_stop: number = undefined;
  pdb_label_start: string = undefined;
  pdb_label_stop: string = undefined;

  setPosition( start_stop: SegmentPosition, coord: SegmentCoordinateType, pos: any ):void {
    let attr: string = 
      coord === SegmentCoordinateType.PDB     ? 'pdb_label' :
      coord === SegmentCoordinateType.PDBE    ? 'pdbe' : 
      coord === SegmentCoordinateType.UNIPROT ? 'uniprot' : 
      '';
    
    attr += '_' + (SegmentPosition[start_stop] as string).toLowerCase();
    
    this[attr] = pos;
    
    return;
  }
    
}
