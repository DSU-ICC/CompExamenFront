import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import DatePicker from '../../components/ui/DatePicker'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useFetching } from '../../hooks/useFetching'
import DsuService from '../../api/DsuService'
import { Controller, useForm } from 'react-hook-form';
import EmployeeService from '../../api/EmployeeService'

const CreateExamenForm = () => {
    const teacherSelectRef = useRef(null)
    const auditoriumSelectRef = useRef(null)
    const facultySelectRef = useRef(null)
    const departmentSelectRef = useRef(null)
    const courseSelectRef = useRef(null)
    const groupSelectRef = useRef(null)
    const edukindSelectRef = useRef(null)
    const disciplineSelectRef = useRef(null)
    const disciplineInputRef = useRef(null)

    const resetSelectValue = (selectRef, setOptionsState = null) => {
        selectRef.current.setValue(null, "onChange")
        setOptionsState && setOptionsState([])
    }

    const [teachers, setTeachers] = useState([])
    const [getTeachers, isTeachersLoading, teachersError] = useFetching(async () => {
        const response = await DsuService.getTeachers()
        const dataArr = []
        response.data.forEach(dataItem => {
            dataArr.push({
                value: dataItem.teachId,
                label: `${dataItem.lastname} ${dataItem.firstname} ${dataItem.patr}`
            })
        })

        setTeachers(dataArr)
    })
   
    const [auditoriums, setAuditoriums] = useState([])
    const [getEmployees, isAuditoriumLoading, auditoriumError] = useFetching(async () => {
        const response = await EmployeeService.getAuditories()
        const dataArr = []
        response.data.forEach(dataItem => {
            dataArr.push({
                value: dataItem.id,
                label: dataItem.name
            })
        })

        setAuditoriums(dataArr)
    })

    const [filials, setFilials] = useState([])
    const [filialId, setFilialId] = useState(null)
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
        getTeachers()
        getEmployees()
        getFilials()
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

    useEffect(() => {
        if (filialId) {
            resetSelectValue(facultySelectRef, setFaculties)
            resetSelectValue(departmentSelectRef, setDepartments)
            resetSelectValue(courseSelectRef, setCourses)
            resetSelectValue(groupSelectRef, setGroups)
            resetSelectValue(edukindSelectRef)
            resetSelectValue(disciplineSelectRef, setDisciplines)

            getFaculties()
        }
    }, [filialId])


    const [departments, setDepartments] = useState([])
    const [departmentId, setDepartmentId] = useState(null)
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
        resetSelectValue(departmentSelectRef, setDepartments)
        resetSelectValue(courseSelectRef, setCourses)
        resetSelectValue(groupSelectRef, setGroups)
        resetSelectValue(edukindSelectRef)
        resetSelectValue(disciplineSelectRef, setDisciplines)

        getDepartments(facultyId)
    }, [facultyId])

    const [courses, setCourses] = useState([])
    const [course, setCourse] = useState(null)
    const [getCourses, isCoursesLoading, coursesError] = useFetching(async (id, filialId) => {
        const response = await DsuService.getCourseByDepartmentId(id, filialId)
        const dataArr = []
        response.data.sort((a, b) => a - b).forEach(dataItem => {
            dataArr.push({
                value: dataItem,
                label: dataItem
            })
        })

        setCourses(dataArr)
    })

    useEffect(() => {
        if (departmentId) {
            resetSelectValue(courseSelectRef, setCourses)
            resetSelectValue(groupSelectRef, setGroups)
            resetSelectValue(edukindSelectRef)
            resetSelectValue(disciplineSelectRef, setDisciplines)
            
            getCourses(departmentId, filialId)
        }
    }, [departmentId])

    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState(null)
    const [getGroups, isGroupsLoading, groupsError] = useFetching(async (id, nCourse, filialId) => {
        const response = await DsuService.getGroupsByDepartmentIdAndCourse(id, nCourse, filialId)
        const dataArr = []
        response.data.forEach(dataItem => {
            dataArr.push({
                value: dataItem,
                label: dataItem
            })
        })

        setGroups(dataArr)
    })
    useEffect(() => {
       if (course) {
            resetSelectValue(groupSelectRef, setGroups)
            resetSelectValue(edukindSelectRef)
            resetSelectValue(disciplineSelectRef, setDisciplines)

            getGroups(departmentId, course, filialId)
       }
    }, [course])

    const [edukinds, setEdukinds] = useState([])
    const [edukind, setEdukind] = useState(null)
    const [getEdukinds, isEdukindsLoading, edukindsErr] = useFetching(async () => {
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
        getEdukinds()
    }, [])

    useEffect(() => {
        resetSelectValue(edukindSelectRef)
        resetSelectValue(disciplineSelectRef, setDisciplines)
    }, [group])

    const [disciplines, setDisciplines] = useState([])
    const [getDisciplines, isDisciplinesLoading, disciplinesErr] = useFetching(async (departmentId, course, group, edukind, filialId) => {
        const response = await DsuService.getDisciplinesWithFilter(departmentId, course, group, edukind, filialId)
        const dataArr = []
        if (response.data.length > 0) {
            response.data.forEach(dataItem => {
                dataArr.push({
                    value: dataItem.disciplineId,
                    label: dataItem.predmet
                })
            })
        }
        setDisciplines(dataArr)
    })
    useEffect(() => {
        const { departmentId: departmentIdValue, course: courseValue, nGroup: groupValue, edukindId: edukindIdValue } = getValues()
        if (departmentIdValue && courseValue && groupValue && edukindIdValue) {
            resetSelectValue(disciplineSelectRef, setDisciplines)
            getDisciplines(departmentId, course, group, edukind, filialId)
        }
    }, [departmentId, course, group, edukind])

    const { control, handleSubmit, getValues, watch } = useForm({
        mode: "onSubmit",
    })

    const watchIsEnterDisciplineManual = watch("isEnterDisciplineManual", false)

    const redirect = useNavigate()

    const datePickerRef = useRef(null)

    const onSubmit = (data) => {
        data.examDate = datePickerRef.current.props.selected
        data.isDeleted = false

        if (data.isEnterDisciplineManual) {
            data.discipline = disciplineInputRef.current.value
        } else {
            const selectedDiscipline = disciplineSelectRef.current.getValue()[0]
            data.discipline = selectedDiscipline?.label
            data.disciplineId = selectedDiscipline?.value
        }

        delete data.isEnterDisciplineManual
        delete data.disciplineManual

        redirect(`/uko/create-tickets`, {
            state: data
        })
    }

    return (
        <section className='create-examen'>
            <div className="container container--smaller">
                <div className="create-examen__inner">
                    <div className='back-link'>
                        <Link to={-1}>
                            <svg width="187" height="55" viewBox="0 0 187 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.7451 5.9399C11.3153 2.6184 14.6599 0.5 18.3338 0.5H177C182.247 0.5 186.5 4.7533 186.5 10V45C186.5 50.2467 182.247 54.5 177 54.5H18.3338C14.6599 54.5 11.3153 52.3816 9.7451 49.0601L1.47238 31.5601C0.257292 28.9897 0.257292 26.0103 1.47238 23.4399L5.95204 13.9637L9.7451 5.9399Z" stroke="#0050CF" />
                            </svg>
                            <span className="back-link__text">Назад</span>
                        </Link>
                    </div>
                    <h1 className="create-examen__title title">Создание экзамена</h1>
                    <form className='form' onSubmit={handleSubmit(onSubmit)}>
                        <label className='form__label'>
                            <span className='form__text'>Преподаватель</span>
                            <Controller
                                control={control}
                                name='teacherId'
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className={error ? 'error' : ''}>
                                        <Select
                                            ref={teacherSelectRef}
                                            onChange={(newValue) => { onChange(newValue.value) }}
                                            placeholder='Выберите преподавателя'
                                            options={teachers}
                                            isLoading={isTeachersLoading}
                                            isDisabled={isTeachersLoading}
                                        />
                                    </div>
                                )}
                            />
                        </label>
                        <label className='form__label'>
                            <span className='form__text'>Аудитория</span>
                            <Controller
                                control={control}
                                name='auditoriumId'
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className={error ? 'error' : ''}>
                                        <Select
                                            ref={auditoriumSelectRef}
                                            onChange={(newValue) => { onChange(newValue.value) }}
                                            placeholder='Выберите аудиторию'
                                            options={auditoriums}
                                            isLoading={isAuditoriumLoading}
                                            isDisabled={isAuditoriumLoading}
                                        />
                                    </div>
                                )}
                            />
                        </label>
                        <label className='form__label'>
                            <span className='form__text'>Филиал</span>
                            <Controller
                                control={control}
                                name='filialId'
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className={error ? 'error' : ''}>
                                        <Select
                                            onChange={(newValue) => { setFilialId(newValue.value); onChange(newValue.value) }}
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
                                control={control}
                                name='facultyId'
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className={error ? 'error' : ''}>
                                        <Select
                                            ref={facultySelectRef}
                                            onChange={(newValue) => { setFacultyId(newValue?.value); onChange(newValue?.value) }}
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
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className={error ? 'error' : ''}>
                                        <Select
                                            ref={departmentSelectRef}
                                            onChange={(newValue) => { setDepartmentId(newValue?.value); onChange(newValue?.value) }}
                                            placeholder='Выберите направление'
                                            options={departments}
                                            isLoading={isDepartmentsLoading}
                                            isDisabled={isDepartmentsLoading}
                                        />
                                    </div>
                                )}
                            />
                        </label>
                        <label className='form__label'>
                            <span className='form__text'>Курс</span>
                            <Controller
                                control={control}
                                name='course'
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className={error ? 'error' : ''}>
                                        <Select
                                            ref={courseSelectRef}
                                            placeholder="Выберите курс"
                                            onChange={(newValue) => { setCourse(newValue?.value); onChange(newValue?.value) }}
                                            options={courses}
                                            isLoading={isCoursesLoading}
                                            isDisabled={isCoursesLoading}
                                        />
                                    </div>
                                )}
                            />
                        </label>
                        <label className='form__label'>
                            <span className='form__text'>Группа</span>
                            <Controller
                                control={control}
                                name='nGroup'
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className={error ? 'error' : ''}>
                                        <Select
                                            ref={groupSelectRef}
                                            placeholder="Выберите группу"
                                            onChange={(newValue) => { setGroup(newValue?.value); onChange(newValue?.value) }}
                                            options={groups}
                                            isLoading={isGroupsLoading}
                                            isDisabled={isGroupsLoading}
                                        />
                                    </div>
                                )}
                            />
                        </label>
                        <label className='form__label'>
                            <span className='form__text'>Форма обучения</span>
                            <Controller
                                control={control}
                                name='edukindId'
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className={error ? 'error' : ''}>
                                        <Select
                                            ref={edukindSelectRef}
                                            placeholder="Выберите форму обучения"
                                            onChange={(newValue) => { setEdukind(newValue?.value); onChange(newValue?.value) }}
                                            options={edukinds}
                                            isLoading={isEdukindsLoading}
                                            isDisabled={isEdukindsLoading}
                                        />
                                    </div>
                                )}
                            />
                        </label>
                        <label className='form__label' style={{ display: watchIsEnterDisciplineManual ? "none" : "flex" }} >
                            <span className='form__text'>Дисциплина</span>
                            <Controller
                                control={control}
                                name='discipline'
                                rules={{
                                    required: !watchIsEnterDisciplineManual
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className={error ? 'error' : ''}>
                                        <Select
                                            ref={disciplineSelectRef}
                                            placeholder="Выберите дисциплину"
                                            onChange={(newValue) => { onChange(newValue?.value) }}
                                            options={disciplines}
                                            isLoading={isDisciplinesLoading}
                                            isDisabled={isDisciplinesLoading}
                                        />
                                    </div>
                                )}
                            />
                        </label>
                        <label className='form__label' style={{ display: watchIsEnterDisciplineManual ? "flex" : "none" }}>
                            <span className='form__text'>Дисциплина</span>
                            <Controller
                                control={control}
                                name='disciplineManual'
                                rules={{
                                    required: watchIsEnterDisciplineManual 
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <Input
                                        ref={disciplineInputRef}
                                        placeholder="Введите название дисциплины"
                                        className={`form__input${error ? ' error' : ''}`}
                                        onChange={(newValue) => { onChange(newValue) }}
                                    />
                                )}
                            />
                        </label>
                        <label className="form__label form__label_checkbox">
                            <span className="form__text">Ввести название дисциплины вручную</span>
                            <Controller
                                control={control}
                                name="isEnterDisciplineManual"
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <Input
                                        type="checkbox"
                                        className={`form__input ${error ? " error" : ""}`}
                                        onChange={(newValue) => {onChange(newValue.target.checked)}}
                                    />
                                )}
                            />
                        </label>
                        <label className='form__label'>
                            <span className='form__text'>Дата</span>

                            <Controller
                                control={control}
                                name='examDate'
                                render={({ field: { onChange } }) => (
                                    <div>
                                        <DatePicker
                                            ref={datePickerRef}
                                            onChange={(newDate) => onChange(newDate)}
                                        />
                                    </div>
                                )}
                            />
                        </label>
                        <label className='form__label'>
                            <span className='form__text'>Длительность в минутах</span>

                            <Controller
                                control={control}
                                name='examDurationInMitutes'
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <Input
                                        type="number"
                                        className={`form__input${error ? ' error' : ''}`}
                                        onChange={(newValue) => { onChange(newValue) }}
                                    />
                                )}
                            />
                        </label>
                        <label className="form__label">
                            <Button className='form__btn-questions btn'>Загрузить вопросы</Button>
                        </label>
                        <div className='form__btns'>
                            {/* <Button>Создать экзамен</Button>
                            <Link to='/teacher/examens' className='cancel__btn btn'>Отмена</Link> */}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default CreateExamenForm