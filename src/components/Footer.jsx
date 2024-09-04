import logoFooter from '../assets/img/logo-footer.svg'

const Footer = () => {
  return (
    <footer className="footer">
            <div className="footer__container container">
                <div className="footer__inner">
                    <a href="" className="logo">
                        <img src={logoFooter} alt="" />
                    </a>
                    <div className="footer__text">
                        Система компьютерного экзамена
                    </div>
                </div>
            </div>
        </footer>
  )
}

export default Footer