import Select from '../ui/Select'
import Input from '../ui/Input'
import Button from '../ui/Button'
import DatePicker from '../ui/DatePicker'
import { useState, useEffect, useRef, useContext } from 'react'
import { useFetching } from '../../hooks/useFetching'
import DsuService from '../../api/DsuService'
import { Controller, useForm } from 'react-hook-form';
import EmployeeService from '../../api/EmployeeService'
import { AppContext } from '../../context'
import ExamenService from '../../api/ExamenService'

const EditExamenForm = ({ examData, onSubmit }) => {
    const teacherSelectRef = useRef(null)
    const auditoriumSelectRef = useRef(null)
    const filialSelectRef = useRef(null)
    const facultySelectRef = useRef(null)
    const departmentSelectRef = useRef(null)
    const courseSelectRef = useRef(null)
    const groupSelectRef = useRef(null)
    const edukindSelectRef = useRef(null)
    const disciplineSelectRef = useRef(null)
    const disciplineInputRef = useRef(null)
    const isManualRef = useRef(null)
    const retakeSelectRef = useRef(null)

    const {employeeId} = useContext(AppContext)

    const { control, handleSubmit, setValue, getValues, watch } = useForm({
        mode: "onSubmit",
        defaultValues: {
            examDurationInMitutes: examData.examDurationInMitutes,
            examDate: examData && new Date(examData.examDate)
        }
    })

    const watchIsEnterDisciplineManual = watch("isEnterDisciplineManual", false)

    const setSelectDefaultValue = (selectRef, name, value, dataArr) => {
        selectRef.current.setValue(dataArr.find(d => d.value == value), "onChange")
        setValue(name, value)
    }

    const resetSelectValue = (selectRef, setOptionsState = null) => {
        selectRef.current.setValue(null, "onChange")
        setOptionsState && setOptionsState([])
    }


    const [flagSetDefaultValues, setFlagSetDefaultValues] = useState(false)

    const [retakes, setRetakes] = useState([])
    const [getRetakes, isRetakesLoading] = useFetching(async () => {
        const response = await ExamenService.getRetakes()
        const data = response.data.map(dataItem => ({
            value: dataItem.retake,
            label: dataItem.description
        }))
        setRetakes(data)

        if (!flagSetDefaultValues) {
            const defaultRetake = data.find(d => d.label == examData.retake)
            retakeSelectRef.current.setValue(defaultRetake, "onChange")
            setValue("retake", defaultRetake.value)
        }
    })

    const [teachers, setTeachers] = useState([])
    const [getTeachers, isTeachersLoading] = useFetching(async () => {
        const response = await DsuService.getTeachers()
        const data = response.data.map(dataItem => ({
            value: dataItem.teachId,
            label: `${dataItem.lastname} ${dataItem.firstname} ${dataItem.patr}`
        }))
        setTeachers(data)

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(teacherSelectRef, "teacherId", examData.teacherId, data)
        }
    })

    const [auditoriums, setAuditoriums] = useState([])
    const [getEmployees, isAuditoriumLoading] = useFetching(async () => {
        const response = await EmployeeService.getAuditories()
        const data = response.data.map(dataItem => ({
            value: dataItem.id,
            label: dataItem.name
        }))

        setAuditoriums(data)

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(auditoriumSelectRef, "auditoriumId", examData.auditoriumId, data)
        }
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

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(filialSelectRef, "filialId", examData.filialId, data)
        }
    })

    const [faculties, setFaculties] = useState([])
    const [facultyId, setFacultyId] = useState(examData.facultyId)
    const [getFaculties, isFacultiesLoading] = useFetching(async () => {
        const response = await DsuService.getFaculties()
        const data = response.data.map(dataItem => ({
            value: dataItem.facId,
            label: dataItem.facName
        }))

        setFaculties(data)

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(facultySelectRef, "facultyId", examData.facultyId, data)
        }
    })

    useEffect(() => {
        getTeachers()
        getEmployees()
        getFilials()
            .then(() => getFaculties())
            .then(() => getDepartments(examData.facultyId))
            .then(() => getCourses(examData.departmentId, examData.filialId))
            .then(() => getGroups(examData.departmentId, examData.course, examData.filialId))
            .then(() => getEdukinds())
            .then(() => getDisciplines(examData.departmentId, examData.course, examData.group, examData.edukind?.edukindId, examData.filialId))
            .then(() => getRetakes())
            .then(() => setFlagSetDefaultValues(true))
    }, [])

    useEffect(() => {
        if (flagSetDefaultValues) {
            if (filialId) {
                resetSelectValue(facultySelectRef, setFaculties)
                resetSelectValue(departmentSelectRef, setDepartments)
                resetSelectValue(courseSelectRef, setCourses)
                resetSelectValue(groupSelectRef, setGroups)
                resetSelectValue(edukindSelectRef)
                resetSelectValue(disciplineSelectRef, setDisciplines)

                getFaculties()
            }
        }
    }, [filialId])


    const [departments, setDepartments] = useState([])
    const [departmentId, setDepartmentId] = useState(examData.departmentId)
    const [getDepartments, isDepartmentsLoading] = useFetching(async (id) => {
        const response = await DsuService.getCaseSDepartmentByFacultyId(id)
        const data = response.data.map(dataItem => ({
            value: dataItem.departmentId,
            label: dataItem.deptName,
        }))

        setDepartments(data)

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(departmentSelectRef, "departmentId", examData.departmentId, data)
        }
    })

    useEffect(() => {
        if (flagSetDefaultValues) {
            if (facultyId) {
                resetSelectValue(departmentSelectRef, setDepartments)
                resetSelectValue(courseSelectRef, setCourses)
                resetSelectValue(groupSelectRef, setGroups)
                resetSelectValue(edukindSelectRef)
                resetSelectValue(disciplineSelectRef, setDisciplines)

                getDepartments(facultyId)
            }
        }
    }, [facultyId])

    const [courses, setCourses] = useState([])
    const [course, setCourse] = useState(examData.course)
    const [getCourses, isCoursesLoading] = useFetching(async (id, filialId) => {
        const response = await DsuService.getCourseByDepartmentId(id, filialId)
        const data = response.data.sort((a, b) => a - b).map(dataItem => ({
            value: dataItem,
            label: dataItem
        }))

        setCourses(data)

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(courseSelectRef, "course", examData.course, data)
        }
    })
    useEffect(() => {
        if (flagSetDefaultValues) {
            if (departmentId) {
                if (flagSetDefaultValues) {
                    resetSelectValue(courseSelectRef, setCourses)
                    resetSelectValue(groupSelectRef, setGroups)
                    resetSelectValue(edukindSelectRef)
                    resetSelectValue(disciplineSelectRef, setDisciplines)

                    getCourses(departmentId, filialId)
                }
            }
        }
    }, [departmentId])

    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState(examData.nGroup)
    const [getGroups, isGroupsLoading] = useFetching(async (id, nCourse, filialId) => {
        const response = await DsuService.getGroupsByDepartmentIdAndCourse(id, nCourse, filialId)
        const data = response.data.map(dataItem => ({
            value: dataItem,
            label: dataItem
        }))

        setGroups(data)

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(groupSelectRef, "nGroup", examData.nGroup, data)
        }
    })
    useEffect(() => {
        if (flagSetDefaultValues) {
            if (course) {
                if (flagSetDefaultValues) {
                    resetSelectValue(groupSelectRef, setGroups)
                    resetSelectValue(edukindSelectRef)
                    resetSelectValue(disciplineSelectRef, setDisciplines)

                    getGroups(departmentId, course, filialId)
                }
            }
        }
    }, [course])

    const [edukinds, setEdukinds] = useState([])
    const [edukind, setEdukind] = useState(examData.edukindId)
    const [getEdukinds, isEdukindsLoading] = useFetching(async () => {
        const response = await DsuService.getEdukinds()
        const data = response.data.map(dataItem => ({
            value: dataItem.edukindId,
            label: dataItem.edukind
        }))

        setEdukinds(data)

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(edukindSelectRef, "edukindId", examData.edukindId, data)
        }
    })

    useEffect(() => {
        if (flagSetDefaultValues) {
            resetSelectValue(edukindSelectRef)
            resetSelectValue(disciplineSelectRef, setDisciplines)
        }
    }, [group])

    useEffect(() => {
        if (flagSetDefaultValues) {
            getEdukinds()
        }

        if (!examData.edukind) {
            isManualRef.current.checked = true
            setValue("isEnterDisciplineManual", true)

            disciplineInputRef.current.value = examData.discipline
            setValue("disciplineManual", examData.discipline)
        }
    }, [])

    const [disciplines, setDisciplines] = useState([])
    const [getDisciplines, isDisciplinesLoading] = useFetching(async (departmentId, course, group, edukind, filialId) => {
        if (typeof edukind === "undefined") return

        const response = await DsuService.getDisciplinesWithFilter(departmentId, course, group, edukind, filialId)
        const dataArr = []

        let isDefaultValueInArray = false
        if (response.data.length > 0) {
            response.data.forEach(dataItem => {
                if (dataItem.predmet == examData.discipline) {
                    isDefaultValueInArray = true
                }

                dataArr.push({
                    value: dataItem.disciplineId,
                    label: dataItem.predmet
                })
            })
        }

        setDisciplines(dataArr)
        if (!flagSetDefaultValues) {
            if (isDefaultValueInArray) {
                setSelectDefaultValue(disciplineSelectRef, "discipline", dataArr.find(d => d.label == examData.discipline).value, dataArr)
            } else {
                isManualRef.current.checked = true
                setValue("isEnterDisciplineManual", true)

                disciplineInputRef.current.value = examData.discipline
                setValue("disciplineManual", examData.discipline)
            }
        }
    })

    useEffect(() => {
        const { filialId: filialIdValue, departmentId: departmentIdValue, course: courseValue, nGroup: groupValue, edukindId: edukindIdValue } = getValues()
        if (filialIdValue && departmentIdValue && courseValue && groupValue && edukindIdValue) {
            if (flagSetDefaultValues) {
                resetSelectValue(disciplineSelectRef, setDisciplines)

                getDisciplines(departmentId, course, group, edukind, filialId)
            }
        }
    }, [departmentId, course, group, edukind])

    const handleSubmitForm = (data) => {
        data.endExamDate = examData.endExamDate
        data.id = examData.id
        data.isDeleted = false
        data.tickets = examData.tickets
        data.isInArchive = examData.isInArchive
        data.employeeId = employeeId

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
                                ref={filialSelectRef}
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
                            ref={isManualRef}
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
            <label className='form__label' onClick={(evt) => evt.preventDefault()}>
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
            <label className='form__label' onClick={(evt) => evt.preventDefault()}>
                <span className='form__text'>Длительность в минутах</span>

                <Controller
                    control={control}
                    name='examDurationInMitutes'
                    rules={{
                        required: true
                    }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <Input
                            type="number"
                            value={value}
                            className={`form__input${error ? ' error' : ''}`}
                            onChange={(newValue) => { onChange(newValue) }}
                        />
                    )}
                />
            </label>
            <label className="form__label">
                <Button className='form__btn-questions btn'>Изменить вопросы</Button>
            </label>
        </form>
    )
}

export default EditExamenForm