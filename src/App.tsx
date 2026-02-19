import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from "./pages/home.tsx";
import Work from "./pages/work.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Home /> }/>
                {/*<Route path="/work" element={ <Work />}/>*/}
            </Routes>
        </BrowserRouter>
    )
}

export default App
