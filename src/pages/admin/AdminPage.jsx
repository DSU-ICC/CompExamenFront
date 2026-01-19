import { useState, useEffect } from 'react'
import Popup from '../../components/ui/Popup'
import Button from '../../components/ui/Button'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import Select from '../../components/ui/Select'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate, parsingDate } from '../../utils/date'
import { Controller, useForm } from 'react-hook-form';
import DatePicker from '../../components/ui/DatePicker'
import Input from '../../components/ui/Input'
import AnswerBlankService from '../../api/AnswerBlankService'
import { components } from "react-select"
import DsuService from '../../api/DsuService'


const AdminPage = () => {
  const redirect = useNavigate()

  const [filials, setFilials] = useState([])
  const [examensForSelect, setExamensForSelect] = useState([])
  const [filteredExamensForSelect, setFilteredExamensForSelect] = useState([])
  const [modalEditActive, setModalEditActive] = useState(false)
  const [modalDeleteActive, setModalDeleteActive] = useState(false)
  const [modalDeleteConfirmActive, setModalDeleteConfirmActive] = useState(false)
  const [modalCopyActive, setModalCopyActive] = useState(false)
  const [modalResetForStudentActive, setModalResetForStudentActive] = useState(false)
  const [modalResetStudentConfirmActive, setModalResetStudentConfirmActive] = useState(false)
  const [modalResetForTeacherActive, setModalResetForTeacherActive] = useState(false)
  const [modalResetTeacherConfirmActive, setModalResetTeacherConfirmActive] = useState(false)
  const [examenId, setExamenId] = useState(null)
  const [studentsForSelect, setStudentsForSelect] = useState([])
  const [copyExamenDate, setCopyExamenDate] = useState(new Date())

  const [getFilials, isFilialsLoading] = useFetching(async () => {
    const response = await DsuService.getFilials()
    if (response.status == 200) {
      const filials = response.data.map(f => ({
        label: f.filial,
        value: f.filId
      }))
      setFilials(filials)
    } 
  })

  const [getExamens, isExamensLoading] = useFetching(async () => {
    const response = await ExamenService.getExamens()
    if (response.status == 200) {
      const dataArr = []
      response.data
        .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
        .forEach(dataItem => {
          const filialName = filials?.find(x => x.value == dataItem.filialId)?.label
          dataArr.push({
            value: dataItem.id,
            label: dataItem.discipline,
            filialId: dataItem.filialId,
            examDate: dataItem.examDate,
            title: `Филиал - ${filialName}\r\nДата проведения: ${formatDate(new Date(dataItem.examDate))}\r\nКурс: ${dataItem.course}\r\nГруппа: ${dataItem.nGroup}`
          })
      })
      setExamensForSelect(dataArr)
      setFilteredExamensForSelect(dataArr)
    }
  })

  useEffect(() => {
    getFilials()
  }, [])

  useEffect(() => {
    if (filials.length != 0) {
      getExamens()
    }
  }, [filials])

  const [deleteExamen, isDeleteLoading, deleteError] = useFetching(async (examenId) => {
    const response = await ExamenService.deleteExamen(examenId)
    if (response.status == 200 || deleteError) {
      console.log(deleteError)
      alert("Экзамен успешно удален!")
      setExamensForSelect(examensForSelect.filter(e => e.examenId != examenId))
      setFilteredExamensForSelect(examensForSelect.filter(e => e.examenId != examenId))
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
            value: dataItem.answerBlank.id,
            label: `${dataItem.lastName} ${dataItem.firstName} ${dataItem.patr}`
          })
        }
      })

      setStudentsForSelect(dataArr)
    }
  })

  const [resetExamenForStudent, isResetStudentLoading, resetStudentErr] = useFetching(async (answerBlankId, isRemoveAnswerBlank, additionalTimeInMinutes) => {
    const response = await AnswerBlankService.resetExamenForStudent(answerBlankId, isRemoveAnswerBlank, additionalTimeInMinutes)
    if (response.status == 200) {
      alert("Сброс экзамена студенту успешно завершен")
      setModalResetStudentConfirmActive(false)
      setExamenId(null)
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
    redirect('/admin/edit-examen', {
      state: examensForSelect.find(e => e.value == examenId)
    })
  }

  const handleDeleteExamen = () => {
    setModalDeleteActive(false)
    setModalDeleteConfirmActive(true)
  }

  const onCopyExamen = (data) => {
    const examDate = data.copyExamDate
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
    const { answerBlankId, isRemoveAnswerBlank, additionalTimeInMinutes } = getResetExamenForStudentData()
    resetExamenForStudent(answerBlankId, isRemoveAnswerBlank, parseInt(additionalTimeInMinutes) || null)
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
    mode: "onSubmit",
    defaultValues: {
      copyExamDate: new Date()
    }
  })

  const { control: controlResetExamenForStudent, reset: resetExamenFormForResetStudent, handleSubmit: handleSubmitResetExamenForStudent, getValues: getResetExamenForStudentData } = useForm({
    mode: "onSubmit",
    defaultValues: {
      additionalTimeInMinutes: null,
      isRemoveAnswerBlank: false
    }
  })

  const { control: controlResetExamen, reset: resetExamenForForResetTeacher, handleSubmit: handleSubmitResetExamen, getValues: getResetExamenForTeacherData } = useForm({
    mode: "onSubmit"
  })

  const CustomOption = (props) => {
    return (
      <components.Option {...props}>
        <div title={props.data.title}>
          {props.children}
        </div>
      </components.Option>
    );
  };

  const filterExamensForReset = () => {
    const { filialId, examDate } = getResetExamenForStudentData()
    if (filialId) {
      setFilteredExamensForSelect(prev => prev.filter(x => x.filialId == filialId))
    } else {
      setFilteredExamensForSelect(examensForSelect)
    }

    if (examDate) {
      setFilteredExamensForSelect(prev => 
        prev
          .filter(x => new Date(x.examDate).toLocaleDateString() == examDate.toLocaleDateString())
          .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
      )
    } else {
      setFilteredExamensForSelect(examensForSelect)
    }
  }

  const filterExamensForResetTeacher = () => {
    const { filialId, examDate } = getResetExamenForTeacherData()
    if (filialId) {
      setFilteredExamensForSelect(prev => prev.filter(x => x.filialId == filialId))
    } else {
      setFilteredExamensForSelect(examensForSelect)
    }

    if (examDate) {
      setFilteredExamensForSelect(prev => 
        prev
          .filter(x => new Date(x.examDate).toLocaleDateString() == examDate.toLocaleDateString())
          .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
      )
    } else {
      setFilteredExamensForSelect(examensForSelect)
    }
  }

  const onCloseResetExamenForStudent = () => {
    setExamenId(null)
    resetExamenFormForResetStudent()
    setFilteredExamensForSelect(examensForSelect)
    setModalResetForStudentActive(false)
  }

  const onCloseResetExamenForTeacher = () => {
    setExamenId(null)
    resetExamenForForResetTeacher() 
    setFilteredExamensForSelect(examensForSelect)
    setModalResetForTeacherActive(false)
  }

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
      <Popup active={modalEditActive} setActive={() => { setExamenId(null); setModalEditActive(false) }}>
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
                    components={{
                      Option: CustomOption
                    }}
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
                    components={{
                      Option: CustomOption
                    }}
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
      <Popup active={modalResetForStudentActive} setActive={onCloseResetExamenForStudent}>
        <h2 className="popup__title title">Сброс экзамена студенту</h2>
        <form className='form' style={{ marginBottom: 20 }} onSubmit={handleSubmitResetExamenForStudent(handleResetExamenForStudent)}>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Филиал</span>
            <Controller
              control={controlResetExamenForStudent}
              name='filialId'
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className={error ? 'error' : ''}>
                  <Select
                    value={value ? filials?.find(x => x.value == value) : null}
                    onChange={(newValue) => { onChange(newValue?.value); filterExamensForReset() }}
                    placeholder='Выберите филиал'
                    options={filials}
                    isLoading={isFilialsLoading}
                    isDisabled={isFilialsLoading}
                    isClearable={true}
                  />
                </div>
              )}
            />
          </label>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Дата</span>
            <Controller
              control={controlResetExamenForStudent}
              name='examDate'
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className={error ? 'error' : ''}>
                  <DatePicker
                    value={value}
                    onChange={(newValue) => { onChange(newValue); filterExamensForReset() }}
                    showTimeSelect={false}
                    isClearable={true}
                  />
                </div>
              )}
            />
          </label>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Экзамен</span>
            <Controller
              control={controlResetExamenForStudent}
              name='examenResetId'
              rules={{
                required: true
              }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className={error ? 'error' : ''}>
                  <Select
                    value={value ? filteredExamensForSelect?.find(x => x.value == value) : null}
                    onChange={(newValue) => { getStudentsByExamenId(newValue.value); onChange(newValue.value) }}
                    components={{
                      Option: CustomOption
                    }}
                    placeholder='Выберите экзамен'
                    options={filteredExamensForSelect}
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
              name='answerBlankId'
              rules={{
                required: true
              }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className={error ? 'error' : ''}>
                  <Select
                    value={value ? studentsForSelect?.find(x => x.value == value) : null}
                    onChange={(newValue) => onChange(newValue.value)}
                    placeholder='Выберите студента'
                    options={studentsForSelect}
                    isLoading={isStudentsLoading}
                    isDisabled={isStudentsLoading}
                  />
                </div>
              )}
            />
          </label>
          <label className='form__label'>
            <span className='form__text'>Дополнительное время в минутах</span>
            <Controller
              control={controlResetExamenForStudent}
              name='additionalTimeInMinutes'
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value || ""}
                  type="number"
                  onWheel={() => document.activeElement.blur()}
                  onInput={e => {
                    if (e.target.value.length > 3) {e.target.value = e.target.value.slice(0, 3)}
                  }}
                  className='form__input form__input--small'
                  onChange={(newValue) => onChange(newValue)}
                />
              )}
            />
          </label>
          <label className='form__label form__label_checkbox '>
            <span className='form__text'>Сбросить ответы ?</span>
            <Controller
              control={controlResetExamenForStudent}
              name="isRemoveAnswerBlank"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Input
                  checked={value}
                  type="checkbox"
                  className={`form__input ${error ? " error" : ""}`}
                  onChange={(newValue) => onChange(newValue.target.checked)}
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
      <Popup active={modalResetForTeacherActive} setActive={onCloseResetExamenForTeacher}>
        <h2 className="popup__title title">Сброс экзамена преподавателю</h2>
        <form className='form' style={{ marginBottom: 20 }} onSubmit={handleSubmitResetExamen(handleResetExamenForTeacher)}>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Филиал</span>
            <Controller
              control={controlResetExamen}
              name='filialId'
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className={error ? 'error' : ''}>
                  <Select
                    value={value ? filials?.find(x => x.value == value) : null}
                    onChange={(newValue) => { onChange(newValue?.value); filterExamensForResetTeacher() }}
                    placeholder='Выберите филиал'
                    options={filials}
                    isLoading={isFilialsLoading}
                    isDisabled={isFilialsLoading}
                    isClearable={true}
                  />
                </div>
              )}
            />
          </label>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Дата</span>
            <Controller
              control={controlResetExamen}
              name='examDate'
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className={error ? 'error' : ''}>
                  <DatePicker
                    value={value}
                    onChange={(newValue) => { onChange(newValue); filterExamensForResetTeacher() }}
                    showTimeSelect={false}
                    isClearable={true}
                  />
                </div>
              )}
            />
          </label>
          <label className='form__label' onClick={(evt) => evt.preventDefault()}>
            <span className='form__text'>Экзамен</span>
            <Controller
              control={controlResetExamen}
              name='examenResetTeacherId'
              rules={{
                required: true
              }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className={error ? 'error' : ''}>
                  <Select
                    value={value ? filteredExamensForSelect?.find(x => x.value == value) : null}
                    onChange={(newValue) => { setExamenId(newValue.value); onChange(newValue.value) }}
                    components={{
                      Option: CustomOption
                    }}
                    placeholder='Выберите экзамен'
                    options={filteredExamensForSelect}
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
                    components={{
                      Option: CustomOption
                    }}
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
              control={controlCopy}
              name='copyExamDate'
              render={({ field: { value, onChange }, fieldState: { errors } }) => (
                <div className={errors?.root?.message ? ' error' : ''}>
                  <DatePicker
                    value={value}
                    onChange={onChange}
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