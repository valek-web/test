import { Route, Routes } from "react-router-dom"
import { Layout } from "./Layout"
import { Slider } from "../pages/Slider/Slider"
import { RotateImg } from "../pages/RotateImg/RotateImg"
import { Loader } from "../pages/Loader/Loader"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/slider" element={<Slider />} />
          <Route path="/rotate_img" element={<RotateImg />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="*" element={<h1>Not found!</h1>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
