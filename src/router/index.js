import Examen from "../pages/student/Examen";
import Examens from "../pages/student/Examens";
import LoginStudent from "../pages/LoginStudent";
import CreateExamenForm from "../pages/uko/CreateExamenForm";
import ListExamensTeacher from "../pages/teacher/ListExamensTeacher";
import LoginAdmin from "../pages/LoginAdmin";
import ExamenTeacher from "../pages/teacher/ExamenTeacher";
import CreateTicketsForm from "../pages/uko/CreateTicketsForm";
import ExamenResults from '../pages/teacher/ExamenResults'
import EditExamenForm from "../pages/uko/EditExamenForm";
import EditTicketsForm from "../pages/uko/EditTicketsForm";
import AnswersCheckTeacher from "../pages/teacher/AnswersCheckTeacher";
import StudentAnswers from "../pages/teacher/StudentAnswers"
import UkoPage from "../pages/uko/UkoPage";
import AdminPage from "../pages/admin/AdminPage";
import ExamenResultsUko from "../pages/uko/ExamenResultsUko";
import StudentAnswersUko from "../pages/uko/StudentAnswersUko";
import Archive from "../pages/uko/Archive";
import ArchiveTeacher from "../pages/teacher/ArchiveTeacher";

export const privateStudentRoutes = [
    {path: '/examens/:id', element: <Examens />, exact: true},
    {path: '/examen/:id', element: <Examen />, exact: true}
    
]

export const privateTeacherRoutes = [
    {path: '/teacher/examens/:id', element: <ListExamensTeacher />, exact: true},
    {path: '/teacher/examen/:id', element: <ExamenTeacher />, exact: true},
    {path: '/teacher/answers-check', element: <AnswersCheckTeacher />, exact: true},
    {path: '/teacher/examen-results/:id', element: <ExamenResults />, exact: true},
    {path: '/teacher/student-answers', element: <StudentAnswers />, exact: true},
    {path: '/teacher/archive', element: <ArchiveTeacher />, exact: true}
]

export const privateUkoRoutes = [
    {path: '/uko/:id', element: <UkoPage />, exact: true},
    {path: '/uko/create-examen', element: <CreateExamenForm />, exact: true},
    {path: '/uko/create-tickets', element: <CreateTicketsForm />, exact: true},
    {path: '/uko/edit-examen', element: <EditExamenForm />, exact: true},
    {path: '/uko/edit-tickets', element: <EditTicketsForm />, exact: true},
    {path: '/uko/examen-results/:id', element: <ExamenResultsUko/>, exact: true},
    {path: '/uko/student-answers', element: <StudentAnswersUko />, exact: true},
    {path: '/uko/archive', element: <Archive />, exact: true}
]

export const privateAdminRoutes = [
    {path: '/admin', element: <AdminPage />, exact: true},
    {path: '/admin/create-examen', element: <CreateExamenForm />, exact: true},
    {path: '/admin/create-tickets', element: <CreateTicketsForm />, exact: true},
    {path: '/admin/edit-examen', element: <EditExamenForm />, exact: true},
    {path: '/admin/edit-tickets', element: <EditTicketsForm />, exact: true}
]

export const publicRoutes = [
    {path: '/', element: <LoginStudent />, exact: true},
    {path: '/login', element: <LoginAdmin />, exact: true}
]