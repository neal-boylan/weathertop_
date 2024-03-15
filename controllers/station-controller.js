import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const stationController = {
  async index(request, response) {
		const station = await stationStore.getStationById(request.params.id);
    const viewData = {
      title: station.name,
      station: station,
    };
		console.log(`Station "${station.name}" rendering`);
    response.render("station-view", viewData);
  },

  async addReading(request, response) {
		const station = await stationStore.getStationById(request.params.id);
    const newReading = {
      code: request.body.code,
      temp: request.body.temp,
      pressure: request.body.pressure,
    };
    console.log(`adding reading to ${station.name}`);
    await readingStore.addReading(station._id, newReading);
    response.redirect("/station/" + station._id);
  },

  async deleteReading(request, response) {
  
  },
};
