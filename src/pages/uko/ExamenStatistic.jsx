import { Link, useParams } from "react-router-dom"
import StudentsStatisticUko from "../../components/uko/StudentsStatisticUko"
import { useFetching } from "../../hooks/useFetching"
import ExamenService from "../../api/ExamenService"
import { useEffect, useState } from "react"

const ExamenStatistic = () => {
  const params = useParams()
  const examenId = params.id

  const [studentsForStatistic, setStudentsForStatistic] = useState({})
  const [getStatisticForExamFromArchive, isStatisticLoading] = useFetching(async (examenId) => {
      const response = await ExamenService.getStatisticForExamFromArchive(examenId)
      if (response.status == 200) {
        setStudentsForStatistic(response.data)
      }
    }
  )

  useEffect(() => {
    getStatisticForExamFromArchive(examenId)
  }, [])

  return (
    <div className="examen-results">
      <div className="examen-results__container container container--smaller">
        <div className="back-link">
          <Link to={-1}>
            <svg
              width="187"
              height="55"
              viewBox="0 0 187 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.7451 5.9399C11.3153 2.6184 14.6599 0.5 18.3338 0.5H177C182.247 0.5 186.5 4.7533 186.5 10V45C186.5 50.2467 182.247 54.5 177 54.5H18.3338C14.6599 54.5 11.3153 52.3816 9.7451 49.0601L1.47238 31.5601C0.257292 28.9897 0.257292 26.0103 1.47238 23.4399L5.95204 13.9637L9.7451 5.9399Z"
                stroke="#0050CF"
              />
            </svg>
            <span className="back-link__text">Экзамены</span>
          </Link>
        </div>
        {isStatisticLoading ? (
          <div className="loader">Идет загрузка...</div>
        ) : (
          <div className="examen-results__body">
            <h1 className="examen-results__title title">{studentsForStatistic?.discipline}</h1>
            <div className="examen-results__data data">
              <span className="data__stage">{`${studentsForStatistic?.course} курс ${studentsForStatistic?.nGroup} группа`}</span>
              <span className="data__department">{studentsForStatistic?.department}</span>
            </div>
            {studentsForStatistic?.statisticsStudentForPrints?.length > 0 ? (
              <StudentsStatisticUko scores={studentsForStatistic?.statisticsStudentForPrints} />
            ) : (
              <div>Нет данных!</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExamenStatistic
