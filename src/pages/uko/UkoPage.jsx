import { useState, useEffect, useReducer, useRef } from 'react'
import Popup from '../../components/ui/Popup'
import Button from '../../components/ui/Button'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import Select from '../../components/ui/Select'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatDate } from '../../utils/date'
import { Controller, useForm } from 'react-hook-form';
import DatePicker from '../../components/ui/DatePicker'
import ExamensListUko from '../../components/uko/ExamensListUko'
import DsuService from '../../api/DsuService'


const UkoPage = () => {
  const urlParans = useParams()
  const userId = urlParans.id

  const redirect = useNavigate()

  const [examens, setExamens] = useState([])
  const [examensWithFilter, setExamensWithFilter] = useState([])
  const [examensForSelect, setExamensForSelect] = useState([])
  const [modalEditActive, setModalEditActive] = useState(false)
  const [modalDeleteActive, setModalDeleteActive] = useState(false)
  const [modalDeleteConfirmActive, setModalDeleteConfirmActive] = useState(false)
  const [modalCopyActive, setModalCopyActive] = useState(false)
  const [examenId, setExamenId] = useState(null)
  const [copyExamenDate, setCopyExamenDate] = useState(new Date())

  const filialSelectForFilterRef = useRef(null)
  const facultySelectForFilterRef = useRef(null)
  const datePickerForFilterRef = useRef(null)
  const examenDeleteSelectRef = useRef(null)

  const [getExamensByEmployeeId, isExamensLoading, examError] = useFetching(async (userId) => {
    const response = await ExamenService.getExamensByEmployeeId(userId)

    if (response.status == 200) {
      setExamens(response.data)
      setExamensWithFilter(response.data)

      const dataArr = []
      response.data.forEach(dataItem => {
        dataArr.push({
          value: dataItem.examenId,
          label: dataItem.discipline
        })
      })
      setExamensForSelect(dataArr)
    }
  })

  useEffect(() => {
    getExamensByEmployeeId(userId)
  }, [])

  const [deleteExamen, isDeleteLoading, deleteError] = useFetching(async (examenId) => {
    const response = await ExamenService.deleteExamen(examenId)
    if (response.status == 200 || deleteError) {
      console.log(deleteError)
      alert("Экзамен успешно удален!")
      setExamens(examens.filter(e => e.examenId != examenId))
      setModalDeleteConfirmActive(false); 
      resetDelete(); 
      setExamenId(null); 
      setExamensForSelect(examensForSelect.filter(e => e.value != examenId))
      examenDeleteSelectRef.current.clearValue()
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

  const handleEditExamen = () => {
    redirect('/uko/edit-examen', {
      state: examens.find(e => e.examenId == examenId)
    })
  }

  const handleDeleteExamen = () => {
    setModalDeleteActive(false)
    setModalDeleteConfirmActive(true)
  }

  const datePickerCopyRef = useRef(null)

  const onCopyExamen = () => {
    const examDate = datePickerCopyRef.current.props.selected
    copyExamen(examenId, examDate)
  }

  const { control, handleSubmit } = useForm({
    mode: "onSubmit"
  })

  const { control: controlDelete, handleSubmit: handleSubmitDelete, reset: resetDelete } = useForm({
    mode: "onSubmit"
  })

  const { control: controlCopy, handleSubmit: handleSubmitCopy } = useForm({
    mode: "onSubmit"
  })

  const [filials, setFilials] = useState([])
  const [getFilials, isFilialsLoading, filError] = useFetching(async () => {
    const response = await DsuService.getFilials()
    const dataArr = []
    response.data.forEach(dataItem => {
        dataArr.push({
            value: dataItem.filId,
            label: dataItem.filial
        })
    })

    setFilials(dataArr)
  })

  const [faculties, setFaculties] = useState([])
  const [getFaculties, isFacultiesLoading, facError] = useFetching(async () => {
    const response = await DsuService.getFaculties()
    const dataArr = []
    response.data.forEach(dataItem => {
      dataArr.push({
        value: dataItem.facId,
        label: dataItem.facName
      })
    })

    setFaculties(dataArr)
  })

  useEffect(() => {
    getFilials()
    getFaculties()
}, [])

  const { control: controlFilter, handleSubmit: handleSubmitFilter, reset: resetFilterForm} = useForm({
    mode: "onSubmit",
  })
  
  const onExamenFilter = (data) => {
    data.examDate = formatDate(datePickerForFilterRef.current.props.selected).split(" ")[0] 
    setExamensWithFilter(examens.filter(e => ((e.filial == null && data.filialId == 1) || e.filial?.filId == data.filialId)
      && e.department.facId == data.facultyId 
      && formatDate(new Date(e.examDate)).includes(data.examDate))
    )
  }

  const resetFilter = (evt) => {
    resetFilterForm(); //Для сброса ошибок
    
    evt.preventDefault()
    filialSelectForFilterRef.current.clearValue()
    facultySelectForFilterRef.current.clearValue()
    datePickerForFilterRef.current.setSelected(new Date())
    setExamensWithFilter(examens)
  }

  return (
    <>
      <div className="container">
        <div className="examen-actions">
          <Link to={'/uko/create-examen'} className='examens-teacher__btn btn'>Создать экзамен</Link>
          <Button onClick={() => setModalEditActive(true)} className='edit-examen btn'>Изменить экзамен</Button>
          <Button onClick={() => setModalDeleteActive(true)} className='delete-examen'>Удалить экзамен</Button>
          <Button onClick={() => setModalCopyActive(true)}>Создать пересдачу</Button>
          <Link to={'/uko/archive'} className='btn'>Просмотр архива</Link>
        </div>
        <div className='examen__filter filter-examen'>
          <h2 className="filter-examen__title title">Фильтр</h2>
          <form className='filter-examen__form form' onSubmit={handleSubmitFilter(onExamenFilter)}>
          <label className='form__label'>
              <span className='form__text'>Филиал</span>
              <Controller
                control={controlFilter}
                name='filialId'
                rules={{
                  required: true
                }}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={error ? 'error' : ''}>
                    <Select
                      ref={filialSelectForFilterRef}
                      onChange={newValue => onChange(newValue?.value)}
                      placeholder='Выберите филиал'
                      options={filials}
                      isLoading={isFilialsLoading}
                      isDisabled={isFilialsLoading}
                    />
                  </div>
                )}
              />
            </label>
            <label className='form__label'>
              <span className='form__text'>Факультет</span>
              <Controller
                control={controlFilter}
                name='facultyId'
                rules={{
                  required: true
                }}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={error ? 'error' : ''}>
                    <Select
                      ref={facultySelectForFilterRef}
                      onChange={newValue => onChange(newValue?.value)}
                      placeholder='Выберите факультет'
                      options={faculties}
                      isLoading={isFacultiesLoading}
                      isDisabled={isFacultiesLoading}
                    />
                  </div>
                )}
              />
            </label>
            <label className='form__label'>
              <span className='form__text'>Дата</span>
              <Controller
                control={controlFilter}
                name='examDate'
                render={({ field: { onChange } }) => (
                  <div>
                    <DatePicker
                      ref={datePickerForFilterRef}
                      showTimeSelect={false}
                      onChange={(newDate) => onChange(newDate)}
                    />
                  </div>
                )}
              />
            </label>
            <div className='form__btns'>
              <Button className='form__btn'>
                <span>Применить</span>
              </Button>
              <Button className='form__btn form__btn--reset' onClick={(evt) => {resetFilter(evt)}}>
                <span>Сбросить</span>
              </Button>
            </div>
          </form>
        </div>
        <div className='examens-uko'>
          {
            isExamensLoading ? <div className='loader'>Идет загрузка экзаменов...</div> : <ExamensListUko examens={examensWithFilter} />
          }
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
                    ref={examenDeleteSelectRef}
                    onChange={(newValue) => { setExamenId(newValue?.value); onChange(newValue?.value) }}
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
      <Popup active={modalDeleteConfirmActive} setActive={() => {setModalDeleteConfirmActive(false); resetDelete(); setExamenId(null); examenDeleteSelectRef.current.clearValue()}}>
        <h2 className="popup__title title">Вы действительно хотите удалить экзамен?</h2>
        <div className="confirm-buttons">
          <Button onClick={() => deleteExamen(examenId)} className={`confirm-button confirm-button--yes${isDeleteLoading ? ' loading' : ''}`} disabled={isDeleteLoading} ><span>Да</span></Button>
          <Button className="confirm-button confirm-button--no" onClick={() => {setModalDeleteConfirmActive(false); resetDelete(); setExamenId(null); examenDeleteSelectRef.current.clearValue()}}>Нет</Button>
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
                    ref={datePickerCopyRef}
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

export default UkoPage