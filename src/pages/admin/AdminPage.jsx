import { useState, useEffect } from 'react'
import Popup from '../../components/ui/Popup'
import Button from '../../components/ui/Button'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import Select from '../../components/ui/Select'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { parsingDate } from '../../utils/date'
import { Controller, useForm } from 'react-hook-form';
import DatePicker from '../../components/ui/DatePicker'
import Input from '../../components/ui/Input'
import AnswerBlankService from '../../api/AnswerBlankService'


const AdminPage = () => {
  const redirect = useNavigate()

  const [examens, setExamens] = useState([])
  const [examensForSelect, setExamensForSelect] = useState([])
  const [modalEditActive, setModalEditActive] = useState(false)
  const [modalDeleteActive, setModalDeleteActive] = useState(false)
  const [modalDeleteConfirmActive, setModalDeleteConfirmActive] = useState(false)
  const [modalCopyActive, setModalCopyActive] = useState(false)
  const [modalResetForStudentActive, setModalResetForStudentActive] = useState(false)
  const [modalResetStudentConfirmActive, setModalResetStudentConfirmActive] = useState(false)
  const [modalResetForTeacherActive, setModalResetForTeacherActive] = useState(false)
  const [modalResetTeacherConfirmActive, setModalResetTeacherConfirmActive] = useState(false)
  const [examenId, setExamenId] = useState(null)
  const [students, setStudents] = useState([])
  const [studentsForSelect, setStudentsForSelect] = useState([])
  const [studentId, setStudentId] = useState(null)
  const [isRemoveAnswerBlank, setIsRemoveAnswerBlank] = useState(false)
  const [copyExamenDate, setCopyExamenDate] = useState(new Date())

  const [getExamens, isExamensLoading, examError] = useFetching(async () => {
    const response = await ExamenService.getExamens()

    if (response.status == 200) {
      setExamens(response.data)

      const dataArr = []
      response.data.forEach(dataItem => {
        dataArr.push({
          value: dataItem.id,
          label: dataItem.discipline
        })
      })
      setExamensForSelect(dataArr)
    }
  })

  useEffect(() => {
    getExamens()
  }, [])

  const [deleteExamen, isDeleteLoading, deleteError] = useFetching(async (examenId) => {
    const response = await ExamenService.deleteExamen(examenId)
    if (response.status == 200 || deleteError) {
      console.log(deleteError)
      alert("Экзамен успешно удален!")
      setExamens(examens.filter(e => e.examenId != examenId))
      setModalDeleteConfirmActive(false)
      setExamenId(null)
    }
  })

  const [copyExamen, isCopyLoading, copyError] = useFetching(async (examenId, newDateExamen) => {
    const response = await ExamenService.copyExamen(examenId, newDateExamen)

    if (response.status == 200) {
      alert("Пересдача успешно создана!")
      setCopyExamenDate(new Date())
      setExamenId(null)
      setModalCopyActive(false)
    }
  })

  const [getStudentsByExamenId, isStudentsLoading, studentsErr] = useFetching(async (examenId) => {
    const response = await ExamenService.getStudentsByExamenId(examenId)
    if (response.status == 200) {
        const dataArr = []
        response.data.forEach(dataItem => {
            if (dataItem.answerBlank != null && dataItem.answerBlank.isDeleted != true) {
                dataArr.push({
                    value: dataItem.studentId,
                    label: `${dataItem.lastName} ${dataItem.firstName} ${dataItem.patr}`
                })
            }
        })
        
        setStudents(response.data)
        setStudentsForSelect(dataArr)
    }
  })

  const [resetExamenForStudent, isResetStudentLoading, resetStudentErr] = useFetching(async (answerBlankId, isRemoveAnswerBlank) => {
    const response = await AnswerBlankService.resetExamenForStudent(answerBlankId, isRemoveAnswerBlank)
    if (response.status == 200) {
        alert("Сброс экзамена студенту успешно завершен")
        setModalResetStudentConfirmActive(false)
        setExamenId(null)
        setStudentId(null)
        setIsRemoveAnswerBlank(false)
    }
  })

  const [resetExamenForTacher, isResetTeacherLoading, resetTeacherErr] = useFetching(async (examenId) => {
    const response = await ExamenService.resetExamenForTeacher(examenId)
    if (response.status == 200) {
        alert("Сброс экзамена преподавателю успешно завершен")
        setModalResetTeacherConfirmActive(false)
        setExamenId(null)
    }
  })

  const handleEditExamen = () => {
    redirect('/uko/edit-examen', {
      state: examens.find(e => e.examenId == examenId)
    })
  }

  const handleDeleteExamen = () => {
    setModalDeleteActive(false)
    setModalDeleteConfirmActive(true)
  }

  const onCopyExamen = () => {
    let dateInput = document.querySelector(".datepicker")
    const examDate = parsingDate(dateInput.value)
    copyExamen(examenId, examDate)
  }

  const handleResetExamenForStudent = () => {
    setModalResetForStudentActive(false)
    setModalResetStudentConfirmActive(true)
  }

  const handleResetExamenForTeacher = () => {
    setModalResetForTeacherActive(false)
    setModalResetTeacherConfirmActive(true)
  }

  const onResetExamenForStudent = () => {
    const student = students.find(s => s.studentId == studentId)
    const studentAnswerBlankId = student.answerBlank.id
    resetExamenForStudent(studentAnswerBlankId, isRemoveAnswerBlank)
  }

  const onResetExamenForTeacher = () => {
    resetExamenForTacher(examenId)
  }

  const { control, handleSubmit } = useForm({
    mode: "onSubmit"
  })

  const { control: controlDelete, handleSubmit: handleSubmitDelete } = useForm({
    mode: "onSubmit"
  })

  const { control: controlCopy, handleSubmit: handleSubmitCopy } = useForm({
    mode: "onSubmit"
  })

  const { control: controlResetExamenForStudent, handleSubmit: handleSubmitResetExamenForStudent } = useForm({
    mode: "onSubmit"
  })

  const { control: controlResetExamen, handleSubmit: handleSubmitResetExamen } = useForm({
    mode: "onSubmit"
  })

  return (
    <>
      <div className="container">
        <div className="examen-actions">
          <Link to={'/admin/create-examen'} className='examens-teacher__btn btn'>Создать экзамен</Link>
          <Button onClick={() => setModalEditActive(true)} className='edit-examen btn'>Изменить экзамен</Button>
          <Button onClick={() => setModalDeleteActive(true)} className='delete-examen'>Удалить экзамен</Button>
          <Button onClick={() => setModalCopyActive(true)}>Создать пересдачу</Button>
          <Button onClick={() => setModalResetForStudentActive(true)}>Сбросить экзамен студенту</Button>
          <Button onClick={() => setModalResetForTeacherActive(true)}>Сбросить экзамен преподавателю</Button>
        </div>
      </div>
      <Popup active={modalEditActive} setActive={() => {setExamenId(null); setModalEditActive(false)}}>
        <h2 className="popup__title title">Изменение экзамена</h2>
        <form className='form' style={{ marginBottom: 20 }} onSubmit={handleSubmit(handleEditExamen)}>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Экзамен</span>
            <Controller
              control={control}
              name='examenEditId'
              rules={{
                required: true
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={error ? 'error' : ''}>
                      <Select 
                        onChange={(newValue) => { setExamenId(newValue.value); onChange(newValue.value) }}
                        placeholder='Выберите экзамен'
                        options={examensForSelect}
                        isLoading={isExamensLoading}
                        isDisabled={isExamensLoading}
                      />
                  </div>
              )}
            />
          </label>
          <Button><span>Далее</span></Button>
        </form>
      </Popup>
      <Popup active={modalDeleteActive} setActive={setModalDeleteActive}>
        <h2 className="popup__title title">Удаление экзамена</h2>
        <form className='form' style={{ marginBottom: 20 }} onSubmit={handleSubmitDelete(handleDeleteExamen)}>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Экзамен</span>
            <Controller
              control={controlDelete}
              name='examenDeleteId'
              rules={{
                required: true
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={error ? 'error' : ''}>
                      <Select 
                        onChange={(newValue) => { setExamenId(newValue.value); onChange(newValue.value) }}
                        placeholder='Выберите экзамен'
                        options={examensForSelect}
                        isLoading={isExamensLoading}
                        isDisabled={isExamensLoading}
                      />
                  </div>
              )}
            />
          </label>
          <Button className="delete-examen"><span>Удалить</span></Button>
        </form>
      </Popup>
      <Popup active={modalDeleteConfirmActive} setActive={setModalDeleteConfirmActive}>
        <h2 className="popup__title title">Вы действительно хотите удалить экзамен?</h2>
        <div className="confirm-buttons">
          <Button onClick={() => deleteExamen(examenId)} className={`confirm-button confirm-button--yes${isDeleteLoading ? ' loading' : ''}`} disabled={isDeleteLoading} ><span>Да</span></Button>
          <Button className="confirm-button confirm-button--no" onClick={() => setModalDeleteConfirmActive(false)}>Нет</Button>
        </div>
      </Popup>
      <Popup active={modalResetForStudentActive} setActive={() => { setExamenId(null); setModalResetForStudentActive(false)}}>
        <h2 className="popup__title title">Сброс экзамена студенту</h2>
        <form className='form' style={{ marginBottom: 20 }} onSubmit={handleSubmitResetExamenForStudent(handleResetExamenForStudent)}>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Экзамен</span>
            <Controller
              control={controlResetExamenForStudent}
              name='examenResetId'
              rules={{
                required: true
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={error ? 'error' : ''}>
                      <Select 
                        onChange={(newValue) => { setExamenId(newValue.value); getStudentsByExamenId(newValue.value); onChange(newValue.value) }}
                        placeholder='Выберите экзамен'
                        options={examensForSelect}
                        isLoading={isExamensLoading}
                        isDisabled={isExamensLoading}
                      />
                  </div>
              )}
            />
          </label>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Студент</span>
            <Controller
              control={controlResetExamenForStudent}
              name='studentId'
              rules={{
                required: true
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={error ? 'error' : ''}>
                      <Select 
                        onChange={(newValue) => { setStudentId(newValue.value); onChange(newValue.value) }}
                        placeholder='Выберите студента'
                        options={studentsForSelect}
                        isLoading={isStudentsLoading}
                        isDisabled={isStudentsLoading}
                      />
                  </div>
              )}
            />
          </label>
          <label className='form__label form__label_checkbox '>
            <span className='form__text'>Сбросить ответы ?</span>
            <Controller
              control={controlResetExamenForStudent}
              name="isRemoveAnswerBlank"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <Input
                  value={isRemoveAnswerBlank}
                  type="checkbox"
                  className={`form__input ${error ? " error" : ""}`}
                  onChange={(newValue) => { setIsRemoveAnswerBlank(newValue.target.checked); onChange(newValue.target.checked) }}
                />
              )}
            />
          </label>
          <Button><span>Сбросить</span></Button>
        </form>
      </Popup>
      <Popup active={modalResetStudentConfirmActive} setActive={setModalResetStudentConfirmActive}>
        <h2 className="popup__title title">Вы действительно хотите сбросить экзамен студенту?</h2>
        <div className="confirm-buttons">
          <Button onClick={onResetExamenForStudent} className={`confirm-button confirm-button--yes${isResetStudentLoading ? ' loading' : ''}`} disabled={isResetStudentLoading} ><span>Да</span></Button>
          <Button className="confirm-button confirm-button--no" onClick={() => setModalResetStudentConfirmActive(false)}>Нет</Button>
        </div>
      </Popup>
      <Popup active={modalResetForTeacherActive} setActive={() => { setExamenId(null); setModalResetForTeacherActive(false)}}>
        <h2 className="popup__title title">Сброс экзамена преподавателю</h2>
        <form className='form' style={{ marginBottom: 20 }} onSubmit={handleSubmitResetExamen(handleResetExamenForTeacher)}>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Экзамен</span>
            <Controller
              control={controlResetExamen}
              name='examenResetTeacherId'
              rules={{
                required: true
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={error ? 'error' : ''}>
                      <Select 
                        onChange={(newValue) => { setExamenId(newValue.value); onChange(newValue.value) }}
                        placeholder='Выберите экзамен'
                        options={examensForSelect}
                        isLoading={isExamensLoading}
                        isDisabled={isExamensLoading}
                      />
                  </div>
              )}
            />
          </label>
          <Button><span>Сбросить</span></Button>
        </form>
      </Popup>
      <Popup active={modalResetTeacherConfirmActive} setActive={setModalResetTeacherConfirmActive}>
        <h2 className="popup__title title">Вы действительно хотите сбросить экзамен преподавателю?</h2>
        <div className="confirm-buttons">
          <Button onClick={onResetExamenForTeacher} className={`confirm-button confirm-button--yes${isResetTeacherLoading ? ' loading' : ''}`} disabled={isResetTeacherLoading} ><span>Да</span></Button>
          <Button className="confirm-button confirm-button--no" onClick={() => setModalResetTeacherConfirmActive(false)}>Нет</Button>
        </div>
      </Popup>
      <Popup active={modalCopyActive} setActive={setModalCopyActive}>
        <h2 className="popup__title title">Создание пересдачи экзамена</h2>
        <form className='form' style={{ marginBottom: 20 }} onSubmit={handleSubmitCopy(onCopyExamen)}>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Экзамен</span>
            <Controller
              control={controlCopy}
              name='examenCopyId'
              rules={{
                required: true
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={error ? 'error' : ''}>
                      <Select 
                        onChange={(newValue) => { setExamenId(newValue.value); onChange(newValue.value) }}
                        placeholder='Выберите экзамен'
                        options={examensForSelect}
                        isLoading={isExamensLoading}
                        isDisabled={isExamensLoading}
                      />
                  </div>
              )}
            />
          </label>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Дата</span>
            <Controller
              control={control}
              name='copyExamDate'
              render={({ field: { onChange }, fieldState: { errors } }) => (
                <div className={errors?.root?.message ? ' error' : ''}>
                  <DatePicker
                    selected={copyExamenDate}
                    onChange={(newDate) => onChange(newDate)}
                  />
                  <div>{errors ? errors.root?.message : ""}</div>
                </div>
              )}
            />
          </label>
          <Button className={`${isCopyLoading ? ' loading' : ''}`} disabled={isCopyLoading}><span>Создать</span></Button>
        </form>

      </Popup>
    </>
  )
}

export default AdminPage