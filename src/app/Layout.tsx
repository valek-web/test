import { NavLink, Outlet } from "react-router"
import styles from "./css/layout.module.css"

export const Layout = () => {
  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.header__wrapper}>
            <div className={styles.logo}>LOGO</div>
            <nav className={styles.menu}>
              <NavLink to="slider" className={styles.menu__element}>
                Слайдер
              </NavLink>
              <NavLink to="rotate_img" className={styles.menu__element}>
                Поворот изображения
              </NavLink>
              <NavLink to="loader" className={styles.menu__element}>
                Загрузчик файлов
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.nav}>
          <div className="container">
            <nav className={styles.main_menu}>
              <NavLink to="slider" className={styles.main_menu__element}>
                Слайдер
              </NavLink>
              <NavLink to="rotate_img" className={styles.main_menu__element}>
                Поворот изображения
              </NavLink>
              <NavLink to="loader" className={styles.main_menu__element}>
                Загрузчик файлов
              </NavLink>
            </nav>
          </div>
        </section>
        <section className={styles.outlet}>
          <div className="container">
            <Outlet />
          </div>
        </section>
      </main>
    </>
  )
}
