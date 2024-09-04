import { useState, useEffect, useContext } from "react";
import ExamensListUko from '../../components/uko/ExamensListUko'
import { useFetching } from "../../hooks/useFetching";
import ExamenService from "../../api/ExamenService";
import { AuthContext } from "../../context";
import { Link } from "react-router-dom";

const ArchiveTeacher = () => {
    const { employeeId } = useContext(AuthContext)
    const [archivedExamens, setArchivedExamens] = useState(null)
    const [getExamensFromArchive, isArchiveLoading, archiveErr] = useFetching(async (employeeId) => {
        const response = await ExamenService.getExamensFromArchiveByAuditoriumId(employeeId)
        if (response.status == 200) {
            setArchivedExamens(response.data)
        }
    })

    useEffect(() => {
        getExamensFromArchive(employeeId)
    }, [])

    return (
        <section className='archive'>
            <div className="archive__container container">
                <div className='back-link'>
                    <Link to={-1}>
                        <svg width="187" height="55" viewBox="0 0 187 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.7451 5.9399C11.3153 2.6184 14.6599 0.5 18.3338 0.5H177C182.247 0.5 186.5 4.7533 186.5 10V45C186.5 50.2467 182.247 54.5 177 54.5H18.3338C14.6599 54.5 11.3153 52.3816 9.7451 49.0601L1.47238 31.5601C0.257292 28.9897 0.257292 26.0103 1.47238 23.4399L5.95204 13.9637L9.7451 5.9399Z" stroke="#0050CF" />
                        </svg>
                        <span className="back-link__text">Назад</span>
                    </Link>
                </div>
                <h2 className="archive__title title">Архив</h2>
                <div className="archive__examens examens">
                    {
                        isArchiveLoading ? <div>Загрузка данных...</div>
                            :
                            archivedExamens?.length > 0
                                ?
                                <ExamensListUko examens={archivedExamens} />
                                :
                                <div>Нет данных!</div>
                    }
                </div>
            </div>
        </section>
    )
}

export default ArchiveTeacher