import { Member } from '../members/member';
import { Segment, SegmentPosition, SegmentCoordinateType } from '../segment';
import { ColumnAnnotation, Alignment, IAlignment } from '../alignment';
import { Annotation, StructuralAnnotation } from '../annotations/annotation';
import { Uniprot } from '../uniprot';
import { Domain } from '../domain';
import * as _ from 'lodash';

class DatabaseRef {
  db_name: string;
  db_ids: string[] = [];
}

interface ReferenceSequenceI {
  seq_id: string;
  feature: string;
  accession: string;
  organism?: string;
  sequence?: string;
  segments?: Segment[];
  annotations?: Annotation[];
}

// temporary data structure that matches the 
class ReferenceSequence {
  seq_id: string;
  feature: string;
  accession: string;
  organism: string;
  sequence: string = '';
  segments: Segment[] = [];
  annotations: Annotation[] = [];
  db_ref_by_name: Array<DatabaseRef> = [];

  constructor(opts?: ReferenceSequenceI) {
    this.db_ref_by_name = [];
    this.segments = [];
    if ( opts ) {
      this.seq_id = opts.seq_id;
      this.feature = opts.feature;
      this.accession = opts.accession;
      if ( opts.organism ) { 
        this.organism = opts.organism;
      }
      this.segments = opts.segments || []; 
    }
  }
  
  addDbRef(ref:DatabaseRef):void {
    if( typeof this.db_ref_by_name[ ref.db_name ] === 'undefined' ) {
      this.db_ref_by_name[ ref.db_name ] = ref;
    }
    else {
      // concatenate all ids into one array indexed by db_name 
      let ref_by_name = this.db_ref_by_name[ ref.db_name ];
      ref.db_ids.forEach( (id) => ref_by_name.db_ids.push(id) );
    }
  }
  
  getDbRefs() {
    return this.db_ref_by_name;
  }

  getDbRef(name: string) {
    return this.db_ref_by_name[ name ];
  }

  setProp( prop: keyof ReferenceSequence, value: any ) {
    this[prop] = value;
  }
  
  getProp( prop: keyof ReferenceSequence ) {
    return this[prop];
  }

}

export type SequenceSourceToCoordinate = "CATH" | "BIOMAP" | "UNIPROT";

export const SequenceSourceToCoordinate = {
  CATH: SegmentCoordinateType.PDB as SegmentCoordinateType,
  BIOMAP: SegmentCoordinateType.UNIPROT as SegmentCoordinateType,
  UNIPROT: SegmentCoordinateType.UNIPROT as SegmentCoordinateType,
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

    let aln_args: IAlignment = new IAlignment();

    let sequence_by_id: Array<ReferenceSequence> = [];
    let column_annotations = [];

    let lines = stockholm_raw.split('\n');
    let header = lines.shift();

    let line_count = 1;
    
    let re_match_seqid = new RegExp( /^(.*?)\/([0-9,\-_]+)$/ );
    let re_split_segments = new RegExp( /[,_]/ );
    let re_split_gs_dr = new RegExp( /\s*;\s*/ );

    let process_gs_line = function(line: string): void {
      let gs_parts = line.split(/\s+/);
      gs_parts.shift();
      let seq_id = gs_parts.shift();
      let feature = gs_parts.shift();
      let content = gs_parts.join( " " );

      // console.log( "#=GS ", gs_parts, seq_id, feature, content );
      
      let ref_seq: ReferenceSequence = sequence_by_id[seq_id];      
      if ( typeof ref_seq === 'undefined' ) {
        let domain : Domain = Utils.getDomainFromSequenceId( SegmentCoordinateType.UNIPROT, seq_id );
        ref_seq = new ReferenceSequence();
        ref_seq.seq_id = seq_id;
        ref_seq.segments = domain.segments;
        sequence_by_id[ seq_id ] = ref_seq;
      }
      
      if ( feature == 'DR' ) {
        let dr_parts = _.without( content.split( re_split_gs_dr ), '' );
        let db_name = dr_parts.shift();
        let db_ids = dr_parts.map( (p) => { return p.trim() } );
        let db_ref: DatabaseRef = { db_name, db_ids };
        ref_seq.addDbRef( db_ref );
        // console.log( `DR '${content}'`, dr_parts, db_name, db_ids, ref_seq );
      }
      else {
        let attr = stockholm_feature_to_attr[feature];
        let ann = new Annotation( { type: feature, id: attr } );
        //console.log( `Seq[${seq_id}] : adding feature '${feature}' as attribute '${attr}' (content: '${content}')` );
        if ( typeof attr != 'undefined' ) {
          ref_seq.setProp( attr, content );
        }
      }
    };
    
    for ( let line of lines ) {
      line_count++;
      line = line.trim();                       // chomp new line chars
      if ( line.length == 0 ) { continue }       // ignore blank lines
      if ( line.substr(0,2) == '//' ) { break }  // end of alignment
      let line_type = line.substr(0,4);
      //console.log( "LINE: ", line_count, line_type, `'${line}'` );
      switch (line_type) {
        case '#=GF': // <feature> <Generic per-file annotation>
          let gf_parts = line.split(/\s+/);
          gf_parts.shift();               // #=GF
          let feature = gf_parts.shift(); // <feature>
          let attr = stockholm_feature_to_attr[feature];
          if ( typeof attr !== 'undefined' ) {
            aln_args[attr] = gf_parts.join(" ");
          }
          break;
        case '#=GC': // <feature> <Generic per-column annotation>
          let gc_parts = line.split(/\s+/, 3);
          if ( gc_parts.length != 3 ) {
            console.error( `expected 3 columns from GC line (line: ${line_count})` );
            return;
          }
          let col_ann: ColumnAnnotation = { feature: gc_parts[1], sequence: gc_parts[2] };
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
          sequence_by_id[ seq_id ].setProp( 'sequence', seq );
          break;
      }
    }
      
    let aln = new Alignment( aln_args );
    
    for( let id in sequence_by_id ) {  
      let seq = sequence_by_id[ id ];

      let domain = Utils.getDomainFromSequenceId( SegmentCoordinateType.UNIPROT, id );      
      let annotations: Annotation[] = [];
      
      let db_refs = seq.getDbRefs();
      for ( let db_type in db_refs ) {
        let db_ref: DatabaseRef = db_refs[db_type];
        _.map( db_ref.db_ids, function(db_id) {
          let type = db_ref.db_name;
          let id = db_id;
          let description = undefined;
          let annotation; // Annotation | StructuralAnnotation
          if ( type == 'CATH' ) {
            annotation = new StructuralAnnotation();
            let domain = Utils.getDomainFromSequenceId( 'CATH', id );
            annotation.pdbDomain = domain;
          }
          else {
            annotation = new Annotation();
          }
          annotation.type = db_ref.db_name;
          annotation.id = db_id;
          
          annotations.push( annotation );            
        })        
      }
      
      let member = new Member({
        id: seq.seq_id,
        label: seq.accession,
        source: 'uniprot',
        db_version: 'latest',
        organism: seq.organism,
        sequence: seq.sequence,
        domain,
        annotations,
      });
      aln.members.push( member );
    }
    
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
