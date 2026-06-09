/**
 * Calculate distance between two coordinates
 * using Haversine formula.
 * Returns distance in km.
 */
export const haversineDistance = (
  lat1, lon1, lat2, lon2
) => {
  const R = 6371;
  const dLat = ((lat2-lat1) * Math.PI) / 180;
  const dLon = ((lon2-lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a),
                           Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1));
};

/**
 * Check if a center is currently open
 * based on Bangladesh Standard Time (UTC+6).
 */
export const isOpenNow = (hours) => {
  const bst = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka"
    })
  );
  const day  = bst.getDay();
  const hhmm = bst.getHours() * 100 + bst.getMinutes();

  const today = hours?.find(h => h.day === day);
  if (!today || today.closed) return false;

  const open  = parseInt(today.opens.replace(":", ""));
  const close = parseInt(today.closes.replace(":", ""));
  return hhmm >= open && hhmm <= close;
};

/**
 * Convert 24-hour time to Bengali AM/PM format.
 * "09:00" → "সকাল ৯টা"
 * "17:00" → "বিকাল ৫টা"
 */
export const toBengaliTime = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const bengaliNums = ["০","১","২","৩","৪",
                       "৫","৬","৭","৮","৯"];
  const toBn = n => String(n).split("")
    .map(d => bengaliNums[d]).join("");

  const period =
    h < 6  ? "রাত" :
    h < 12 ? "সকাল" :
    h < 15 ? "দুপুর" :
    h < 18 ? "বিকাল" :
    h < 20 ? "সন্ধ্যা" : "রাত";

  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${period} ${toBn(h12)}টা${m > 0 ? ' ' + toBn(m) + 'মিনিট' : ''}`;
};

/**
 * Filter centers by search query (Bengali safe).
 */
export const filterBySearch = (centers, query) => {
  if (!query.trim()) return centers;
  const q = query.toLowerCase();
  return centers.filter(c =>
    c.name_bn.includes(query) ||
    c.name_en.toLowerCase().includes(q) ||
    (c.short_name && c.short_name.toLowerCase()
      .includes(q)) ||
    c.district.includes(query) ||
    c.division.includes(query)
  );
};

/**
 * Sort centers array by given method.
 */
export const sortCenters = (centers, method) => {
  const sorted = [...centers];
  if (method === "distance")
    return sorted.sort((a, b) =>
      (a.distanceKm || 999) - (b.distanceKm || 999));
  if (method === "rating")
    return sorted.sort((a, b) =>
      (b.avg_safety_rating || 0) -
      (a.avg_safety_rating || 0));
  if (method === "type")
    return sorted.sort((a, b) =>
      a.center_type.localeCompare(b.center_type));
  return sorted;
};
