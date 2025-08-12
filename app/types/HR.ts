export interface HRRole {
  role_name: string;
  salary_per_head: number;
  head_count: number;
}

export interface Props {
  hrRoles: HRRole[];
  onRoleChange: (index: number, field: string, value: string | number) => void;
  onAddRole: () => void;
  onRemoveRole: (index: number) => void;
  trainingBudget: number;
  onTrainingBudgetChange: (value: number) => void;
  employeeSatisfaction: number;
  onEmployeeSatisfactionChange: (value: number) => void;
}