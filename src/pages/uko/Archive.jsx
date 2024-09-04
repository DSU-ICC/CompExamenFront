import { useState, useEffect, useRef } from "react";
import ExamensListUko from '../../components/uko/ExamensListUko'
import { Controller, useForm } from "react-hook-form";
import Select from "../../components/ui/Select";
import DatePicker from "../../components/ui/DatePicker";
import Button from "../../components/ui/Button";
import DsuService from "../../api/DsuService";
import { useFetching } from "../../hooks/useFetching";
import ExamenService from "../../api/ExamenService";
import { Link } from "react-router-dom";

const Archive = () => {
    const departmentSelectRef = useRef(null)
    const datePickerStartDateRef = useRef(null)
    const datePickerEndDateRef = useRef(null)

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

    useEffect(() => {
        getFilials()
        getFaculties()
    }, [])

    const [faculties, setFaculties] = useState([])
    const [facultyId, setFacultyId] = useState(null)
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

    const [departments, setDepartments] = useState([])
    const [getDepartments, isDepartmentsLoading, depError] = useFetching(async (id) => {
        const response = await DsuService.getCaseSDepartmentByFacultyId(id)
        const dataArr = []
        response.data.forEach(dataItem => {
            dataArr.push({
                value: dataItem.departmentId,
                label: dataItem.deptName
            })
        })

        setDepartments(dataArr)
    })
    useEffect(() => {
        if (facultyId) {
            departmentSelectRef.current.setValue(null, "onChange")
            setDepartments([])

            getDepartments(facultyId)
        }
    }, [facultyId])


    const [archivedExamens, setArchivedExamens] = useState(null)
    const [getExamensFromArchive, isArchiveLoading, archiveErr] = useFetching(async (filter) => {
        const response = await ExamenService.getExamensFromArchiveByFilter(filter)
        if (response.status == 200) {
            setArchivedExamens(response.data)
        }
    })

    const { control, handleSubmit } = useForm({
        mode: "onSubmit"
    })

    const handleSubmitArchive = (data) => {
        data.startDate = datePickerStartDateRef.current.props.selected
        data.endDate = datePickerEndDateRef.current.props.selected

        getExamensFromArchive(data)
    }

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
                <form className='archive__form form' style={{ marginBottom: 20 }} onSubmit={handleSubmit(handleSubmitArchive)}>
                    <label className='form__label'>
                        <span className='form__text'>Филиал</span>
                        <Controller
                            control={control}
                            name='filialId'
                            render={({ field: { onChange }, fieldState: { error } }) => (
                                <div className={error ? 'error' : ''}>
                                    <Select
                                        onChange={(newValue) => { onChange(newValue.value) }}
                                        placeholder='Выберите филиал'
                                        options={filials}
                                        isLoading={isFilialsLoading}
                                        isDisabled={isFilialsLoading}
                                    />
                                </div>
                            )}
                        />
                    </label>
                    <label className='form__label' onClick={(evt) => evt.preventDefault()}>
                        <span className='form__text'>Факультет</span>
                        <Controller
                            control={control}
                            name='facultyId'
                            render={({ field: { onChange }, fieldState: { error } }) => (
                                <div className={error ? 'error' : ''}>
                                    <Select
                                        onChange={(newValue) => { setFacultyId(newValue.value); onChange(newValue.value) }}
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
                        <span className='form__text'>Направление</span>
                        <Controller
                            control={control}
                            name='departmentId'
                            render={({ field: { onChange }, fieldState: { error } }) => (
                                <div className={error ? 'error' : ''}>
                                    <Select
                                        ref={departmentSelectRef}
                                        onChange={(newValue) => { onChange(newValue?.value) }}
                                        placeholder='Выберите направление'
                                        options={departments}
                                        isLoading={isDepartmentsLoading}
                                        isDisabled={isDepartmentsLoading}
                                    />
                                </div>
                            )}
                        />
                    </label>
                    <label className='form__label' onClick={(evt) => evt.preventDefault()}>
                        <span className='form__text'>Начальная дата</span>
                        <Controller
                            control={control}
                            name='startDate'
                            render={({ field: { onChange } }) => (
                                <div className="form__label--start-date">
                                    <DatePicker
                                        ref={datePickerStartDateRef}
                                        showTimeSelect={false}
                                        onChange={(newDate) => onChange(newDate)}
                                    />
                                </div>
                            )}
                        />
                    </label>
                    <label className='form__label' onClick={(evt) => evt.preventDefault()}>
                        <span className='form__text'>Конечная дата</span>
                        <Controller
                            control={control}
                            name='endDate'
                            render={({ field: { onChange } }) => (
                                <div className="form__label--end-date">
                                    <DatePicker
                                        ref={datePickerEndDateRef}
                                        showTimeSelect={false}
                                        onChange={(newDate) => onChange(newDate)}
                                    />
                                </div>
                            )}
                        />
                    </label>
                    <Button className={`${isArchiveLoading ? " loading" : ""}`} disabled={isArchiveLoading}><span>Просмотреть экзамены из архива</span></Button>
                </form>
                <div className="archive__examens examens">
                    {
                        isArchiveLoading ? <div>Загрузка данных...</div>
                            :
                            archivedExamens != null ?
                                archivedExamens.length > 0
                                    ?
                                    <ExamensListUko examens={archivedExamens} />
                                    :
                                    <div>Нет данных!</div>
                                : <></>
                    }
                </div>
            </div>
        </section>
    )
}

export default Archive