// types/simulation.ts

export interface ExtendedSimulation {
  id: string;
  name: string;
  description: string | null;
  config: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;

  canEdit?: boolean;
  canAccess?: boolean;
  current_period: number;
  status?: string;
  simulation_access?: {
    user: {
      id: string;
      role: string;
      name: string;
      email: string;
      password_hash: string;
      created_at: string;
      updated_at: string;
    };
  }[];
companies?: {
  id: string;
  name: string;
}[];

}
export interface CompanyWithAccess {
  canAccess: boolean;
  canEdit: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
  };
  company_access: {
    user_id: string;
    can_edit: boolean;
    can_access: boolean;
  }[];
}
