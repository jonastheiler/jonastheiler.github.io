// The deck. One object per card: repo, question, answer, link to the code it is about.
// A plain script rather than JSON, so the page also works when opened from disk.
// `backticks` in an answer render as code.
const LUCERNE = "https://github.com/jonastheiler/lucerne_temp/blob/main/";

const CARDS = [
  {
    repo: "lucerne-temp",
    q: "Why does the model predict ECMWF's error instead of the temperature itself?",
    a: "ECMWF already gets the large-scale weather right. What it misses at Lucerne is local: the lake, cold air pooling in the basin, winter fog. Those errors repeat in similar weather, so they can be learned from two years of data, while the full temperature could not. The corrected forecast is ECMWF plus the predicted error, and a model that learns nothing falls back to plain ECMWF.",
    link: LUCERNE + "src/lucerne_temp/model.py#L1-L6",
  },
  {
    repo: "lucerne-temp",
    q: "Why train on archived day-ahead forecasts (`previous_day1`) instead of the latest forecast for each past hour?",
    a: "The latest forecast for a past hour was made only a few hours before it and is much more accurate than what is known a day ahead. Training and backtesting on it would leak information the live system never has, and the backtest would look better than reality. The archive holds what was known when tomorrow's forecast is made.",
    link: LUCERNE + "src/lucerne_temp/data.py#L36-L41",
  },
  {
    repo: "lucerne-temp",
    q: "What is the `recent_error` feature, and why is it taken from the hour before issue time?",
    a: "It is ECMWF's mean error (observed minus forecast) over the past 24 hours. Errors persist: if fog made ECMWF 2 °C too warm today, it will probably be too warm tomorrow too. It uses the hour before issue time because the observation at issue time may not be published yet. A test checks that no feature uses an observation from after the issue time.",
    link: LUCERNE + "src/lucerne_temp/model.py#L54-L63",
  },
  {
    repo: "lucerne-temp",
    q: "Why a rolling-origin backtest instead of random k-fold cross-validation?",
    a: "Neighbouring hours are strongly correlated. A random split puts the hour before and the hour after a test hour into training, so the score is far too optimistic. Rolling origin trains on everything before a month and tests on that month, like the model is used live. Training stops a day early: a forecast issued the day before the month couldn't know that day's observations.",
    link: LUCERNE + "src/lucerne_temp/train.py#L48-L62",
  },
  {
    repo: "lucerne-temp",
    q: "What is the pinball loss, and why is it the right score for a quantile forecast?",
    a: "With d = y − prediction, the loss for quantile q is max(q·d, (q−1)·d). For q = 0.9, forecasting too low costs 0.9 per degree and too high only 0.1, so the loss is smallest when 90% of observations fall below the forecast. That makes it a proper score for quantiles. At q = 0.5 it is half the absolute error, so MAE is a special case.",
    link: LUCERNE + "src/lucerne_temp/model.py#L133-L136",
  },
  {
    repo: "lucerne-temp",
    q: "The 10% and 90% quantile models were overconfident. What does that mean, and how does conformalized quantile regression (CQR) fix it?",
    a: "Their 10–90% interval held only 63% of new observations instead of 80%, because trees fit their training data too well. CQR measures the miss on data the models haven't seen: predict each time block with models trained on the other blocks, score each hour by how far it falls outside the interval, and take the 80% quantile of those scores as a margin. Both ends of the interval are widened by that margin.",
    link: LUCERNE + "src/lucerne_temp/model.py#L91-L106",
  },
  {
    repo: "lucerne-temp",
    q: "Coverage is 81% over the whole backtest, close to the 80% target. Why is the interval still not well calibrated?",
    a: "81% is marginal coverage, an average over all weather. The interval is about 4 °C wide in every month, while the typical error ranges from 0.9 °C in calm autumn weeks to 2.0 °C in January. So it is too wide when the weather is easy and too narrow when it is hard. Good conditional coverage needs an interval whose width adapts to the situation.",
    link: LUCERNE + "README.md#known-limitations",
  },
  {
    repo: "lucerne-temp",
    q: "What is the `hourly_bias` baseline, and why does the project need it?",
    a: "ECMWF plus the error quantiles seen at that hour of day: a classic correction in a few lines. It already lowers the MAE from 1.50 to 1.42 °C with intervals at 79%. LightGBM (1.22 °C) has to beat it, not just raw ECMWF, to show that its extra inputs and complexity are worth it.",
    link: LUCERNE + "src/lucerne_temp/train.py#L32-L38",
  },
  {
    repo: "lucerne-temp",
    q: "When is a newly trained model promoted, and why the 2% tolerance?",
    a: "It must beat both baselines on pinball loss, and be at most 2% worse than the current model. Each retrain adds a month to the backtest, so the two scores come from slightly different periods and are close but not identical. Without a tolerance, noise would block good models. If the gate fails, the job fails, so it gets noticed.",
    link: LUCERNE + "src/lucerne_temp/train.py#L80-L93",
  },
  {
    repo: "lucerne-temp",
    q: "When does live monitoring start a retrain, and why are the thresholds so loose?",
    a: "Over the last 28 days, once there are at least 7 days of scores: when the MAE is more than 0.1 °C worse than raw ECMWF, or, after 21 days, when the interval holds less than 65% or more than 92% of hours. A few weeks of hours can't tell a near-tie from a real loss, and a single calm or stormy week moves coverage on its own. Tighter thresholds would retrain on noise.",
    link: LUCERNE + "src/lucerne_temp/monitor.py#L17-L21",
  },
  {
    repo: "lucerne-temp",
    q: "Why is the hour feature in UTC, and why is the day of year encoded as sine and cosine?",
    a: "The sun follows UTC, not summer time: local time jumps by an hour twice a year, and the daily temperature cycle doesn't. Sine and cosine put the day of year on a circle, so 31 December and 1 January are neighbours instead of 365 days apart.",
    link: LUCERNE + "src/lucerne_temp/model.py#L49-L52",
  },
  {
    repo: "lucerne-temp",
    q: "Why does everything (data, models, reports, forecasts) live in the git repo instead of a database and an API?",
    a: "Forecasts change once a day, so a static `forecasts/latest.json` serves them as well as a web server would. Keeping it all in git means no server, cloud account or secrets, and every change to data, model and score is versioned. Models are saved as LightGBM text files, so a retrain shows up as a readable diff.",
    link: LUCERNE + "src/lucerne_temp/model.py#L116-L121",
  },
];
