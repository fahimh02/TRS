import { JobInfo } from "../JobInfo";
import { StyleInfo } from "../StyleInfo";
import { Image } from "../Image";

export interface CombinedData {
  style: StyleInfo;
  jobs: JobInfo[];
  images: Image[
    
  ]; 
}
