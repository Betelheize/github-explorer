export interface Owner {
  login: string;
  avatarUrl: string;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  license: string | null;
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
  htmlUrl: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
} 