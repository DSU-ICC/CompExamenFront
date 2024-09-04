import { useContext } from 'react'
import logo from '../assets/img/logo.svg'
import { AuthContext } from '../context'
import { Link, useHref } from 'react-router-dom'

const Header = () => {
    const {userName, setUserName, isAuthStudent, setIsAuthStudent, setEmployeeId, setIsAuthAdmin, setAccessToken } = useContext(AuthContext)
    const hrefPage = useHref()

    const logout = () => {
        if (isAuthStudent) {
            setIsAuthStudent(false)
        } else {
            setIsAuthAdmin(false)
            setAccessToken(null)
            setEmployeeId(null)
        }
        setUserName('')
        localStorage.clear()
        sessionStorage.clear()
    }

    const isAdminPage = () => {
       return hrefPage.includes("login")
    }

    const isLoginPage = () => {
        return ["/", "/login"].includes(hrefPage)
    }

    return (
        <header className="header">
            <div className="header__container container">
                <Link to="/" className="logo">
                    <img src={logo} alt="" />
                </Link>
                {
                    isLoginPage() &&
                        
                            <div className='nav'>
                        <Link to='/' className={`nav-link btn${!isAdminPage() ? ' active' : ''}`}>Студентам</Link>
                        <Link to='/login' className={`nav-link btn${isAdminPage() ? ' active' : ''}`}>Администратор</Link>
                    </div>
                }
                {
                    <div className="action">
                        <a id="specialVersion" href="#">
                            <svg viewBox="0 0 32 14.5" width="32pt" height="14.5pt">
                                <path d=" M 31.854 5.795 C 31.18 2.476 28.246 -0.023 24.727 -0.023 C 22.14 -0.023 19.868 1.329 18.579 3.365 C 17.826 3.028 17 2.886 16 2.886 C 15.002 2.886 14.175 3.029 13.422 3.366 C 12.133 1.33 9.861 -0.023 7.273 -0.023 C 3.755 -0.023 0.82 2.476 0.146 5.795 Q 0 6.447 0 7.25 Q 0 8.053 0.146 8.705 C 0.82 12.024 3.754 14.523 7.273 14.523 C 11.289 14.523 14.545 11.266 14.545 7.25 C 14.545 6.859 14.514 6.475 14.455 6.101 C 14.868 5.873 15.318 5.795 16 5.795 C 16.684 5.795 17.134 5.873 17.545 6.1 C 17.486 6.474 17.455 6.858 17.455 7.25 C 17.455 11.266 20.711 14.523 24.727 14.523 C 28.246 14.523 31.18 12.024 31.854 8.705 Q 32 8.053 32 7.25 Q 32 6.447 31.854 5.795 Z  M 7.273 11.614 C 4.863 11.614 2.909 9.66 2.909 7.25 C 2.909 4.84 4.863 2.886 7.273 2.886 C 9.682 2.886 11.636 4.84 11.636 7.25 C 11.636 9.66 9.682 11.614 7.273 11.614 Z  M 24.727 11.614 C 22.318 11.614 20.364 9.66 20.364 7.25 C 20.364 4.84 22.318 2.886 24.727 2.886 C 27.137 2.886 29.091 4.84 29.091 7.25 C 29.091 9.66 27.137 11.614 24.727 11.614 Z " fill="#0050cf">
                                </path>
                            </svg>
                        </a>
                        {
                            userName 
                                && 
                                <>
                                    <button type="button" onClick={() => {userName && logout()}} className={`action__btn${userName ? ' logout' : ''}`}></button>
                                    <div className="action__text">{userName}</div> 
                                </>
                        }
                    </div>
                }
                
            </div>
        </header>
    )
}

export default Header