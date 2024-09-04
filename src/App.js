import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import {AuthContext} from "./context";
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import { Toast } from 'primereact/toast';

const App = () => {
  const [isAuthStudent, setIsAuthStudent] = useState(false);
  const [isAuthAdmin, setIsAuthAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [studentId, setStudentId] = useState(null)
  const [employeeId, setEmployeeId] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(null)
  const [roleName, setRoleName] = useState(null)
  const toastRef = useRef(null)

  const showToast = (type, summary, detail) => {
    toastRef.current.show({ severity: type, summary: summary, detail: detail, life: 6000 });
  };

  useEffect(() => {
    document.title = "Компьютерный экзамен ДГУ"
    if (localStorage.getItem('isAuthStudent')) {
      setIsAuthStudent(true)
      setUserName(localStorage.getItem('userName'))
      setStudentId(localStorage.getItem('studentId'))
    } else if (localStorage.getItem('isAuthAdmin')) {
      setIsAuthAdmin(true)
      setUserName(localStorage.getItem('userName'))
      setEmployeeId(localStorage.getItem('employeeId'))
      setAccessToken(localStorage.getItem("access_token"))
      setRoleName(localStorage.getItem("roleName"))
    }
    setLoading(false);
  }, [])

  return (
    !isLoading
      &&
      <AuthContext.Provider value={{
        isAuthStudent,
        setIsAuthStudent,
        isAuthAdmin,
        setIsAuthAdmin,
        userName,
        setUserName,
        isLoading,
        studentId,
        setStudentId,
        employeeId,
        setEmployeeId,
        accessToken,
        setAccessToken,
        roleName,
        setRoleName,
        showToast
      }}>
        <BrowserRouter>
          <div className="site-wrapper">
            <Header />
            <main>
              <Toast ref={toastRef} />
              <AppRouter />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthContext.Provider>
  )
}

export default App