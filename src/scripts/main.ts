/**
 * goToRegion is the function that will actually do the page redirect
 * @param region A string of the region to forward
 */
const goToRegion = (region: string): void => {
  window.location.href = `/${region}`;
};

/**
 * setLocation will set the location and, if persist is true, set the cookie
 * @param location A string of the region
 * @param persist A boolean, if true, will set the cookie
 */
const setLocation = (location: string, persist: boolean): void => {
  if (persist) {
    const d = new Date();
    // Save for 30 days
    // eslint-disable-next-line prettier/prettier
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    // eslint-disable-next-line unicorn/no-document-cookie
    document.cookie = `location=${location}; ${expires}`;
  }
  goToRegion(location);
};

const getLocation = (): string => {
  // This function will retrieve the location from the cookie
  const name = "location=";
  const ca = document.cookie.split(";");
  for (let c of ca) {
    while (c.charAt(0) === " ") {
      c = c.slice(1);
    }
    if (c.indexOf(name) === 0) {
      return c.slice(name.length, c.length);
    }
  }
  return "";
};

const deg2rad = (deg: number): number => deg * (Math.PI / 180);

const haversine = (
  originLat: number,
  originLong: number,
  destinationLat: number,
  destinationLong: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(destinationLat - originLat);
  const dLon = deg2rad(destinationLong - originLong);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(originLat)) *
      Math.cos(deg2rad(destinationLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km;
};

const isRemember = (): boolean => {
  const property = document.querySelector("#remember") as HTMLInputElement;
  if (property) {
    return property.checked;
  }
  return false;
};

const nearestRegion: PositionCallback = (position): void => {
  const regions = [
    {
      latitude: 39.179,
      longitude: -76.845,
      region: "baltimore",
    },
    {
      latitude: 33.483,
      longitude: -86.702,
      region: "birmingham",
    },
    {
      latitude: 28.565,
      longitude: -81.163,
      region: "orlando",
    },
    {
      latitude: 27.989,
      longitude: -82.736,
      region: "tampa",
    },
  ];

  let mindiff = 99_999;
  let closest: string | undefined;

  for (const region of regions) {
    const diff = haversine(
      position.coords.latitude,
      position.coords.longitude,
      region.latitude,
      region.longitude
    );
    if (diff < mindiff) {
      closest = region.region;
      mindiff = diff;
    }
  }
  if (typeof closest === "string") {
    setLocation(closest, isRemember());
  } else {
    throw new TypeError("Failed to getLocation");
  }
};

const getGeoLocation = (): void => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(nearestRegion);
  }
};

const clearLocation = (): void => {
  // eslint-disable-next-line unicorn/no-document-cookie
  document.cookie = "location=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const loadRegion = (withGeo: boolean): void => {
  const region = getLocation();
  if (region !== "") {
    goToRegion(region);
    // clearLocation();
  } else if (withGeo) {
    getGeoLocation();
  }
};

const setRegionFromClick = (region: string): void => {
  setLocation(region, isRemember());
};

document.addEventListener("DOMContentLoaded", () => {
  // Page load
  if (window.location.search.split("clear=")[1]) {
    // If there is a ?clear=1 in the URL, clear the location
    clearLocation();
  }

  const geoButton = document.querySelector("#geo") as HTMLButtonElement;
  geoButton.addEventListener("click", (event) => {
    event.preventDefault();
    loadRegion(true);
  });

  const regionLinks =
    document.querySelectorAll<HTMLAnchorElement>(".region-link");
  for (const link of regionLinks) {
    // link is an EventTarget type, but I can't cast the left side of the forof loop
    link.addEventListener("click", (event: Event) => {
      event.preventDefault();
      const target = event.currentTarget as HTMLAnchorElement;
      const splitRegion = target.href.split("/");
      setRegionFromClick(splitRegion[splitRegion.length - 1]);
    });
  }
  loadRegion(false);
});
