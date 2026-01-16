export interface SystemStatus {
  backend: boolean;
  database: boolean;
  totalStudents: number | string; // Enable strings here
  loading: boolean;
  message: string;
}