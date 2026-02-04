

 const { coordinates, title } = window.listingData;

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=6EjHQ5LEujlN7A4CyITX',
  center: coordinates,
  zoom: 11
});

map.addControl(new maplibregl.NavigationControl());

new maplibregl.Marker({color : "red"})
  .setLngLat(coordinates)
  .setPopup(new maplibregl.Popup().setHTML(`<h6>${title}</h6> <b>location will be provided after booking</b>`))
  .addTo(map);
