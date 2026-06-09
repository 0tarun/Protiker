import { createContext, useReducer, useContext, useEffect } from 'react';
import { mockCenters, mockUserLocation } from '../data/mockCenters';
import { filterBySearch, sortCenters, haversineDistance } from '../utils/helpFinderUtils';

const HelpFinderContext = createContext();

const initialState = {
  centers: [],
  filteredCenters: [],
  selectedCenter: null,
  userLocation: null,
  locationStatus: 'detecting', // detecting, found, denied, manual
  searchQuery: '',
  activeTypeFilter: 'সব ধরন',
  activeToggles: [],
  sortBy: 'distance',
  mapRef: null,
  isLoading: true
};

function helpFinderReducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return {
        ...state,
        centers: action.payload.centers,
        filteredCenters: action.payload.centers,
        userLocation: action.payload.userLocation,
        locationStatus: action.payload.userLocation ? 'found' : 'detecting',
        isLoading: false
      };
    case 'SET_USER_LOCATION': {
      const newLoc = action.payload;
      const updatedCenters = state.centers.map(c => {
        const d = haversineDistance(
          newLoc.latitude,
          newLoc.longitude,
          c.latitude,
          c.longitude
        );
        return { ...c, distanceKm: Number(d.toFixed(1)) };
      });
      return {
        ...state,
        userLocation: newLoc,
        locationStatus: 'found',
        centers: updatedCenters
      };
    }
    case 'SET_LOCATION_STATUS':
      return { ...state, locationStatus: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_TYPE_FILTER':
      return { ...state, activeTypeFilter: action.payload };
    case 'TOGGLE_FEATURE_FILTER': {
      const toggle = action.payload;
      const isActive = state.activeToggles.includes(toggle);
      const newToggles = isActive 
        ? state.activeToggles.filter(t => t !== toggle)
        : [...state.activeToggles, toggle];
      return { ...state, activeToggles: newToggles };
    }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'SELECT_CENTER':
      return { ...state, selectedCenter: action.payload };
    case 'CLEAR_SELECTION':
      return { ...state, selectedCenter: null };
    case 'SET_MAP_REF':
      return { ...state, mapRef: action.payload };
    case 'APPLY_FILTERS': {
      let result = state.centers;
      
      // Search
      result = filterBySearch(result, state.searchQuery);
      
      // Type Filter
      if (state.activeTypeFilter !== 'সব ধরন') {
        const typeMap = {
          'সরকারি আইনি সহায়তা': 'government_legal_aid',
          'এনজিও': 'ngo',
          'আদালত': 'court',
          'পুলিশ স্টেশন': 'police_station',
          'সরকারি অফিস': 'government_office'
        };
        const mappedType = typeMap[state.activeTypeFilter];
        if (mappedType) {
          result = result.filter(c => c.center_type === mappedType);
        }
      }

      // Feature Toggles (AND logic)
      if (state.activeToggles.length > 0) {
        state.activeToggles.forEach(toggle => {
          if (toggle === 'বিনামূল্যে') result = result.filter(c => c.is_free);
          if (toggle === 'হুইলচেয়ার') result = result.filter(c => c.has_wheelchair_access);
          if (toggle === 'মহিলা ডেস্ক') result = result.filter(c => c.has_women_desk);
          if (toggle === 'ইংরেজি') result = result.filter(c => c.languages_supported?.includes('en'));
          if (toggle === 'যাচাইকৃত') result = result.filter(c => c.verified === 'verified');
        });
      }

      // Sort
      result = sortCenters(result, state.sortBy);
      
      return { ...state, filteredCenters: result };
    }
    default:
      return state;
  }
}

export function HelpFinderProvider({ children }) {
  const [state, dispatch] = useReducer(helpFinderReducer, initialState);

  // Initialize Data
  useEffect(() => {
    // Calculate distances dynamically based on mock location if available
    const centersWithDistance = mockCenters.map(c => {
      let d = c.distanceKm;
      if (!d && mockUserLocation) {
        d = haversineDistance(
          mockUserLocation.latitude, 
          mockUserLocation.longitude, 
          c.latitude, 
          c.longitude
        );
      }
      return { ...c, distanceKm: d };
    });

    // Initial sort
    const sorted = sortCenters(centersWithDistance, 'distance');

    dispatch({ 
      type: 'SET_INITIAL_DATA', 
      payload: { 
        centers: sorted, 
        userLocation: mockUserLocation 
      } 
    });
  }, []);

  // Re-apply filters when dependencies change
  useEffect(() => {
    if (!state.isLoading) {
      dispatch({ type: 'APPLY_FILTERS' });
    }
  }, [state.searchQuery, state.activeTypeFilter, state.activeToggles, state.sortBy, state.isLoading, state.centers, state.userLocation]);

  return (
    <HelpFinderContext.Provider value={{ state, dispatch }}>
      {children}
    </HelpFinderContext.Provider>
  );
}

export const useHelpFinder = () => useContext(HelpFinderContext);
