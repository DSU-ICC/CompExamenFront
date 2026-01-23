import { Link } from 'react-router-dom'
import logo from '../assets/img/logo.png'

const Footer = () => {
  return (
    <footer className="footer">
            <div className="footer__container container">
                <div className="footer__inner">
                    <Link to="/" className="logo">
                        <div className="logo__img">
                            <img src={logo} alt="Логотип ДГУ" />
                        </div>
                        <span className="logo__text">Дагестанский государственный университет</span>
                    </Link>
                    <div className="footer__text">
                        Система компьютерного экзамена
                    </div>
                </div>
            </div>
        </footer>
  )
}

export default Footer