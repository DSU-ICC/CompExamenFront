import {useContext} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {privateStudentRoutes, privateTeacherRoutes, privateAdminRoutes, privateUkoRoutes , publicRoutes} from '../router';
import {AuthContext} from '../context';

const AppRouter = () => {
    const {isAuthStudent, isAuthAdmin, studentId, employeeId, roleName } = useContext(AuthContext);
    return (
        isAuthStudent
            ?
            <Routes>
                {privateStudentRoutes.map(route =>
                    <Route
                        element={route.element}
                        path={route.path}
                        exact={route.exact}
                        key={route.path}
                    />
                )}
                <Route
                    element={<Navigate to={`/examens/${studentId}`} />}
                    path='*'
                    exact={true}
                />
            </Routes>
            :
        (isAuthAdmin && roleName == "auditorium")
            ?
            <Routes>
                {privateTeacherRoutes.map(route =>
                    <Route  
                        element={route.element}
                        path={route.path}
                        exact={route.exact}
                        key={route.path}
                    />
                )}
                <Route
                    element={<Navigate to={`/teacher/examens/${employeeId}`} />}
                    path='*'
                    exact={true}
                /> 
            </Routes>
            :
        (isAuthAdmin && roleName == "uko")
            ?
            <Routes>
                {privateUkoRoutes.map(route =>
                    <Route  
                        element={route.element}
                        path={route.path}
                        exact={route.exact}
                        key={route.path}
                    />
                )}
                <Route
                    element={<Navigate to={`/uko/${employeeId}`} />}
                    path='*'
                    exact={true}
                /> 
            </Routes>
            :
        (isAuthAdmin && roleName == "admin")
            ?
            <Routes>
                {privateAdminRoutes.map(route =>
                    <Route  
                        element={route.element}
                        path={route.path}
                        exact={route.exact}
                        key={route.path}
                    />
                )}
                <Route
                    element={<Navigate to={`/admin`} />}
                    path='*'
                    exact={true}
                /> 
            </Routes>
            :
            <Routes>
                {publicRoutes.map(route =>
                    <Route  
                        element={route.element}
                        path={route.path}
                        exact={route.exact}
                        key={route.path}
                    />
                )}
                <Route
                    element={<Navigate to='/' />}
                    path='*'
                    exact={true}
                />
            </Routes>
    );
};

export default AppRouter;
