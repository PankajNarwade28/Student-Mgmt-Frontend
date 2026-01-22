
import { useNavigate } from 'react-router-dom';
export const Admin = () => {
  const navigate = useNavigate();   
  return (
    <>
        <div className="admin-tools">
    <h3>Admin Panel Quick Links</h3>

    <button onClick={() => navigate('/dashboard/admin/adduser')}>
      Add New Student.
    </button>

    <button onClick={() => navigate('/dashboard/admin/viewuser')}>
      View All Users.
    </button>
  </div>
    </>
  )
}
