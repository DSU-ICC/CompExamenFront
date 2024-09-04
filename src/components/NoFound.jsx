const NoFound = () => {

  return (
    <section className='not-found'>
        <div className="not-found__container container container--smaller">
            <div className="not-found__wrapper">
              <h1 className='not-found__title'>Страница не найдена</h1>
              <p className='not-found__desc'>Страница, которую вы ищете, не существует или была перемещена</p>
            </div>
            <div className="not-found__wrapper">
              <span className='not-found__code'>404</span>
            </div>
        </div>
    </section>
  )
}

export default NoFound