import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import axios from "axios";

const oneCallRequest = `https://api.openweathermap.org/data/2.5/weather?q=Dublin,Ireland&appid=ce2d5a191e08f0540955fab3f5273cb5`

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
    const station = await stationStore.getStationById(request.params.stationid);
    const reading = await readingStore.getReadingById(request.params.readingid);

    console.log(`deleting reading "${reading._id}" from ${station.name}`);
    await readingStore.deleteReading(reading._id);

    response.redirect("/station/" + station._id);
  },

  async addreport(request, response) {
    console.log("rendering new report");
    let report = {};
    const station = await stationStore.getStationById(request.params.stationid);
    const lat = station.lat;
    const lng = station.lng;
    // const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=ce2d5a191e08f0540955fab3f5273cb5`
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=ce2d5a191e08f0540955fab3f5273cb5`
    const result = await axios.get(requestUrl);
    // console.log(result.data);
    
    if (result.status == 200) {
      const reading = result.data;
      report.code = reading.weather[0].id;
      report.temperature = reading.main.temp - 273.15;
      report.windSpeed = reading.wind.speed;
      report.pressure = reading.main.pressure;
      report.windDirection = reading.wind.deg;
    }
    // console.log(report);
    const viewData = {
      title: "Weather Report",
      reading: report
    };
    // response.render("dashboard", viewData);
    console.log(`adding report to ${station.name}`);
    await readingStore.addReport(station._id, report);
    response.redirect("/station/" + station._id);
  },

};
