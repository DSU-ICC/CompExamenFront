import {useContext} from 'react';
import {AuthContext} from "../context";
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useFetching } from '../hooks/useFetching';
import AuthService from '../api/AuthService';
import { Controller, useForm } from 'react-hook-form';


const LoginAdmin = () => {

    const {setIsAuthAdmin, setUserName, setEmployeeId, setAccessToken, setRoleName} = useContext(AuthContext);


    const redirect = useNavigate()

    const [authUser, isLoginLoading, loginError] = useFetching(async (loginUser, passwordUser) => {
        const response = await AuthService.login(loginUser, passwordUser)

        if (response.status == 200) {
            let userData = response.data
            setIsAuthAdmin(true)
            localStorage.setItem("isAuthAdmin", "true")

            localStorage.setItem("userName", userData.employee.name)
            setUserName(loginUser)

            localStorage.setItem("employeeId", userData.employee.id)
            setEmployeeId(userData.employee.id)

            localStorage.setItem("access_token", userData.access_token)
            setAccessToken(userData.access_token)

            const roleName = userData.employee.role.name
            localStorage.setItem("roleName", userData.employee.role.name)
            setRoleName(userData.employee.role.name)

            if (roleName == "auditorium") {
                redirect(`/teacher/examens/${userData.employee.id}`)
            } else if (roleName == "uko") {
                redirect(`/uko/${userData.employee.id}`)
            } else if (roleName == "admin") {
                redirect('/admin')
            }  
        }
    })

    const { control, handleSubmit } = useForm({
        mode: "onSubmit"
    })

    const login = (data) => {
        authUser(data.loginUser, data.passwordUser)
    }

    return (
        <section className='login'>
            <div className='container'>
                <div className='login__inner'>
                    <h1 className='login__title title'>Введите ваши данные</h1>
                    <form onSubmit={handleSubmit(login)} className='form'>
                        <label className='form__label'>
                            <span className='form__text'>Логин</span>
                            <Controller
                                control={control}
                                name='loginUser'
                                rules={{
                                    required: true
                                }}
                                render={({field: {onChange}, fieldState: { error }}) => (
                                    <Input 
                                        className={`form__input${error ? ' error' : ''}`}
                                        onChange={(newValue) => {onChange(newValue)}}
                                    />
                                )}
                            />    
                        </label>
                        <label className='form__label'>
                            <span className='form__text'>Пароль</span>
                            <Controller
                                control={control}
                                name='passwordUser'
                                rules={{
                                    required: true
                                }}
                                render={({field: {onChange}, fieldState: { error }}) => (
                                    <Input
                                        type="password" 
                                        className={`form__input${error ? ' error' : ''}`}
                                        onChange={(newValue) => {onChange(newValue)}}
                                    />
                                )}
                            />    
                        </label>
                        <Button className={`form__btn${isLoginLoading ? ' loading' : ''}`} disabled={isLoginLoading} >
                            <span>Войти</span>
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginAdmin;
