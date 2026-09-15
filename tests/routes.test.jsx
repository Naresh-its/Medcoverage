import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock Leaflet to prevent canvas/DOM exceptions in Node / jsdom environment
vi.mock('leaflet', () => {
  const mockLayerGroup = {
    addTo: vi.fn().mockReturnThis(),
    clearLayers: vi.fn(),
    addLayer: vi.fn()
  };

  const mockMapInstance = {
    setView: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    fitBounds: vi.fn()
  };

  return {
    default: {
      map: vi.fn(() => mockMapInstance),
      tileLayer: vi.fn(() => ({ addTo: vi.fn().mockReturnThis() })),
      layerGroup: vi.fn(() => mockLayerGroup),
      circle: vi.fn(() => ({
        bindPopup: vi.fn().mockReturnThis(),
        addTo: vi.fn().mockReturnThis(),
        on: vi.fn()
      })),
      polygon: vi.fn(() => ({
        bindPopup: vi.fn().mockReturnThis(),
        addTo: vi.fn().mockReturnThis(),
        on: vi.fn()
    })),
      marker: vi.fn(() => ({
        bindPopup: vi.fn().mockReturnThis(),
        addTo: vi.fn().mockReturnThis(),
        on: vi.fn()
      })),
      divIcon: vi.fn(() => ({}))
    }
  };
});

// Import pages
import HomePage from '../src/pages/HomePage';
import CoveragePage from '../src/pages/CoveragePage';
import MedicalNeedsPage from '../src/pages/MedicalNeedsPage';
import WhatIfPage from '../src/pages/WhatIfPage';
import InsightsPage from '../src/pages/InsightsPage';
import AboutPage from '../src/pages/AboutPage';

describe('Route Integration & Page Rendering Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders HomePage (/) without runtime errors', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
    expect(screen.getByText(/MedCoverage/i)).toBeDefined();
  });

  it('renders CoveragePage (/coverage) without runtime errors', () => {
    const mockSetNeed = vi.fn();
    const mockSetSim = vi.fn();

    const { container } = render(
      <MemoryRouter initialEntries={['/coverage']}>
        <CoveragePage 
          selectedNeedId="severe_bleeding"
          setSelectedNeedId={mockSetNeed}
          activeSimulation={null}
          setActiveSimulation={mockSetSim}
        />
      </MemoryRouter>
    );

    expect(container).toBeDefined();
    expect(screen.getByText(/Healthcare Coverage/i)).toBeDefined();
    expect(screen.getByText(/Interactive GIS Application/i)).toBeDefined();
  });

  it('renders MedicalNeedsPage (/needs) without runtime errors', () => {
    const mockSetNeed = vi.fn();

    const { container } = render(
      <MemoryRouter initialEntries={['/needs']}>
        <MedicalNeedsPage 
          selectedNeedId="severe_bleeding"
          setSelectedNeedId={mockSetNeed}
        />
      </MemoryRouter>
    );

    expect(container).toBeDefined();
    expect(screen.getByText(/Medical Needs & Resource Requirements/i)).toBeDefined();
  });

  it('renders WhatIfPage (/what-if) without runtime errors', () => {
    const mockSetSim = vi.fn();

    const { container } = render(
      <MemoryRouter initialEntries={['/what-if']}>
        <WhatIfPage 
          activeSimulation={null}
          setActiveSimulation={mockSetSim}
        />
      </MemoryRouter>
    );

    expect(container).toBeDefined();
    expect(screen.getByText(/What-If Intervention Simulator/i)).toBeDefined();
  });

  it('renders InsightsPage (/insights) without runtime errors', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/insights']}>
        <InsightsPage />
      </MemoryRouter>
    );

    expect(container).toBeDefined();
    expect(screen.getByText(/Coverage Analytics & Gap Insights/i)).toBeDefined();
  });

  it('renders AboutPage (/about) without runtime errors', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/about']}>
        <AboutPage />
      </MemoryRouter>
    );

    expect(container).toBeDefined();
    expect(screen.getByText(/About MedCoverage/i)).toBeDefined();
  });

});
