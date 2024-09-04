import {useContext, useState} from 'react';
import {AuthContext} from "../../context";
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useFetching } from '../../hooks/useFetching';
import AuthService from '../../api/AuthService';
import { Controller, useForm } from 'react-hook-form';


const LoginTeacher = () => {
    const {setIsAuthTeacher, setUserName, setEmployeeId} = useContext(AuthContext);

    const [loginUser, setLoginUser] = useState(null)
    const [passwordUser, setPasswordUser] = useState(null)

    const redirect = useNavigate()

    const [authUser, isLoginLoading, loginError] = useFetching(async (loginUser, passwordUser) => {
        const response = await AuthService.login(loginUser, passwordUser)

        if (response.status == 200) {
            let userData = response.data
            setIsAuthTeacher(true)
            localStorage.setItem("isAuthTeacher", "true")

            localStorage.setItem("userName", userData.userName)
            setUserName(loginUser)

            localStorage.setItem("employeeId", userData.id)
            setEmployeeId(userData.id)

            redirect(`/teacher/examens/${userData.id}`)
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
                                        onChange={(newValue) => {setLoginUser(newValue); onChange(newValue)}}
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
                                        onChange={(newValue) => {setPasswordUser(newValue); onChange(newValue)}}
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

export default LoginTeacher;
