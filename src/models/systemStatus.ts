// src/models/systemStatus.ts

export interface SystemStatus {
  backend: boolean;
  database: boolean;
  totalStudents: number;
  loading: boolean;
  message: string;
}