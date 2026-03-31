import { Link, Outlet } from "react-router-dom"
import "./MainLayout.css"

function MainLayout() {

    return (
        <>
            <nav className="d-flex justify-content-center border-bottom border-black">
                <div className="container">
                    <div className="d-flex align-items-center gap-1 pt-2 pb-2">
                        <h3>
                            <Link className="navbar-brand me-3 fw-bold"
                                to="/">
                                Главная
                            </Link>
                        </h3>
                        <h4>
                            <Link className="nav-link"
                                to="/wordle">
                                Wordle
                            </Link>
                        </h4>
                    </div>
                </div>
            </nav>
            
            <main className="d-flex justify-content-center mb-5">
                <div className="container">
                    <Outlet />
                </div>
            </main>

            <footer className=" fixed-bottom border-top bg-white">
                <div className="ms-3 p-1">
                    <Link className=" text-decoration-none text-muted"
                        to="https://github.com/sudzekai/react-games">
                        <i className="bi bi-c-circle"></i> sudzekai
                    </Link>
                </div>
            </footer>
        </>
    )
}

export default MainLayout