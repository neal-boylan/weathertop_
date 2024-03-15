import { stationStore } from "../models/stations-store.js";

export const dashboardController = {
  async index(request, response) {
    const viewData = {
      title: "Station Dashboard",
      stations: await stationStore.getAllStations(),
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },

  async addStation(request, response) {
    const newStation = {
      name: request.body.name,
      lat: request.body.lat,
      lng: request.body.lng,
    };
    console.log(`adding station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    console.log(`deleting station ${station.name}`);
    await stationStore.deleteStationById(station._id);
    response.redirect("/dashboard");
  },
};
