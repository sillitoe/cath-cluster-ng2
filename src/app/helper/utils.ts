import { Member } from '../members/member';
import { Segment, SegmentPosition, SegmentCoordinateType } from '../segment';
import { ColumnAnnotation, Alignment } from '../alignment';
import { Annotation } from '../annotations/annotation';
import { Uniprot } from '../uniprot';
import { Domain } from '../domain';

class SequenceDatabaseReference {
  db_name: string;
  db_ids: string[] = [];
}

class SequenceAnnotation {
  seq_id: string;
  feature: string;
  accession: string;
  organism: string;
  segments: Segment[] = [];
  db_refs: SequenceDatabaseReference[] = [];
}

export type SequenceSourceToCoordinate = "CATH" | "BIOMAP";

export const SequenceSourceToCoordinate = {
  CATH: SegmentCoordinateType.PDB as SegmentCoordinateType,
  BIOMAP: SegmentCoordinateType.UNIPROT as SegmentCoordinateType,
}

var stockholm_feature_to_attr = {
  AC: 'accession',
  ID: 'id',
  DE: 'description',
  AU: 'author',
  TP: 'type',
  DR: 'db_ref',
  DC: 'db_comment',
  OS: 'organism',
  OC: 'organism_classification',
};

export class Utils {
    
  static parseStockholm( stockholm_raw: string ) : Alignment {

    let aln_args = {};

    let sequences_by_id = {};
    let sequence_annotations_by_id: SequenceAnnotation[];
    let column_annotations = [];

    let lines = stockholm_raw.split('\n');
    let header = lines.shift();

    let line_count = 1;
    
    let re_match_seqid = new RegExp( /^(.*?)\/([0-9,\-_]+)$/ );
    let re_split_segments = new RegExp( /[,_]/ );
    let re_split_gs_dr = new RegExp( /;\s+/ );

    let process_gs_line = function(line: string): void {
      let gs_parts = line.split(/\s+/, 4);
      
      let seq_id = gs_parts[1];
      let feature = gs_parts[2];
      let content = gs_parts[3];
      
      let seq_ann = sequence_annotations_by_id[seq_id];
      if ( typeof seq_ann === 'undefined' ) {
        let seq_id_parts = seq_id.match( re_match_seqid );
        if ( !seq_id_parts || seq_id_parts.length != 2 ) {
          console.error( `failed to parse sequence range from id '${seq_id}'` );
          return;
        }
        let accession = seq_id_parts[0];
        let segments_raw = seq_id_parts[1].split( re_split_segments );
        let segments: Segment[] = [];
        for ( let seg_str in segments_raw ) {
          let seg_parts = seg_str.split('-');
          let segment = new Segment();
          segment.setPosition( 'START', SegmentCoordinateType.UNIPROT, seg_parts[0] );
          segment.setPosition( 'STOP', SegmentCoordinateType.UNIPROT, seg_parts[1] );
          segments.push(segment);
        }
        seq_ann = <SequenceAnnotation> {
          seq_id,
          accession,
          segments
        };
        sequence_annotations_by_id[ seq_id ] = seq_ann;
      }
      
      seq_ann.feature = feature;
      
      if ( feature == 'DR' ) {
        let dr_parts = content.split( re_split_gs_dr );
        let db_name = dr_parts.shift();
        let db_ids = dr_parts;
        let db_ref = <SequenceDatabaseReference> { db_name, db_ids };
        seq_ann.db_refs.push( db_ref );
      }
      else {
        let attr = stockholm_feature_to_attr[feature];
        if ( typeof attr != 'undefined' ) {
          seq_ann[attr] = content;
        }
      }
    };
    
    for ( let line of lines ) {
      line_count++;
      line.replace(/\s+$/, '');                  // chomp new line chars
      if ( line.length == 0 ) { continue }       // ignore blank lines
      if ( line.substr(0,2) == '//' ) { break }  // end of alignment
      let line_type = line.substr(0,4);
      switch (line_type) {
        case '#=GF': // <feature> <Generic per-file annotation>
          let gf_parts = line.split(/\s+/, 3);
          let feature = gf_parts[1];
          let attr = stockholm_feature_to_attr[feature];
          if ( typeof attr != 'undefined' ) {
            aln_args[attr] = gf_parts[2];
          }
          break;
        case '#=GC': // <feature> <Generic per-column annotation>
          let gc_parts = line.split(/\s+/, 3);
          if ( gc_parts.length != 3 ) {
            console.error( `expected 3 columns from GC line (line: ${line_count})` );
            return;
          }
          let col_ann = <ColumnAnnotation> { feature: gc_parts[1], sequence: gc_parts[2] };
          column_annotations.push( col_ann );
          break;
        case '#=GS': // <seqname> <feature> <Generic per-sequence annotation>
          process_gs_line( line );
          break;
        case '#=GR': // <seqname> <feature> <Generic per-residue annotation>
          let gr_parts = line.split(/\s+/, 4);          
          console.log( "#=GR parsing not yet implemented..." );
          break;
        default:
          let seq_parts = line.split(/\s+/);
          let seq_id = seq_parts[0];
          let seq = seq_parts[1];
          sequences_by_id[ seq_id ] = seq;
          break;
      }
    }
    
    // ****HERE****
    
    // fold everything back together
    
    // alignment expects Member[]
    
    let aln = new Alignment();
    
    sequence_annotations_by_id.forEach( (seq_data, id) => {
      let sequence = sequences_by_id[ id ];
      let member = new Member({
        id: seq_data.seq_id,
        label: seq_data.accession,
        source: 'uniprot',
        db_version: 'latest',
        organism: seq_data.organism,
        sequence: sequence,
        //domain: Domain,
        //annotations: seq_data.db_refs,
      });
      aln.members.push( member );
    });
    
    aln.column_annotations = column_annotations;
    
    return aln;
  }
    
