import TextEditor from "../ui/TextEditor/TextEditor"

const QuestionItem = ({ question, answer }) => {

  return (
    <li className='questions__item questions-item'>
        <span className='questions-item__number'>Вопрос №{question.number}</span>
        <div className="questions-item__body">
            <div className="questions-item__inner">
                <div className="questions-item__content ck-content" onCopy={(evt) => evt.preventDefault()} dangerouslySetInnerHTML={{ __html: question.text  }}></div>
                <div className="questions-item__answer-text" data-question-id={question.id}>
                  <TextEditor value={answer} pasteFromClipboard={false} canUploadImage={false} onPaste={(evt) => evt.preventDefault() } />
                </div>
            </div>
        </div>
    </li>
  )
}

export default QuestionItem