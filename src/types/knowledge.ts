export type AssetType = "upload" | "flexdoc" | "google" | "onedrive";

export interface Asset {
  id: string;
  name: string;
  description?: string;
  type: AssetType;
  folderId?: string;
  thumbnailUrl?: string;
  tags: string[];
  progress?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children?: Folder[];
  assetCount: number;
}
