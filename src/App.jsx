import { Route, Routes } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Wordle from "./pages/Wordle"
import MainPage from "./pages/MainPage"

function App() {
    return (
        <>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<MainPage/>} />
                    <Route path="/wordle" element={<Wordle/>} />
                </Route>
            </Routes>
        </>
    )
}

export default App
