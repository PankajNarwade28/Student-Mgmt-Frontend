export interface Course {
  id: number;
  name: string;
  code: string;
  deleted_at: string | null;
  created_at: string;
  description: string;
  teacher_id: string;
    teacher_name: string;
  teacher_email: string;
}

export interface UpdateModalProps {
  course: Course; // Changed from any
  teachers: Array<{ id: string; teacher_name: string }>; // Typed array
  onClose: () => void;
  onUpdate: (id: number, data: Partial<Course>) => Promise<void>; // Typed async function
}