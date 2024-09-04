import { useContext, useEffect, useState } from 'react'
import ExamenStudentListTeacher from '../../components/teacher/ExamenStudentListTeacher'
import Button from '../../components/ui/Button'
import Popup from '../../components/ui/Popup'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import { AuthContext } from '../../context'
import { useNavigate } from 'react-router-dom'

const ExamenTeacher = () => {
    const { employeeId } = useContext(AuthContext)
    const [modalActive, setModalActive] = useState(false)
    const [students, setStudents] = useState([])
    const { id } = useParams()
    const data = useLocation()
    const { course, group, deptName, examenName } = data.state

    const [getStudents, isStudentLoading, studentErr] = useFetching(async (examenId) => {
        const response = await ExamenService.getStudentsByExamenIdForChecking(examenId)

        if (response.status == 200) {
            setStudents(response.data)
        }
    })

    useEffect(() => {
        getStudents(id)
    }, [])

    const redirect = useNavigate()

    const [endExamenForTeacher, isEndLoading, endExamenError] = useFetching(async (examenId) => {
        const response = await ExamenService.endExamenForEmployee(examenId)

        if (response.status == 200) {
            alert("Экзамен успешно завершен")
            redirect(`/teacher/examen-results/${id}`, {
                state: { course: course, group: group, deptName: deptName, examenName: examenName  }
            })
        }
    })

    return (
        <section className='examen-teacher'>
            <div className="examen-teacher__container container container--smaller">      
                <div className='back-link'>
                    <Link to={`/teacher/examens/${employeeId}`}>
                        <svg width="187" height="55" viewBox="0 0 187 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.7451 5.9399C11.3153 2.6184 14.6599 0.5 18.3338 0.5H177C182.247 0.5 186.5 4.7533 186.5 10V45C186.5 50.2467 182.247 54.5 177 54.5H18.3338C14.6599 54.5 11.3153 52.3816 9.7451 49.0601L1.47238 31.5601C0.257292 28.9897 0.257292 26.0103 1.47238 23.4399L5.95204 13.9637L9.7451 5.9399Z" stroke="#0050CF" />
                        </svg>
                        <span className="back-link__text">Экзамены</span>
                    </Link>
                </div>
                <div className="examen-teacher__body">
                    <h1 className='examen-teacher__title title'>{examenName}</h1>
                    <div className="examen-teacher__data data">
                        <span className='data__stage'>{`${course} курс ${group} группа`}</span>
                        <span className='data__department'>{deptName}</span>
                    </div>
                    {isStudentLoading ? <div>Загрузка студентов...</div> : <ExamenStudentListTeacher deptName={deptName} students={students} />}
                    <Button onClick={() => setModalActive(true)}>Закончить экзамен</Button>
                    <Popup active={modalActive} setActive={setModalActive}>
                        <h2 className="popup__title title">Вы действительно хотите завершить экзамен?</h2>
                        <div className="confirm-buttons">
                            <Button onClick={() => endExamenForTeacher(id)} className={`confirm-button confirm-button--yes${isEndLoading ? ' loading' : ''}`}><span>Да</span></Button>
                            <Button className="confirm-button confirm-button--no" onClick={() => setModalActive(false)}>Нет</Button>
                        </div>
                    </Popup>
                </div>    
            </div>
        </section>
    )
}

export default ExamenTeacher