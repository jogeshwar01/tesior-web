export interface UserProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  source: string | null;
  migratedWorkspace: string | null;
  defaultWorkspace?: string;
  isMachine: boolean;
}

export interface WorkspaceUserProps extends UserProps {
  role: RoleProps;
}

export const roles = ["owner", "member"] as const;
export type RoleProps = (typeof roles)[number];

export interface WorkspaceProps {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: Date;
  users: {
    role: RoleProps;
  }[];
}