  static parseUniprot(uniprot_raw: string) : Uniprot {
    
    var uniprot_lines = uniprot_raw.split('\n');
    
    var accession: string, 
      organism: string, 
      gene_id: string,
      aa_count: number, 
      recommended_name: string,
      alternative_names: string[],
      annotations: Annotation[],
      gene_name: string,
      organism_classification: string[]
      ;
      
    var ec_match = /EC=([0-9.]+)/;
    var recname_match = /RecName: Full=(.*?);/;
    var altname_match = /AltName: Full=(.*?);/;
    var genename_match = /Name=(\w+)/;
    
    uniprot_lines.forEach( function(line_raw, line_number){
      var line_parts = line_raw.split(/\s+/, 2);
      var code = line_parts[0];
      var line = line_parts[1].replace('\n', '');
      
      switch (code) {
        case 'ID':
          var parts = line.split(/\s+/);
          gene_id = parts[0];
          aa_count = parseInt( parts[1] );
          break;
        case 'AC':
          accession = line.replace(';', '');
          break;
        case 'DE':
          var ec = line.match( ec_match );
          if ( ec ) {
            annotations.push( {
              type: 'EC',
              id: ec[1],
              description: null,
            })
          }
          var recname = line.match( recname_match );          
          if (recname) {
            recommended_name = recname[1];
          }
          var altname = line.match( altname_match );          
          if (altname) {
            alternative_names.push( altname[1] );
          }
          break;
        case 'GN':
          var name = line.match( genename_match );        
          if (name) {
            gene_name = name[1];
          }
          break;
        case 'OC':
          organism_classification = line.replace(/.$/, '').split( /;\s*/ );
          break;
      }
      
    });

    var uniprot: Uniprot = {
      accession,
      organism,      
      gene_name,
      gene_id,
      aa_count,
      recommended_name,
      alternative_names,
      organism_classification,
      annotations,
    };
    
    return uniprot;
  }


  static getMembersFromFasta(fasta_raw: string) : Member[] {

    // split into lines
    let lines: string[] = fasta_raw.split(/\n/);
    
    let members: Member[] = [];

    while( lines.length > 0 ) {

      let annotations: Annotation[] = [];
      
      // get the header (remove new line)
      let header: string = lines.shift().replace(/\n$/, '');

      let member = Utils.getMemberFromFastaHeader( header );
      
      // assume all subsequent non-header lines are the sequence
      var sequence: string = "";
      while ( lines.length > 0 && lines[0].charAt(0) != '>' ) {
        sequence += lines.shift().replace(/\n$/, '');
      }
      member.sequence = sequence;
      
      console.log( "Sequence", member );

      members.push( member );
    }

    return members;
  }
  
  static getMemberFromFastaHeader(header: string) : Member {

    let organism: string = 'unknown';
    let annotations: Annotation[] = [];
  
    let header_parts: string[] = header.split(/\s+/);
    
    let id_raw: string = header_parts[0];
    let annotations_raw: string = header_parts[1];
    let id_parts: string[] = id_raw.replace( /^>/, '' ).split('|');
    let id = id_parts[2];
    let source = id_parts[0];
    let db_version = id_parts[1];
    let label = '';
          
    var annotation_types: string[] = annotations_raw.split(';');
    annotation_types.forEach( function(annotation_type_raw) {
      var annotation_type_parts = annotation_type_raw.split('=');
      var annotation_type = annotation_type_parts[0];
      var annotation_ids = annotation_type_parts[1].split(',');
      
      annotation_ids.forEach( function(id) {
        if ( annotation_type == 'ORG' ) {
          organism = id;
        }
        else {
          var annotation: Annotation = {
            type: annotation_type,
            id,
            description: id          
          }
          annotations.push( annotation ); 
        }
      });
    });
    
    let domain = Utils.getDomainFromSequenceId( source, id );
    
    return new Member({
      id,
      label,
      source,
      db_version,
      organism,
      annotations,
    });    
  }    

  static getDomainFromSequenceId( source: string, id: string ) : Domain {
    
    let domain_id: string;
    let pdb_id: string;
    let segments: Segment[] = [];
    
    source = source.toUpperCase();
    
    if ( SequenceSourceToCoordinate[source] == SequenceSourceToCoordinate.CATH ) {
      pdb_id = id.substr(0, 4);
    }
    
    let sequence_coordinate_type = SequenceSourceToCoordinate[ source ];
    if ( typeof sequence_coordinate_type === 'undefined' ) {
      console.error( `Error: no idea how to map numbering of sequence source '${source}' to structure`, SequenceSourceToCoordinate );
    }
    else {
      let id_seg_parts: string[] = id.split( '/' );
      if ( id_seg_parts.length > 0 ) {
        domain_id = id_seg_parts[0];
        let seg_parts: string[] = id_seg_parts[1].split('_');
        seg_parts.forEach( function(seg_str) {
          let seg_str_parts = seg_str.split('-');
          let seg = new Segment();
          seg.setPosition( SegmentPosition.START, sequence_coordinate_type, seg_str_parts[0] );
          seg.setPosition( SegmentPosition.STOP, sequence_coordinate_type, seg_str_parts[1] );
          segments.push( seg );
        });
      }
    }
    
    return {
      id: domain_id,
      pdb_id,
      segments
    }
  } 

}
