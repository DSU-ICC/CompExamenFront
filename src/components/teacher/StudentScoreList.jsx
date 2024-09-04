import { Link } from "react-router-dom"

const StudentScoreList = ({ scores, deptName }) => {
  return (
    <ul className='examen-results__list'>
        {
            scores.map(student => 
                <li key={student.studentId} className="examen-results__item result-item">
                    <p className="result-item__fio">{`${student.firstName} ${student.lastName} ${student.patr}`}</p>
                    <p className={`${!student.answerBlank?.totalScore ? " result-item__score--missing" : student.answerBlank.totalScore >= 51 ? "result-item__score result-item__score--success" : "result-item__score result-item__score--failed"}`}>
                        {student.answerBlank?.totalScore != null ? student.answerBlank.totalScore : "Не явился"}
                    </p>
                    { student.answerBlank?.totalScore != null && <Link to={'/teacher/student-answers'} className="btn" state={{...student, deptName: deptName}}>Посмотреть ответы</Link> }
                </li>
            )
        }
    </ul>
  )
}

export default StudentScoreList