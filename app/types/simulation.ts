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
export interface Props {
  simulation: {
    id: string;
    name: string;
    description: string | null;
    config: Record<string, unknown>;
    simulation_access?: { user: { email: string } }[];
  };
  onClose: () => void;
  onUpdated: () => void;
  onUpdatedPartial: () => void;
}
export interface CardProps {
  simulations: ExtendedSimulation[];
  currentUserId?: string;
  onEdit?: (sim: ExtendedSimulation) => void;
  onDelete?: (id: string) => void;
}