export interface Share {
  slug: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
}

export interface CreateShareResponse extends Share {
  secretToken: string;
  shareUrl: string;
  deleteUrl: string;
}

export interface LocalShare {
  slug: string;
  secretToken: string;
  createdAt: string;
}
