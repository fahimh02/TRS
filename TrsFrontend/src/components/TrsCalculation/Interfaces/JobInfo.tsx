export interface JobInfo {
  authorId:number;
  bobbinNT: number;
  bobbinThreadName: string;
  coverNT: number;
  coverThreadName: string;
  //created: Date;
  editorId: number;
  id: number;
  job: string;
  //modified: Date;
  needleNT: number;
  needleThreadName: string;
  numberOfLayers: number;
  seamLength: number;
  sewingAllowance: number;
  sewingAllownceBT: number;
  sewingAllownceCT: number;
  sewingAllownceNT: number;
  sewingAllownceTotal: number;
  stitchCount: number;
  stitchDescription: string;
  stitchRow: number;
  stitchType: string;
  styleId: number;
  totalNT: number;
  totalThreadBT: number;
  totalThreadCT: number;
  totalThreadNT: number;
  totalThreadTotal: number;
  unitId: number;
}


