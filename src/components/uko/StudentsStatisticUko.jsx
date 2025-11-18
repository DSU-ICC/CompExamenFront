import { formatDate } from "../../utils/date"

const StudentsStatisticUko = ({ scores }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ФИО</th>
          <th>Баллы за экзамен</th>
          <th>Дата начала экзамена</th>
          <th>Дата завершения экзамена</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((student) => (
          <tr>
            <td>{student.fio}</td>
            <td>{student.totalScore}</td>
            <td>{student.beginDate ? formatDate(new Date(student.beginDate)): "-"}</td>
            <td>{student.endDate ? formatDate(new Date(student.endDate)): "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default StudentsStatisticUko
