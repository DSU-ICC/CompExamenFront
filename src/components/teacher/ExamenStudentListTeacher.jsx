import { Link } from "react-router-dom"


const ExamenStudentListTeacher = ({ students, deptName }) => {
  const getStudentExamenStatusClass = (student) => {
    if (student.answerBlank?.totalScore) {
      if (student.answerBlank?.totalScore > 50) {
        return 'examen-teacher__item--success'
      } else {
        return 'examen-teacher__item--failed'
      }
    } else if (student.answerBlank != null && student.answerBlank.endExamenDateTime != null) {
      return 'examen-teacher__item--no-checking'
    } else {
      return ''
    }
  }

  const getStudentNumber = (student) => {
    const statusClass = getStudentExamenStatusClass(student)
    
    if (statusClass == "examen-teacher__item--failed" || statusClass == "examen-teacher__item--success") {
      return student.answerBlank.totalScore
    } else {
      return student.studentId
    }
  } 

  return (
    <ul className='examen-teacher__list'>
      {
        students.map(student => 
          <li key={student.studentId} className={`examen-teacher__item ${getStudentExamenStatusClass(student)}`}>
            {
              getStudentExamenStatusClass(student) == "examen-teacher__item--no-checking"
                ? <Link to='/teacher/answers-check' state={{ ...student, deptName: deptName }} className='examen-teacher__item-link'>{student.studentId}</Link>
                : <div className="examen-teacher__item-link">{getStudentNumber(student)}</div>
            }
          </li>
        )
      }
    </ul>
  )
}

export default ExamenStudentListTeacher