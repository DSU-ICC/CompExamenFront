import ExamenItemUko from './ExamensItemUko'
import Popup from '../../components/ui/Popup'
import ExamenService from '../../api/ExamenService'
import { isStartExamen } from '../../utils/date'
import { useContext, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '../ui/Button'
import { useFetching } from '../../hooks/useFetching'
import DatePicker from '../ui/DatePicker'
import { AppContext, UkoContext } from '../../context'

const ExamensListUko = ({ examens, onCopy, onDelete }) => {
  const { showToast } = useContext(AppContext)

  const examensActive = examens.filter(e => isStartExamen(new Date(e.examDate))).sort((a, b) => new Date(b.examDate) - new Date(a.examDate))
  const examensNotActive = examens.filter(e => !isStartExamen(new Date(e.examDate))).sort((a, b) => new Date(b.examDate) - new Date(a.examDate))

  const [modalDeleteConfirmActive, setModalDeleteConfirmActive] = useState(false)
  const [modalCopyActive, setModalCopyActive] = useState(false)
  const [examenId, setExamenId] = useState(null)

  const { control: controlCopy, handleSubmit: handleSubmitCopy } = useForm({
    mode: "onSubmit",
    defaultValues: {
      copyExamDate: new Date()
    }
  })

  const onCopyExamen = (data) => {
    const examDate = data.copyExamDate
    copyExamen(examenId, examDate)
  }

  const [deleteExamen, isDeleteLoading] = useFetching(async (examenId) => {
    const response = await ExamenService.deleteExamen(examenId)
    if (response.status == 200) {
      showToast("success", "Экзамен успешно удален!")
      setModalDeleteConfirmActive(false);
      setExamenId(null);
      onDelete(examenId)
    }
  })

  const [copyExamen, isCopyLoading] = useFetching(async (examenId, newDateExamen) => {
    const response = await ExamenService.copyExamen(examenId, newDateExamen)
    if (response.status == 200) {
      showToast("success", "Пересдача успешно создана!")
      setExamenId(null)
      setModalCopyActive(false)
      onCopy()
    }
  })

  const onCloseModalDeleteConfirm = () => {
    setModalDeleteConfirmActive(false); 
    setExamenId(null); 
  }

  return (
    <UkoContext.Provider value={{ setExamenId, setModalDeleteConfirmActive, setModalCopyActive }} >
      <h1 className='title'>Будущие экзамены</h1>
      <ul className='examens-teacher__list'>
        {
          examensNotActive.map(examen =>
            <ExamenItemUko key={examen.examenId} examen={examen} />
          )
        }
      </ul>
      <div className="examens-teacher__passed">
        <h2 className='title'>Текущие и пройденные экзамены</h2>
        <ul className='examens-teacher__list'>
          {
            examensActive.map(examen =>
              <ExamenItemUko key={examen.examenId} examen={examen} />
            )
          }
        </ul>
      </div>
      <Popup active={modalDeleteConfirmActive} setActive={onCloseModalDeleteConfirm}>
        <h2 className="popup__title title">Вы действительно хотите удалить экзамен?</h2>
        <div className="confirm-buttons">
          <Button onClick={() => deleteExamen(examenId)} className={`confirm-button confirm-button--yes${isDeleteLoading ? ' loading' : ''}`} disabled={isDeleteLoading} ><span>Да</span></Button>
          <Button className="confirm-button confirm-button--no" onClick={onCloseModalDeleteConfirm}>Нет</Button>
        </div>
      </Popup>
      <Popup active={modalCopyActive} setActive={setModalCopyActive}>
        <h2 className="popup__title title">Создание пересдачи экзамена</h2>
        <form className='form' style={{ marginBottom: 20 }} onSubmit={handleSubmitCopy(onCopyExamen)}>
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
    </UkoContext.Provider>
  )
}

export default ExamensListUko