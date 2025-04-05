import React from 'react';
import { Routes, Route } from "react-router-dom"; 
import { ProtectedRoute } from './context/ProtectRoute';
import SignIn from './Components/Auth/SignIn';
import SignUp from './Components/Auth/SignUp';
import AdminDashboard from './Dashboard/AdminDashboard/Admindashboard';
import HR_register from './Pages/HR_Register/HR_register';
import EmployeeDashboard from "./Dashboard/EmployeeDashboard/EmployeeDashboard"
import Compensation from './Pages/Compensation/Compensation';
import AddCompensation from './Pages/Compensation/Addcompensation';
import Departments from './Pages/Department/AddDepartment';
import AllDepartments from './Pages/Department/AllDepartment';
import AddPerformance from './Pages/perfomanceReview/AddPerformanceReview';
import Performance from './Pages/perfomanceReview/PerformanceReview';
import AddJobHistory from './Pages/JobHistory/AddHistory';
import AllHistory from './Pages/JobHistory/AllHistory';
import DashboardLayout from './Components/Layout/DashbordLayout';
import AllHR from './Pages/HR_Register/AllHR';
import HRDashboard from './Dashboard/HRDashborad/HRdashboard';
import AllEmploys from './Pages/employees/AllEmploys';
import EmployeeForm from './Pages/employees/EmployeeForm';
import UpdateEmployeeForm from './Pages/employees/UpdateEmployeeForm';
import SingleEmployee from './Pages/employees/SingleEmployee';
import DeleteEmployee from './Pages/employees/DeleteEmployee';
import AllJobs from './Pages/job/AllJobs';
import PostJob from './Pages/job/PostJob';
import UpdateJob from './Pages/job/UpdateJob';
import SingleJob from './Pages/job/SingleJob';
import DeleteJob from './Pages/job/DeleteJob';
import PublicJobs from './Pages/job/publicjobs/PublicJobs';
import SinglePublicJob from './Pages/job/publicjobs/SinglePublicJob';
import AttendanceForm from './Pages/attendance/AttendanceForm';
import Attendance from './Pages/attendance/Attendance';
import ApplicationForm from './Pages/applications/ApplicationForm';
import AllApplications from './Pages/applications/AllApplications';
import UpdateApplicationForm from './Pages/applications/UpdateApplicationForm';
import PositionAssignmentForm from './Pages/positions/PositionAssignmentForm';
import PositionTable from './Pages/positions/PositionTable';
import PositionDetails from './Pages/positions/PositionDetails';
import AllComplaint from './Dashboard/EmployeeDashboard/Complaint/AllComplaint';
import ComplaintForm from "./Dashboard/EmployeeDashboard/Complaint/ComplaintForm"
import AllLeaves from "./Dashboard/EmployeeDashboard/Leave/AllLeaves";
import LeaveForm from "./Dashboard/EmployeeDashboard/Leave/LeaveForm"
import updatepassword from "../src/Components/UpdatePassword/UpdatePassword"
import PasswordUpdate from '../src/Components/UpdatePassword/UpdatePassword';
export default function App() {
  return (
    
    <Routes>
      
      {/* Public Routes */}
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/public/jobs" element={<PublicJobs />} />
      
      <Route path="/public/jobs/:id" element={<SinglePublicJob />} />

      {/* Protected Routes */}
      <Route element={<DashboardLayout />}>
        
        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
        />

        {/* HR Dashboard */}
        <Route
          path="/hr-dashboard"
          element={<ProtectedRoute element={<HRDashboard />} requiredRole="hr" />}
        />
        {/* Employee Dashboard */}
        <Route
        path='/employee-dashboard'
        element ={<ProtectedRoute element={<EmployeeDashboard/>} requiredRole="employee"/>}
        
        />
        
        {/* HR Management */}
        <Route
          path="/admin/hr-register"
          element={<ProtectedRoute element={<HR_register />} requiredRole="admin" />}
        />

        <Route
          path="/admin/all-hr"
          element={<ProtectedRoute element={<AllHR />} requiredRole="admin" />}
        />

        {/* Compensation Management */}
        <Route
          path="/admin/all-compensation"
          element={<ProtectedRoute element={<Compensation />}  />}
        />
        <Route
          path="/admin/add-compensation"
          element={<ProtectedRoute element={<AddCompensation />}  />}
        />

        {/* Department Management */}
        <Route
          path="/admin/departments"
          element={<ProtectedRoute element={<Departments />}  />}
        />
        <Route
          path="/admin/all-departments"
          element={<ProtectedRoute element={<AllDepartments />}  />}
        />

        {/* Performance Management */}
        <Route
          path="/admin/add-performance"
          element={<ProtectedRoute element={<AddPerformance />}  />}
        />
        <Route
          path="/admin/performance"
          element={<ProtectedRoute element={<Performance />} />}
        />

        {/* Job History Management */}
        <Route
          path="/admin/add-job-history"
          element={<ProtectedRoute element={<AddJobHistory />}  />}
        />
        <Route
          path="/admin/all-job-history"
          element={<ProtectedRoute element={<AllHistory />}  />}
        />

        {/* Employee Management */}
        <Route
          path="/employees"
          element={<ProtectedRoute element={<AllEmploys />} />}
        />
        <Route
          path="/employee/:id"
          element={<ProtectedRoute element={<SingleEmployee />} />}
        />
        <Route
          path="/register/employee"
          element={<ProtectedRoute element={<EmployeeForm />}  />}
        />
        <Route
          path="/employee/update/:id"
          element={<ProtectedRoute element={<UpdateEmployeeForm />}  />}
        />
        <Route
          path="/employee/delete/:id"
          element={<ProtectedRoute element={<DeleteEmployee />}  />}
        />

        {/* Job Management */}
        <Route
          path="/jobs"
          element={<ProtectedRoute element={<AllJobs />}  />}
        />
        <Route
          path="/job/:id"
          element={<ProtectedRoute element={<SingleJob />}  />}
        />
        <Route
          path="/job/update/:id"
          element={<ProtectedRoute element={<UpdateJob />}  />}
        />
        <Route
          path="/job/delete/:id"
          element={<ProtectedRoute element={<DeleteJob />}  />}
        />
        <Route
          path="/post/job"
          element={<ProtectedRoute element={<PostJob />}  />}
        />

        {/* Attendance Management */}
        <Route
          path="/post/attendance"
          element={<ProtectedRoute element={<AttendanceForm />}  />}
        />
        <Route
          path="/attendance"
          element={<ProtectedRoute element={<Attendance />} />}
        />

        {/* Applications */}
        <Route
          path="/job/application/:id"
          element={<ProtectedRoute element={<ApplicationForm />} />}
        />
        <Route
          path="/all/applications"
          element={<ProtectedRoute element={<AllApplications />}  />}
        />
        <Route
          path="/job/application/update/:id"
          element={<ProtectedRoute element={<UpdateApplicationForm />} />}
        />

        {/* Position Management */}
        <Route
          path="/positions"
          element={<ProtectedRoute element={<PositionTable />} />}
        />
        <Route
          path="/assign/position"
          element={<ProtectedRoute element={<PositionAssignmentForm />}  />}
        />
        <Route
          path="/position-details"
          element={<ProtectedRoute element={<PositionDetails />}  />}
        />
    
    
      <Route path="/AllComplaint" 
      element={<ProtectedRoute element={<AllComplaint />} />}/>
       
       
      
      <Route path="/AllLeaves" 
      element={<ProtectedRoute element={<AllLeaves />} />} />
       </Route>
       <Route path="/ComplaintForm" 
      element={<ProtectedRoute element={<ComplaintForm />} requiredRole="employee" />}/>
     
      <Route path="/LeaveForm" 
      element={<ProtectedRoute element={<LeaveForm />}  requiredRole="employee"/>}/>
       <Route path="/updatepasswor" element={<PasswordUpdate />} />
       

      </Routes>
   

   
  );
}
