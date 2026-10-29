// The deck. One object per card: repo, question, answer, link to the code it is about.
// A plain script rather than JSON, so the page also works when opened from disk.
// `backticks` in an answer render as code.
const LUCERNE = "https://github.com/jonastheiler/lucerne_temp/blob/main/";
const AVALANCHE = "https://github.com/jonastheiler/avalanche-llm/blob/main/";

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
  {
    repo: "avalanche-llm",
    q: "The SLF bulletins contain a `coreZoneText`. Why is it left out of the model input?",
    a: "It spells out the labels, e.g. \"Danger level 3+ on all aspects above 2000m\". With it in the input, the task becomes copying instead of reading the problem descriptions, and every score would be inflated. Checking each input field for what it reveals about the label is part of preventing leakage.",
    link: AVALANCHE + "src/avalanche_llm/dataset.py#L66-L68",
  },
  {
    repo: "avalanche-llm",
    q: "Why split train and test by winter, and drop test bulletins whose text appears in training?",
    a: "SLF reuses the same text across regions and days. A random split would put copies of a test text into training, so the scores would measure memorisation. Testing on a later winter (25/26) and removing any text seen in training makes every test bulletin new to the model. Texts that appear with different labels are dropped too: no model could get them right.",
    link: AVALANCHE + "src/avalanche_llm/dataset.py#L81-L98",
  },
  {
    repo: "avalanche-llm",
    q: "Why is the headline metric type + danger level F1, and not F1 over every field of a problem?",
    a: "Aspects and elevations are often not in the text at all: the forecasters set them directly. Requiring every field leaves all approaches near zero, so the score can't separate them. Type and level are what the text does describe. F1 balances problems that were missed against problems that were made up.",
    link: AVALANCHE + "src/avalanche_llm/evaluate.py#L52-L60",
  },
  {
    repo: "avalanche-llm",
    q: "The bootstrap confidence interval resamples a bulletin together with its translations. Why?",
    a: "The four language versions of a bulletin are not independent examples: a model that gets one right tends to get all four right. Resampling 1,200 rows as if independent would make the interval look narrower than it is. Resampling the 300 bulletins as groups keeps that dependence, giving about ±0.03.",
    link: AVALANCHE + "src/avalanche_llm/evaluate.py#L98-L118",
  },
  {
    repo: "avalanche-llm",
    q: "Qwen3-1.7B without fine-tuning scores exactly 0, while Haiku always returns valid JSON. Why the difference?",
    a: "Haiku is called with structured outputs (a JSON schema in `output_config`), so its answer is constrained to the schema. Qwen gets the same instructions but no such constraint, and answers in a list format instead of JSON. An answer that doesn't parse counts as a bulletin with no problems, so every true problem is missed. Fine-tuning on 100 examples is enough to teach the format.",
    link: AVALANCHE + "src/avalanche_llm/evaluate.py#L23-L41",
  },
  {
    repo: "avalanche-llm",
    q: "The keyword baseline finds problem types almost as well as Haiku (F1 0.746 vs 0.796), but its danger level is right only a third of the time. What does that show?",
    a: "The problem type is named in the text (\"Triebschnee\", \"wet snow\"), so keywords find it. The danger level has to be inferred from how the situation is described, and the rules can only fill in the most frequent level for that type. The level is where a language model earns its cost.",
    link: AVALANCHE + "src/avalanche_llm/baseline.py#L55-L80",
  },
  {
    repo: "avalanche-llm",
    q: "The calibrated prompt was clearly better on the validation set, but on the test set its gain wasn't significant. How can that happen?",
    a: "Three prompts were compared on the same 400 validation bulletins and the best one was kept. Picking the winner of several noisy scores favours the one that was lucky on that sample, so its validation score is biased upwards. The untouched test set gives the honest estimate. This is why the prompt was frozen before the test run.",
    link: AVALANCHE + "src/avalanche_llm/frontier.py#L57-L68",
  },
  {
    repo: "avalanche-llm",
    q: "What does LoRA train, and why does it make fine-tuning a 1.7B model possible on a free T4?",
    a: "The original weights stay frozen. Next to each linear layer, LoRA trains two small matrices whose product, a rank-16 update, is added to the layer's output. Here that is about 17M trainable weights, roughly 1% of the model. Gradients and Adam's optimizer state are only needed for those, which is what makes it fit in 16 GB.",
    link: AVALANCHE + "src/avalanche_llm/finetune.py#L24-L30",
  },
  {
    repo: "avalanche-llm",
    q: "Why are the prompt tokens labelled -100 during fine-tuning?",
    a: "-100 is the index PyTorch's cross-entropy ignores. The loss then covers only the JSON answer, so the model learns to produce answers, not to reproduce the system prompt, which is the same in every example and would otherwise dominate the loss.",
    link: AVALANCHE + "src/avalanche_llm/finetune.py#L55-L60",
  },
  {
    repo: "avalanche-llm",
    q: "Training uses batches of 8 bulletins but feeds them through the model 2 at a time. Why, and why is each loss multiplied by len(micro) / len(batch)?",
    a: "The logits hold a score for each of Qwen's 152k tokens at every position, and for 8 bulletins at once they don't fit in memory. Gradient accumulation runs the micro-batches one after another and adds up their gradients before a single optimizer step. Weighting each micro-batch's mean loss by its share of the batch makes that sum (about) the gradient of the whole batch.",
    link: AVALANCHE + "src/avalanche_llm/finetune.py#L81-L109",
  },
  {
    repo: "avalanche-llm",
    q: "On a T4, training runs in float16 with a GradScaler, but the LoRA weights are kept in float32. Why both?",
    a: "A T4 has no bfloat16, and float16 has a narrow range: small gradients round to zero. The GradScaler multiplies the loss before the backward pass and divides the gradients again before the step. The LoRA weights stay in float32 because an optimizer update is often tiny compared to the weight, and in float16 it would be rounded away.",
    link: AVALANCHE + "src/avalanche_llm/finetune.py#L73-L75",
  },
  {
    repo: "avalanche-llm",
    q: "Batched generation needs left padding and the KV cache. What does each do?",
    a: "Generation appends new tokens at the right end of each row. With right padding, the padding would sit between the prompt and the answer, so prompts are padded on the left. The KV cache stores the keys and values of all earlier tokens, so each new token only computes itself instead of the whole text again. Training had switched it off for gradient checkpointing.",
    link: AVALANCHE + "src/avalanche_llm/finetune.py#L112-L130",
  },
  {
    repo: "avalanche-llm",
    q: "Why is each training set the first n bulletins of one shuffle, so that 100 ⊂ 300 ⊂ 1,000?",
    a: "The learning curve should show the effect of more data. With independent draws, each size would also get a different, randomly easier or harder set of examples, and that noise would mix into the curve. With nested sets, the larger set only adds examples.",
    link: AVALANCHE + "src/avalanche_llm/finetune.py#L39-L43",
  },
  {
    repo: "avalanche-llm",
    q: "Fine-tuned Qwen ties Haiku at about the same cost per 1,000 bulletins. So when is the small model the better choice?",
    a: "When control matters: it runs on your own hardware, the data never leaves it, and it doesn't depend on an API. Here the 1,000 labels were free, because SLF publishes the structured fields. On most tasks they would have to be labelled by hand, and that would be the main cost of the small-model route. The project gives a rough budget: about 1,000 examples.",
    link: AVALANCHE + "README.md#what-the-results-show",
  },
];
