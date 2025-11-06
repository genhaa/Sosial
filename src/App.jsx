// src/App.jsx
import { Routes, Route } from 'react-router-dom'

// Import 'Template'
import Layout from './components/Layout'

// Import Halaman (Bikin file kosongan dulu)
import Home from './pages/Home' 
import Popular from './pages/Popular'
import Kategori from './pages/Kategori'
import Tentang from './pages/Tentang'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
// Nanti tambah: EditProfile

function App() {
  return (
    <Routes>
      {/* Rute-rute yang PAKE SIDEBAR (dibungkus Layout) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/kategori" element={<Kategori />} />
        <Route path="/tentang" element={<Tentang />} />
        {/* INI RUTE DINAMIS BUAT PROFILE */}
        <Route path="/profile/:username" element={<Profile />} />
      </Route>

      {/* Rute-rute yang FULLSCREEN (Auth) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Kalo user nyasar */}
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  )
}

export default App