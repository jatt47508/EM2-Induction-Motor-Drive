import React, { useEffect, useState } from 'react'
import { allSectionIds, sections } from './data/sections'
import Hero from './sections/Hero'
import MotorExplorer from './sections/MotorExplorer'
import OperatingView from './sections/OperatingView'
import SimulationLab from './sections/SimulationLab'
import Overview from './sections/Overview'
import Introduction from './sections/Introduction'
import Background from './sections/Background'
import LiteratureReview from './sections/LiteratureReview'
import ControlComparison from './sections/ControlComparison'
import Contributions from './sections/Contributions'
import ResearchGap from './sections/ResearchGap'
import Conclusion from './sections/Conclusion'
import VideoResources from './sections/VideoResources'
import References from './sections/References'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ScrollProgress from './components/ScrollProgress'
import Reveal from './components/Reveal'

function App() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const ids = ['hero', ...allSectionIds]
    const line = 100
    let raf = 0
    const compute = () => {
      raf = 0
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(prev => (prev === current ? prev : current))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const navActive = sections.some(s => s.id === active) ? active : ''

  return (
    <div>
      <ScrollProgress />
      <Navbar active={navActive} />
      <main>
        <Hero />
        <MotorExplorer />
        <section id="operating" className="block">
          <div className="container"><Reveal><OperatingView /></Reveal></div>
        </section>
        <section id="simulation" className="block">
          <div className="container"><Reveal><SimulationLab /></Reveal></div>
        </section>
        <Reveal><Overview /></Reveal>
        <Reveal><Introduction /></Reveal>
        <Reveal><Background /></Reveal>
        <Reveal><LiteratureReview /></Reveal>
        <Reveal><ControlComparison /></Reveal>
        <Reveal><Contributions /></Reveal>
        <Reveal><ResearchGap /></Reveal>
        <Reveal><Conclusion /></Reveal>
        <section id="resources" className="block">
          <div className="container"><Reveal><VideoResources /></Reveal></div>
        </section>
        <Reveal><References /></Reveal>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
