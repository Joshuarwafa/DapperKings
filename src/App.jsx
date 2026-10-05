import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import WhatsAppButton from './components/WhatsAppButton'
import { ToastProvider } from './components/Toast'
import Home from './pages/Home'
import Lookbook from './pages/Lookbook'
import Services from './pages/Services'
import Process from './pages/Process'
import About from './pages/About'
import Book from './pages/Book'
import NotFound from './pages/NotFound'
import { JournalLayout, JournalList, JournalPost } from './pages/Journal'
import { useTheme } from './hooks/useTheme'
import { useBusinessSchema } from './hooks/useSeo'

// New page → start at the top (filter/URL tweaks within a page pass keepScroll)
function ScrollToTop() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    if (!state?.keepScroll) window.scrollTo(0, 0)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

function Layout() {
  const [theme, toggleTheme] = useTheme()
  useBusinessSchema()

  return (
    <ToastProvider>
      <ScrollToTop />
      <a href="#main" className="skip-link">Skip to content</a>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <div id="main">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </ToastProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lookbook" element={<Lookbook />} />
        <Route path="services" element={<Services />} />
        <Route path="process" element={<Process />} />
        <Route path="about" element={<About />} />
        <Route path="book" element={<Book />} />
        <Route path="journal" element={<JournalLayout />}>
          <Route index element={<JournalList />} />
          <Route path=":slug" element={<JournalPost />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
