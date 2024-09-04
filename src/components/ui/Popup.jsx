import React from 'react'
import closePopup from '../../assets/img/close.svg'

const Popup = ({children, id, hiddenData, active, setActive}) => {


  return (
    <div id={id} className={`popup${active ? " open" : ""}`}>
        <div className="popup__body">
            <div className="popup__content">
                <button type="button" className="popup__close" onClick={() => setActive(false)}>
                    <img src={closePopup} alt="" />
                </button>
                {
                  hiddenData && hiddenData.map(data => <input type='hidden' id={data.name} value={data.value} />)
                }
                {children}
            </div>
        </div>
    </div>
  )
}

export default Popup