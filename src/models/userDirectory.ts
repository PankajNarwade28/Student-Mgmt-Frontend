export interface DirectoryUser {
  id: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Admin';
  is_active: boolean;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  related_courses: string[]; // This matches our JSON_AGG result
}