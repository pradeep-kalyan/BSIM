// types/simulation.ts

export interface ExtendedSimulation {
  id: string;
  name: string;
  description: string | null;
  config: any;
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
}
