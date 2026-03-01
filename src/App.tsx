import './App.css'
import Home from '../src/pages/Home.tsx'
import Work from '../src/pages/Work.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/work"} element={<Work />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
