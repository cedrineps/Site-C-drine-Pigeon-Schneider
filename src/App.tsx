/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ColorSweepTransition } from './components/ColorSweepTransition';
import { ContactSection } from './components/ContactSection';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { KineticMarquee } from './components/KineticMarquee';
import { PersonalitySection } from './components/PersonalitySection';
import { ProjectsSection } from './components/ProjectsSection';
import { StudioModal } from './components/StudioModal';
import { INITIAL_PORTFOLIO_DATA } from './data/initialPortfolio';
import { PortfolioData, ProjectItem, SectionTheme } from './types/portfolio';

const SECTION_META: Array<{ id: string; theme: SectionTheme }> = [
  { id: 'hero', theme: 'cream' },
  { id: 'about', theme: 'coral' },
  { id: 'projects', theme: 'yellow' },
  { id: 'personality', theme: 'sage' },
  { id: 'contact', theme: 'pink' },
];

const SECTION_BG: Record<SectionTheme, string> = {
  cream: '#F5EBDD',
  coral: '#F7DFDA',
  lilac: '#ECE4FA',
  yellow: '#FBF0CB',
  sage: '#E6EDD9',
  pink: '#F7DFE7',
};

const SECTION_BG_DARK: Record<SectionTheme, string> = {
  cream: '#1E1B18',
  coral: '#271D1C',
  lilac: '#211C29',
  yellow: '#252116',
  sage: '#1C221A',
  pink: '#271B21',
};

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(INITIAL_PORTFOLIO_DATA);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [activeTheme, setActiveTheme] = useState<SectionTheme>('cream');
  const [sweepTheme, setSweepTheme] = useState<SectionTheme | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [hasBackendApi, setHasBackendApi] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem('pigeon-dark') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      window.localStorage.setItem('pigeon-dark', String(darkMode));
    } catch {
      // Ignore storage errors
    }
  }, [darkMode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/portfolio')
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          return null;
        }
        return res.json();
      })
      .then((data: PortfolioData | null) => {
        if (
          active &&
          data &&
          Array.isArray(data.projects) &&
          Array.isArray(data.moodboard)
        ) {
          setHasBackendApi(true);
          setPortfolio(data);
        }
      })
      .catch(() => {
        // Keep initial data when deployed statically or offline
      });
    return () => {
      active = false;
    };
  }, []);

  // Smooth scroll-triggered section color transitions
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = SECTION_META.find((s) => s.id === entry.target.id);
            if (match) {
              setActiveSection(match.id);
              setActiveTheme(match.theme);
            }
          }
        }
      },
      {
        rootMargin: '-38% 0px -45% 0px',
        threshold: 0.01,
      }
    );

    for (const sec of SECTION_META) {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback(
    (sectionId: string, theme: SectionTheme) => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      if (reducedMotion) {
        el.scrollIntoView({ behavior: 'auto' });
        setActiveSection(sectionId);
        setActiveTheme(theme);
        return;
      }

      setSweepTheme(theme);
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'auto' });
        setActiveSection(sectionId);
        setActiveTheme(theme);
        setTimeout(() => {
          setSweepTheme(null);
        }, 260);
      }, 340);
    },
    [reducedMotion]
  );

  const featuredProjects = portfolio.projects.filter((p) => p.featured);
  const previewProjects =
    featuredProjects.length >= 2 ? featuredProjects : portfolio.projects.slice(0, 3);

  const currentBg = reducedMotion
    ? darkMode
      ? '#1E1B18'
      : '#F5EBDD'
    : (darkMode ? SECTION_BG_DARK : SECTION_BG)[activeTheme];

  return (
    <div
      className={`min-h-screen text-[#252525] dark:text-[#F5EBDD] ${
        reducedMotion ? '' : 'transition-colors duration-700 ease-out'
      }`}
      style={{
        backgroundColor: currentBg,
      }}
    >
      <CustomCursor activeTheme={activeTheme} reducedMotion={reducedMotion} darkMode={darkMode} />
      <ColorSweepTransition
        sweepTheme={sweepTheme}
        reducedMotion={reducedMotion}
        darkMode={darkMode}
      />

      <Header
        activeSection={activeSection}
        activeTheme={activeTheme}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onNavigate={handleNavigate}
      />

      <main>
        <HeroSection
          portrait={portfolio.portrait}
          artisticPhoto={portfolio.artisticPhoto}
          featuredProjects={previewProjects}
          hasBackendApi={hasBackendApi}
          reducedMotion={reducedMotion}
          darkMode={darkMode}
          onNavigate={handleNavigate}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        <KineticMarquee
          items={[
            'Stratégie marketing pure',
            'Comprendre le produit ou le service',
            'À qui vendre & comment',
            'Ligne directrice visuels & vidéos publicitaires',
            'Double culture juridique & marketing',
            'Projet L’Épifemme · Innovations immersives',
          ]}
          tilt={-1.1}
          accentColor={darkMode ? '#F08AA8' : '#C94F7C'}
          reducedMotion={reducedMotion}
        />

        <AboutSection
          portrait={portfolio.portrait}
          reducedMotion={reducedMotion}
          darkMode={darkMode}
        />

        <KineticMarquee
          items={[
            'Les mots',
            'Les images',
            'Les couleurs',
            'Le message',
            'L’expérience proposée',
            'Figma · Canva · Milanote · KPI',
          ]}
          reverse
          tilt={1}
          bgClass="bg-white/55 dark:bg-[#2A2523]/70"
          accentColor={darkMode ? '#D2BFF7' : '#6F4FA6'}
          reducedMotion={reducedMotion}
        />

        <ProjectsSection
          projects={portfolio.projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          reducedMotion={reducedMotion}
        />

        <PersonalitySection reducedMotion={reducedMotion} />

        <ContactSection
          hasBackendApi={hasBackendApi}
          onOpenStudio={() => setStudioOpen(true)}
          reducedMotion={reducedMotion}
        />
      </main>

      <StudioModal
        open={studioOpen}
        onClose={() => setStudioOpen(false)}
        onPublishedUpdate={(published) => setPortfolio(published)}
      />
    </div>
  );
}
