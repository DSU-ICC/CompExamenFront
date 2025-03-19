import Select from '../ui/Select'
import Input from '../ui/Input'
import Button from '../ui/Button'
import DatePicker from '../ui/DatePicker'
import { useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useFetching } from '../../hooks/useFetching'
import DsuService from '../../api/DsuService'
import { Controller, useForm } from 'react-hook-form';
import EmployeeService from '../../api/EmployeeService'

const EditExamenForm = ({ onSubmit }) => {
    const data = useLocation()
    const examData = data.state

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
    const datePickerRef = useRef(null)

    const { control, handleSubmit, setValue, getValues, watch } = useForm({
        mode: "onSubmit",
        defaultValues: {
            examDurationInMitutes: examData.examDurationInMitutes
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

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(teacherSelectRef, "teacherId", examData.teacherId, dataArr)
        }
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

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(auditoriumSelectRef, "auditoriumId", examData.auditoriumId, dataArr)
        }
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

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(filialSelectRef, "filialId", examData.filial.filId, dataArr)
        }
    })

    const [faculties, setFaculties] = useState([])
    const [facultyId, setFacultyId] = useState(examData.department.facId)
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

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(facultySelectRef, "facultyId", examData.department.facId, dataArr)
        }
    })

    useEffect(() => {
        getTeachers()
        getEmployees()
        getFilials()
            .then(() => getFaculties())
            .then(() => getDepartments(examData.department.facId))
            .then(() => getCourses(examData.department.departmentId, examData.filial.filId))
            .then(() => getGroups(examData.department.departmentId, examData.course, examData.filial.filId))
            .then(() => getEdukinds())
            .then(() => getDisciplines(examData.department.departmentId, examData.course, examData.group, examData.edukind?.edukindId, examData.filial.filId))
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
    const [departmentId, setDepartmentId] = useState(examData.department.departmentId)
    const [getDepartments, isDepartmentsLoading, depError] = useFetching(async (id) => {
        const response = await DsuService.getCaseSDepartmentByFacultyId(id)
        const dataArr = []
        response.data.forEach(dataItem => {
            dataArr.push({
                value: dataItem.departmentId,
                label: dataItem.deptName,
            })
        })

        setDepartments(dataArr)

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(departmentSelectRef, "departmentId", examData.department.departmentId, dataArr)
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

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(courseSelectRef, "course", examData.course, dataArr)
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
    const [group, setGroup] = useState(examData.group)
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

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(groupSelectRef, "nGroup", examData.group, dataArr)
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

        if (!flagSetDefaultValues) {
            setSelectDefaultValue(edukindSelectRef, "edukindId", examData.edukind?.edukindId, dataArr)
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
    const [getDisciplines, isDisciplinesLoading, disciplinesErr] = useFetching(async (departmentId, course, group, edukind, filialId) => {
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
        data.examDate = datePickerRef.current.props.selected
        data.endExamDate = examData.endExamDate
        data.id = examData.examenId
        data.isDeleted = false
        data.examTickets = examData.examTickets

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
            <label className='form__label' onClick={(evt) => evt.preventDefault()}>
                <span className='form__text'>Дата</span>

                <Controller
                    control={control}
                    name='examDate'
                    render={({ field: { onChange } }) => (
                        <div>
                            <DatePicker
                                ref={datePickerRef}
                                selected={new Date(examData.examDate)}
                                onChange={(newDate) => onChange(newDate)}
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