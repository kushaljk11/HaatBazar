import nepalLocationHierarchy from "../data/nepalLocationHierarchy.json";

function flattenData(rawData) {
  const provinces = Object.keys(rawData || {});
  const districtsByProvince = {};
  const municipalitiesByDistrict = {};

  for (const province of provinces) {
    const districts = Object.keys(rawData[province] || {});
    districtsByProvince[province] = districts;

    for (const district of districts) {
      const groupedMunicipalities = rawData[province][district] || {};
      municipalitiesByDistrict[district] = Object.values(groupedMunicipalities)
        .flatMap((group) => (Array.isArray(group) ? group : []))
        .filter(Boolean);
    }
  }

  return { provinces, districtsByProvince, municipalitiesByDistrict };
}

const data = flattenData(nepalLocationHierarchy);

export function getAllCities() {
  const allCities = Object.values(data.municipalitiesByDistrict).flat();
  return [...new Set(allCities)].sort((a, b) => a.localeCompare(b));
}

export function getProvinces() {
  return data.provinces;
}

export function getDistrictsByProvince(province) {
  return data.districtsByProvince[province] || [];
}

export function getMunicipalitiesByDistrict(district) {
  return data.municipalitiesByDistrict[district] || [];
}

export function getCitySuggestions(keyword, limit = 10) {
  const term = String(keyword || "").trim().toLowerCase();
  if (!term) return [];

  return getAllCities()
    .filter((name) => name.toLowerCase().includes(term))
    .slice(0, limit);
}
