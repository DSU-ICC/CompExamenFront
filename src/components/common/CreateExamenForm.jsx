import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import DatePicker from '../../components/ui/DatePicker'
import { useState, useEffect, useRef } from 'react'
import { useFetching } from '../../hooks/useFetching'
import DsuService from '../../api/DsuService'
import { Controller, useForm } from 'react-hook-form';
import EmployeeService from '../../api/EmployeeService'
import ExamenService from '../../api/ExamenService'

const CreateExamenForm = ({onSubmit}) => {
    const teacherSelectRef = useRef(null)
    const auditoriumSelectRef = useRef(null)
    const facultySelectRef = useRef(null)
    const departmentSelectRef = useRef(null)
    const courseSelectRef = useRef(null)
    const groupSelectRef = useRef(null)
    const edukindSelectRef = useRef(null)
    const disciplineSelectRef = useRef(null)
    const disciplineInputRef = useRef(null)
    const retakeSelectRef = useRef(null)

    const resetSelectValue = (selectRef, setOptionsState = null) => {
        selectRef.current.setValue(null, "onChange")
        setOptionsState && setOptionsState([])
    }

    const [retakes, setRetakes] = useState([])
    const [getRetakes, isRetakesLoading] = useFetching(async () => {
        const response = await ExamenService.getRetakes()
        const data = response.data.map(dataItem => ({
            value: dataItem.retake,
            label: dataItem.description
        }))
        setRetakes(data)
    })

    const [teachers, setTeachers] = useState([])
    const [getTeachers, isTeachersLoading] = useFetching(async () => {
        const response = await DsuService.getTeachers()
        const data = response.data.map(dataItem => ({
            value: dataItem.teachId,
            label: `${dataItem.lastname} ${dataItem.firstname} ${dataItem.patr}`
        }))
        setTeachers(data)
    })

    const [auditoriums, setAuditoriums] = useState([])
    const [getAuditories, isAuditoriumLoading] = useFetching(async () => {
        const response = await EmployeeService.getAuditories()
        const data = response.data.map(dataItem => ({
            value: dataItem.id,
            label: dataItem.name
        }))
        setAuditoriums(data)
    })

    const [filials, setFilials] = useState([])
    const [filialId, setFilialId] = useState(null)
    const [getFilials, isFilialsLoading] = useFetching(async () => {
        const response = await DsuService.getFilials()
        const data = response.data.map(dataItem => ({
            value: dataItem.filId,
            label: dataItem.filial
        }))
        setFilials(data)
    })

    useEffect(() => {
        getTeachers()
        getAuditories()
        getFilials()
        getEdukinds()
        getRetakes()
    }, [])

    const [faculties, setFaculties] = useState([])
    const [facultyId, setFacultyId] = useState(null)
    const [getFaculties, isFacultiesLoading] = useFetching(async () => {
        const response = await DsuService.getFaculties()
        const data = response.data.map(dataItem => ({
            value: dataItem.facId,
            label: dataItem.facName
        }))
        setFaculties(data)
    })

    useEffect(() => {
        if (filialId) {
            resetSelectValue(facultySelectRef, setFaculties)
            resetSelectValue(departmentSelectRef, setDepartments)
            resetSelectValue(courseSelectRef, setCourses)
            resetSelectValue(groupSelectRef, setGroups)
            resetSelectValue(edukindSelectRef)
            resetSelectValue(disciplineSelectRef, setDisciplines)
            resetSelectValue(retakeSelectRef)

            getFaculties()
        }
    }, [filialId])


    const [departments, setDepartments] = useState([])
    const [departmentId, setDepartmentId] = useState(null)
    const [getDepartments, isDepartmentsLoading] = useFetching(async (id) => {
        const response = await DsuService.getCaseSDepartmentByFacultyId(id)
        const data = response.data.map(dataItem => ({
            value: dataItem.departmentId,
            label: dataItem.deptName
        }))
        setDepartments(data)
    })
    useEffect(() => {
        resetSelectValue(departmentSelectRef, setDepartments)
        resetSelectValue(courseSelectRef, setCourses)
        resetSelectValue(groupSelectRef, setGroups)
        resetSelectValue(edukindSelectRef)
        resetSelectValue(disciplineSelectRef, setDisciplines)
        resetSelectValue(retakeSelectRef)

        getDepartments(facultyId)
    }, [facultyId])

    const [courses, setCourses] = useState([])
    const [course, setCourse] = useState(null)
    const [getCourses, isCoursesLoading] = useFetching(async (id, filialId) => {
        const response = await DsuService.getCourseByDepartmentId(id, filialId)
        const data = response.data.sort((a, b) => a - b).map(dataItem => ({
            value: dataItem,
            label: dataItem
        }))
        setCourses(data)
    })

    useEffect(() => {
        if (departmentId) {
            resetSelectValue(courseSelectRef, setCourses)
            resetSelectValue(groupSelectRef, setGroups)
            resetSelectValue(edukindSelectRef)
            resetSelectValue(disciplineSelectRef, setDisciplines)
            resetSelectValue(retakeSelectRef)

            getCourses(departmentId, filialId)
        }
    }, [departmentId])

    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState(null)
    const [getGroups, isGroupsLoading] = useFetching(async (id, nCourse, filialId) => {
        const response = await DsuService.getGroupsByDepartmentIdAndCourse(id, nCourse, filialId)
        const data = response.data.map(dataItem => ({
            value: dataItem,
            label: dataItem
        }))
        setGroups(data)
    })
    useEffect(() => {
        if (course) {
            resetSelectValue(groupSelectRef, setGroups)
            resetSelectValue(edukindSelectRef)
            resetSelectValue(disciplineSelectRef, setDisciplines)
            resetSelectValue(retakeSelectRef)

            getGroups(departmentId, course, filialId)
        }
    }, [course])

    const [edukinds, setEdukinds] = useState([])
    const [edukind, setEdukind] = useState(null)
    const [getEdukinds, isEdukindsLoading] = useFetching(async () => {
        const response = await DsuService.getEdukinds()
        const data = response.data.map(dataItem => ({
            value: dataItem.edukindId,
            label: dataItem.edukind
        }))
        setEdukinds(data)
    })

    useEffect(() => {
        resetSelectValue(edukindSelectRef)
        resetSelectValue(disciplineSelectRef, setDisciplines)
        resetSelectValue(retakeSelectRef)
    }, [group])

    const [disciplines, setDisciplines] = useState([])
    const [getDisciplines, isDisciplinesLoading] = useFetching(async (departmentId, course, group, edukind, filialId) => {
        const response = await DsuService.getDisciplinesWithFilter(departmentId, course, group, edukind, filialId)
        const data = response.data.map(dataItem => ({
            value: dataItem.disciplineId,
            label: dataItem.predmet
        }))
        setDisciplines(data)
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
        defaultValues: {
            examDate: new Date()
        }
    })

    const watchIsEnterDisciplineManual = watch("isEnterDisciplineManual", false)

    const handleSubmitForm = (data) => {
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

        onSubmit(data)
    }

    return (
        <form className='form' onSubmit={handleSubmit(handleSubmitForm)}>
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
                            onChange={(newValue) => { onChange(newValue.target.checked) }}
                        />
                    )}
                />
            </label>
            <label className='form__label'>
                <span className='form__text'>Тип сдачи</span>
                <Controller
                    control={control}
                    name='retake'
                    rules={{
                        required: true
                    }}
                    render={({ field: { onChange }, fieldState: { error } }) => (
                        <div className={error ? 'error' : ''}>
                            <Select
                                ref={retakeSelectRef}
                                placeholder="Выберите тип сдачи"
                                onChange={(newValue) => { onChange(newValue?.value) }}
                                options={retakes}
                                isLoading={isRetakesLoading}
                                isDisabled={isRetakesLoading}
                            />
                        </div>
                    )}
                />
            </label>
            <label className='form__label'>
                <span className='form__text'>Дата</span>
                <Controller
                    control={control}
                    name='examDate'
                    render={({ field: { value, onChange } }) => (
                        <div>
                            <DatePicker
                                value={value}
                                onChange={onChange}
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
    )
}

export default CreateExamenForm