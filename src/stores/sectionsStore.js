import { create } from 'zustand';
import api from '../utils/api';

export const useSectionsStore = create((set, get) => ({
  sections: [],
  loading: false,
  error: null,

  // Fetch all active sections
  fetchSections: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/sections');
      const sections = response.data || [];
      // Sort by display_order
      const sortedSections = sections
        .filter(section => section.is_active)
        .sort((a, b) => a.display_order - b.display_order);
      set({ sections: sortedSections, loading: false });
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      // Fallback to default sections if API fails
      const defaultSections = [
        {
          id: 1,
          name: 'Personal Care',
          slug: 'personal-care',
          description: 'Premium hygiene products',
          display_order: 1,
          is_active: true,
          product_count: 150
        },
        {
          id: 2,
          name: 'Household Cleaning',
          slug: 'household-cleaning',
          description: 'Keep your home spotless',
          display_order: 2,
          is_active: true,
          product_count: 80
        },
        {
          id: 3,
          name: 'Miscellaneous',
          slug: 'miscellaneous',
          description: 'Everything you need',
          display_order: 3,
          is_active: true,
          product_count: 25
        }
      ];
      set({ sections: defaultSections, loading: false, error: error.message });
    }
  },

  // Get section by slug
  getSectionBySlug: (slug) => {
    const { sections } = get();
    return sections.find(section => section.slug === slug);
  },

  // Get sections for navigation (returns all active sections)
  getNavigationSections: () => {
    const { sections } = get();
    return sections; // Return all sections - Header component will handle display logic
  },

  // Get all sections for collections display
  getAllSections: () => {
    const { sections } = get();
    return sections;
  }
}));