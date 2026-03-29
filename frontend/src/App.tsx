import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login";
import {Toaster} from 'react-hot-toast'

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path= "/" element={<Home />}/>
      <Route path= "/login" element={<Login />}/>
      <Route path= "/" element={<Home />}/>
      <Route path= "/" element={<Home />}/>
      <Route path= "/" element={<Home />}/>
    </Routes>
    <Toaster/>
    </BrowserRouter>
    </>
  )
}

export default App