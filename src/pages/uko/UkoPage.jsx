import { useState, useEffect, useRef } from 'react'
import Button from '../../components/ui/Button'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import Select from '../../components/ui/Select'
import { Link, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import DatePicker from '../../components/ui/DatePicker'
import ExamensListUko from '../../components/uko/ExamensListUko'
import DsuService from '../../api/DsuService'

const UkoPage = () => {
  const urlParans = useParams()
  const userId = urlParans.id

  const [examens, setExamens] = useState([])
  const [examensWithFilter, setExamensWithFilter] = useState([])

  const filialSelectForFilterRef = useRef(null)
  const facultySelectForFilterRef = useRef(null)
  const edukindSelectForFilterRef = useRef(null)

  const [getExamensByEmployeeId, isExamensLoading] = useFetching(async (userId) => {
    const response = await ExamenService.getExamensByEmployeeId(userId)

    if (response.status == 200) {
      setExamens(response.data)
      setExamensWithFilter(response.data)
    }
  })

  useEffect(() => {
    getExamensByEmployeeId(userId)
  }, [])

  const [filials, setFilials] = useState([])
  const [getFilials, isFilialsLoading] = useFetching(async () => {
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

  const [edukinds, setEdukinds] = useState([])
  const [getEdukinds, isEdukindsLoading, edukindError] = useFetching(async () => {
    const response = await DsuService.getEdukinds()
    const dataArr = []
    response.data.forEach(dataItem => {
      dataArr.push({
        value: dataItem.edukindId,
        label: dataItem.edukind
      })
    })

    setEdukinds(dataArr)
  })

  useEffect(() => {
    getFilials()
    getFaculties()
    getEdukinds()
}, [])

  const { control: controlFilter, handleSubmit: handleSubmitFilter, reset: resetFilterForm} = useForm({
    mode: "onSubmit",
    defaultValues: {
      startDate: new Date(new Date().setHours(0, 0, 0)),
      endDate: new Date(new Date().setHours(0, 0, 0))
    }
  })
  
  const onExamenFilter = (data) => {
    let filteredExamens = examens
    if (data.filialId) {
      filteredExamens = filteredExamens.filter(e => ((e.filial == null && data.filialId == 1) || e.filial?.filId == data.filialId))
    }

    if (data.facultyId) {
      filteredExamens = filteredExamens.filter(e => e.department.facId == data.facultyId)
    }

    if (data.edukindId) {
      filteredExamens = filteredExamens.filter(e => e.edukind && e.edukind.edukindId == data.edukindId)
    }

    filteredExamens = filteredExamens.filter(e => (new Date(e.examDate) >= data.startDate) && (new Date(e.examDate) <= new Date(new Date(data.endDate).setDate(new Date(data.endDate).getDate() + 1))))
    setExamensWithFilter(filteredExamens)
  }

  const resetFilter = (evt) => {
    resetFilterForm(); //Для сброса ошибок
    
    evt.preventDefault()
    filialSelectForFilterRef.current.clearValue()
    facultySelectForFilterRef.current.clearValue()
    edukindSelectForFilterRef.current.clearValue()
    setExamensWithFilter(examens)
  }

  const handleDeleteExamen = (deletedExamenId) => {
    setExamens(examens.filter(e => e.examenId != deletedExamenId))
    setExamensWithFilter(examensWithFilter.filter(e => e.examenId != deletedExamenId))
  }

  return (
    <>
      <div className="container">
        <div className="examen-actions">
          <Link to='/uko/create-examen' className='examens-teacher__btn btn'>Создать экзамен</Link>
          <Link to='/uko/archive' className='btn'>Просмотр архива</Link>
        </div>
        <div className='examen__filter filter-examen'>
          <h2 className="filter-examen__title title">Фильтр</h2>
          <form className='filter-examen__form form' onSubmit={handleSubmitFilter(onExamenFilter)}>
          <label className='form__label'>
              <span className='form__text'>Филиал</span>
              <Controller
                control={controlFilter}
                name='filialId'
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
              <span className='form__text'>Форма обучения</span>
              <Controller
                control={controlFilter}
                name='edukindId'
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={error ? 'error' : ''}>
                    <Select
                      ref={edukindSelectForFilterRef}
                      onChange={newValue => onChange(newValue?.value)}
                      placeholder='Выберите форму обучения'
                      options={edukinds}
                      isLoading={isEdukindsLoading}
                      isDisabled={isEdukindsLoading}
                    />
                  </div>
                )}
              />
            </label>
            <label className='form__label' onClick={(e) => e.preventDefault()}>
              <span className='form__text'>Начальная дата</span>
              <Controller
                control={controlFilter}
                name='startDate'
                render={({ field: { value, onChange } }) => (
                  <div>
                    <DatePicker
                      value={value}
                      onChange={onChange}
                      showTimeSelect={false}
                    />
                  </div>
                )}
              />
            </label>
            <label className='form__label' onClick={(e) => e.preventDefault()}>
              <span className='form__text'>Конечная дата</span>
              <Controller
                control={controlFilter}
                name='endDate'
                render={({ field: { value, onChange } }) => (
                  <div>
                    <DatePicker
                      value={value}
                      onChange={onChange}
                      showTimeSelect={false}
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
            isExamensLoading ? <div className='loader'>Идет загрузка экзаменов...</div> : <ExamensListUko onCopy={() => getExamensByEmployeeId(userId)} onDelete={handleDeleteExamen} examens={examensWithFilter} />
          }
        </div>
      </div>
    </>
  )
}

export default UkoPage