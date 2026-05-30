import { format } from 'date-fns';
import { ItineraryItem } from './db';

const CATEGORY_DEFAULTS = {
  CHECK_OUT: 10,       // 10:00 AM
  FLIGHT_DEPARTURE: 11, // 11:00 AM
  ACTIVITY: 13,        // 01:00 PM
  FLIGHT_ARRIVAL: 16,  // 04:00 PM
  CHECK_IN: 18,       // 06:00 PM
};

/**
 * Core Sorting Engine: Implements 'Human-First' logistical flow.
 * Optimized for performance by pre-calculating sort keys.
 */
export const sortItinerary = (points: ItineraryItem[]): ItineraryItem[] => {
  if (points.length === 0) return [];
  
  // 1. Pre-calculate Trip Context for Smart Sorting
  const times = points
    .map(p => p.startTime ? new Date(p.startTime).getTime() : NaN)
    .filter(t => !isNaN(t));
  const minTime = times.length > 0 ? Math.min(...times) : Date.now();
  
  const firstDate = format(new Date(minTime), 'yyyy-MM-dd');

  // Find Home Base once
  let homeBase: string | undefined;
  const initialFlight = [...points]
    .filter(p => p.startTime && !isNaN(new Date(p.startTime).getTime()))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .find(p => p.category === 'Flight' && p.title.toLowerCase().includes('departure'));
  
  if (initialFlight?.metadata?.departureCity) {
    homeBase = initialFlight.metadata.departureCity.toLowerCase();
  }

  // 2. Pre-calculate sort keys for each point to avoid O(N log N * expensive_ops)
  const pointsWithMetadata = points.map(item => {
    let dateObj = item.startTime ? new Date(item.startTime) : new Date(minTime);
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date(minTime);
    }
    const itemDateStr = format(dateObj, 'yyyy-MM-dd');
    const title = item.title.toLowerCase();
    const cat = item.category;
    
    const isDay1 = itemDateStr === firstDate;
    
    // Rank calculation
    let rank = 5; // Default for Activities, Food, etc.
    const arrivalCity = item.metadata?.arrivalCity?.toLowerCase();
    const isReturnFlight = cat === 'Flight' && arrivalCity && homeBase && arrivalCity === homeBase;

    if (isDay1 && cat === 'Flight' && title.includes('departure')) {
      rank = -100;
    } else if (isDay1 && (title.includes('check-out from') && title.includes(homeBase || ''))) {
      rank = 1000;
    } else if (isReturnFlight) {
      rank = title.includes('departure') ? 1999 : 2000;
    } else if (cat === 'Flight') {
      if (title.includes('departure')) rank = 2;
      else if (title.includes('arrival')) rank = 4;
      else rank = 3;
    } else if (cat === 'Lodging') {
      rank = title.includes('check-out') ? 1 : 10;
    }

    // Time calculation
    let sortTime: number;
    if (item.isTimeExplicit !== false) {
      const isMidnightLodging = cat === 'Lodging' && !title.includes('check-out') && dateObj.getUTCHours() === 0 && dateObj.getUTCMinutes() === 0;
      if (!isMidnightLodging) {
        sortTime = dateObj.getTime();
      } else {
        // Force predicted evening for midnight lodging
        const d = new Date(dateObj);
        d.setHours(CATEGORY_DEFAULTS.CHECK_IN, 0, 0, 0);
        sortTime = d.getTime();
      }
    } else {
      const d = new Date(dateObj);
      let hour = CATEGORY_DEFAULTS.ACTIVITY;

      if (isDay1 && cat === 'Flight' && title.includes('departure')) {
        hour = 0;
      } else if (isReturnFlight) {
        hour = 23;
      } else if (cat === 'Lodging') {
        hour = title.includes('check-out') ? CATEGORY_DEFAULTS.CHECK_OUT : CATEGORY_DEFAULTS.CHECK_IN;
      } else if (cat === 'Flight') {
        hour = title.includes('arrival') ? CATEGORY_DEFAULTS.FLIGHT_ARRIVAL : CATEGORY_DEFAULTS.FLIGHT_DEPARTURE;
      }
      
      d.setHours(hour, 0, 0, 0);
      sortTime = d.getTime();
    }

    return {
      item,
      dateStr: itemDateStr,
      sortTime,
      rank,
      sortOrder: item.sortOrder ?? 0
    };
  });

  // 3. Perform the sort using pre-calculated metadata
  return pointsWithMetadata
    .sort((a, b) => {
      // Primary: Day
      if (a.dateStr !== b.dateStr) {
        const timeA = a.item.startTime ? new Date(a.item.startTime).getTime() : minTime;
        const timeB = b.item.startTime ? new Date(b.item.startTime).getTime() : minTime;
        const validTimeA = isNaN(timeA) ? minTime : timeA;
        const validTimeB = isNaN(timeB) ? minTime : timeB;
        return validTimeA - validTimeB;
      }
      
      // Secondary: Manual sortOrder (crucial for drag-and-drop)
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      // Tertiary: Time (Explicit or Predicted)
      if (a.sortTime !== b.sortTime) {
        return a.sortTime - b.sortTime;
      }

      // Final Tie-breaker: Logistical Rank
      return a.rank - b.rank;
    })
    .map(p => p.item);
};
