export interface ArticleInfo {
    id: number;
    name: string;
    length: number;
    created: Date;
    modified: Date;
    authorId: number;
    editorId: number;
    isActive:boolean;
  }