# Correcting weather-model output <Badge type="tip" text="used" />

## The idea

Global weather models such as ECMWF are excellent at large scales. Their grid cells are tens
of kilometres wide, though, so they miss local effects such as a lake, cold air pooling in a
basin, or fog.

Those errors repeat in similar weather, so a statistical model can learn them from past
forecasts and measurements. This is called **Model Output Statistics (MOS)** or statistical
post-processing, and national weather services do it routinely.

## Look-up

- **Target:** the error (`observed - forecast`), not the quantity itself. The final forecast
  is the forecast plus the predicted error.
- **Inputs:** the weather model's variables (temperature, dew point, cloud, wind, pressure,
  rain), the hour and day of year, and the **recent error**, because errors persist for days.
- **Training data:** forecasts as they were issued at the lead time you will serve. A
  reanalysis or the latest run would make the backtest look too good.
- **Baselines:** the raw model, and the model plus its mean error per hour (simple bias
  correction).
- **Data sources:** Open-Meteo (ECMWF open data and a historical forecast API) and
  MeteoSwiss open data.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): it corrects ECMWF for the
  MeteoSwiss station in Lucerne. The MAE drops from 1.50 to 1.22 °C, and the model beats raw
  ECMWF in 17 of 20 months, with the largest gains from November to April.

## Sources

- Glahn & Lowry (1972), [The use of Model Output Statistics (MOS) in objective weather forecasting](https://doi.org/10.1175/1520-0450(1972)011%3C1203:TUOMOS%3E2.0.CO;2), Journal of Applied Meteorology
- Vannitsem et al. (2021), [Statistical postprocessing for weather forecasts](https://doi.org/10.1175/BAMS-D-19-0308.1), BAMS
- [Open-Meteo ECMWF API](https://open-meteo.com/en/docs/ecmwf-api)
