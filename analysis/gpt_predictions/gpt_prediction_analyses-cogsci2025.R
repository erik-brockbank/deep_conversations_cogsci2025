
#
# Analyses of GPT prediction data for publication in Cog Sci 2025
#


# INIT ----
rm(list = ls())
setwd(dirname(rstudioapi::getSourceEditorContext()$path))

library(brms)
library(tidyverse)


# GLOBALS ----
ALL_QUESTIONS_DATA = '../../data/gpt_predictions/all_questions/gpt-4o'
DEEP_SHALLOW_DATA = '../../data/gpt_predictions/deep_shallow_contrast/gpt-4o'
FIGURE_PATH = '../../results/gpt_predictions'

# ggplot theme
default_plot_theme = theme(
  # titles
  plot.title = element_text(face = 'bold', size = 32, family = 'Charter', margin = margin(b = 0.5, unit = 'line')),
  axis.title.y = element_text(face = 'bold', size = 32, family = 'Charter', margin = margin(r = 0.5, unit = 'line')),
  axis.title.x = element_text(face = 'bold', size = 32, family = 'Charter', margin = margin(t = 0.5, unit = 'line')),
  legend.title = element_text(face = 'bold', size = 24, family = 'Charter'),
  # axis text
  axis.text.x = element_text(size = 20, face = 'bold', angle = 0, vjust = 1, family = 'Charter', margin = margin(t = 0.5, unit = 'line'), color = 'black'),
  axis.text.y = element_text(size = 20, face = 'bold', family = 'Charter', margin = margin(r = 0.5, unit = 'line'), color = 'black'),
  # legend text
  legend.text = element_text(size = 24, face = 'bold', family = 'Charter', margin = margin(b = 0.5, unit = 'line')),
  # facet text
  strip.text = element_text(size = 12, family = 'Charter'),
  # backgrounds, lines
  panel.background = element_blank(),
  strip.background = element_blank(),
  panel.grid = element_line(color = 'gray'),
  axis.line = element_line(color = 'black'),
  panel.grid.major.x = element_blank(),
  panel.grid.minor.x = element_blank(),
  panel.grid.major.y = element_blank(),
  panel.grid.minor.y = element_blank(),
  # positioning
  legend.position = 'bottom',
  legend.key = element_rect(colour = 'transparent', fill = 'transparent')
)


# READ DATA ----
gpt_data_all_q = read_csv(paste(ALL_QUESTIONS_DATA, 'model_predictions.csv', sep = '/'))
glimpse(gpt_data_all_q)

gpt_data_deep_shallow = read_csv(paste(DEEP_SHALLOW_DATA, 'model_predictions.csv', sep = '/'))
glimpse(gpt_data_deep_shallow)


# PROCESS DATA ----

# How many successful and unsuccessful predictions do we have?
# All questions
table(gpt_data_all_q$scaleResponsePredictionSuccess)
sum(is.na(gpt_data_all_q$scaleResponsePredictionSuccess))
# Deep-shallow contrast
table(gpt_data_deep_shallow$scaleResponsePredictionSuccess)
sum(is.na(gpt_data_deep_shallow$scaleResponsePredictionSuccess))


# Select only data for which the GPT prediction was a success
gpt_all_q_clean = gpt_data_all_q |>
  filter(scaleResponsePredictionSuccess == 1)

gpt_deep_shallow_clean = gpt_data_deep_shallow |>
  filter(scaleResponsePredictionSuccess == 1)


# FIGURE: Correlation (all questions) ----

# Correlation
cor.test(gpt_all_q_clean$scaleResponsePrediction, gpt_all_q_clean$scaleResponse)

# Figure
scale_color = '#0968AF'
correlation_summary_fig = gpt_all_q_clean |>
  mutate(
    # NB: nested casting here to get the bin as a numeric value so we can plot the underlying data behind this if we want
    scaleResponseBin = as.numeric(as.character(
      cut(
        scaleResponsePrediction,
        breaks = seq(0, 105, by = 5),
        labels = as.character(seq(0, 105, by = 5))[-length(seq(0, 105, by = 5))],
        right = F # ensures that e.g. 60 and 61+ are in same bin (open at left end, closed at right)
      )
    ))
  ) |>
  ggplot(
    aes(
      x = scaleResponseBin,
      y = scaleResponse
    )
  ) +
  stat_summary(
    fun.data = 'mean_cl_boot',
    size = 1.1,
    linewidth = 1,
    color = scale_color
  ) +
  geom_jitter(
    data = gpt_all_q_clean,
    aes(x = scaleResponsePrediction, y = scaleResponse),
    size = 1,
    alpha = 0.1,
    width = 1, # NB: toggle width to better emphasize distribution (GPT predictions sit mostly at 5/10 intervals)
    color = scale_color
  ) +
  geom_abline(
    linewidth = 1.0,
    linetype = 'dashed'
  ) +
  scale_x_continuous(
    name = 'model prediction',
    breaks = seq(0, 100, by = 10),
    labels = seq(0, 100, by = 10),
    limits = c(-1, 101)
  ) +
  scale_y_continuous(
    name = 'response',
    breaks = seq(0, 100, by = 10),
    labels = seq(0, 100, by = 10),
    limits = c(-1, 101)
  ) +
  default_plot_theme

# View figure
correlation_summary_fig
# Save figure
ggsave(
  correlation_summary_fig,
  filename = 'gpt_subject_correlations.pdf',
  path = FIGURE_PATH,
  device = cairo_pdf,
  width = 8,
  height = 7,
)


# ANALYSIS: Model predictions (all questions) ----

# BRMS comparison: does model prediction help predict people's response?
# NB: both models below take several minutes to fit
m0_file = 'brms_fits/all_qs_baseline'
m0_brms = brm(
  data = gpt_all_q_clean,
  formula = scaleResponse ~ 1 + (1 | prolificID) + (1 | scaleID),
  file = m0_file,
  seed = 1,
  iter = 10000 # NB: need extra iters to ensure convergence
)
m1_file = 'brms_fits/all_qs_main_effect'
m1_brms = brm(
  data = gpt_all_q_clean,
  formula = scaleResponse ~ 1 + scaleResponsePrediction + (1 + scaleResponsePrediction | prolificID) + (1 + scaleResponsePrediction | scaleID),
  file = m1_file,
  seed = 1,
  iter = 10000
)

# Leave-one-out comparison for each model
# NB: this takes several mins to run
m0_brms = add_criterion(
  m0_brms,
  criterion = 'loo',
  reloo = T,
  file = m0_file
)
m1_brms = add_criterion(
  m1_brms,
  criterion = 'loo',
  reloo = T,
  file = m1_file
)
loo_compare(m0_brms, m1_brms)


# ANALYSIS: Shuffled MSE (all questions) ----

# Shuffle predictions across participants:
# Resamples prolificID, then grabs *all* slider responses for each participant in shuffled order,
# while retaining original written response order.
# NOTE when swapping in shuffled participant slider data, we have to match scale ID to ensure
# scales presented in different orders are assigned to their matched question

# Arrange rows in order of prolificID then scaleID
# NB: we NEED this to ensure that scale IDs are matched when we shuffle at participant level below
gpt_all_q_clean = gpt_all_q_clean |>
  arrange(
    prolificID,
    scaleID
  )

get_mse_subj = function(data) {
  # Resample participants and make new dataframe to hold shuffled participant responses
  orig_IDs = unique(data$prolificID)
  resampled_IDs = sample(unique(data$prolificID))
  new_df = data.table::copy(data)
  # Replace original participant responses by fetching participant responses at corresponding index from shuffled list
  for (i in 1:length(orig_IDs)) {
    new_df$scaleResponse[new_df$prolificID == orig_IDs[i]] = data$scaleResponse[data$prolificID == resampled_IDs[i]]
  }
  # Calculate shuffled MSE
  new_df = new_df |>
    rowwise() |>
    mutate(
      shuffled_squared_error = (scaleResponse - scaleResponsePrediction)^2
    )
  mean(new_df$shuffled_squared_error)
}
# Run nsims shuffled MSE calculations
nsims = 1000 # NB: 1000 sims ~ 1min
simulations = data.frame(
  'simulation' = seq(1, nsims),
  'mean_shuffled_squared_error' = replicate(
    nsims,
    get_mse_subj(gpt_all_q_clean)
  )
)
# Summarize the above
simulations |>
  summarize(
    mean_mse = mean(mean_shuffled_squared_error),
    min_mse = min(mean_shuffled_squared_error),
    max_mse = max(mean_shuffled_squared_error),
    sd_mse = sd(mean_shuffled_squared_error),
    sims = n(),
    se_mse = sd(mean_shuffled_squared_error) / sqrt(n())
  )
# Compare to empirical prediction squared error
gpt_all_q_clean$prediction_squared_error = (gpt_all_q_clean$scaleResponse - gpt_all_q_clean$scaleResponsePrediction)^2
mean(gpt_all_q_clean$prediction_squared_error)

# Sanity check: plot empirical MSE and shuffled MSE distribution above
simulations |>
  ggplot(aes(x = mean_shuffled_squared_error)) +
  geom_density(
    linewidth = 1,
    fill = 'lightgray'
  ) +
  geom_vline(
    xintercept = mean(gpt_all_q_clean$prediction_squared_error),
    color = 'red',
    linewidth = 1
  ) +
  scale_x_continuous(
    name = 'mean squared error'
  ) +
  default_plot_theme


# FIGURE: log MSE (deep-shallow contrast) ----

# Add empirical squared prediction error
gpt_deep_shallow_clean$prediction_squared_error = (gpt_deep_shallow_clean$scaleResponse - gpt_deep_shallow_clean$scaleResponsePrediction)^2

# Subject MSE summary
subject_mse = gpt_deep_shallow_clean |>
  group_by(prolificID, scaleResponseEvidence) |>
  summarize(
    log_MSE = log10(mean(prediction_squared_error))
  ) |>
  ungroup()

# Figure
condition_colors = c(
  'personal' = '#C8A2C8',
  'small talk' = '#8FB0A9'
)
subject_mse_fig = subject_mse |>
  ggplot(
    aes(
      x = log_MSE,
      color = scaleResponseEvidence,
      fill = scaleResponseEvidence,
    )
  ) +
  geom_density(
    linewidth = 1,
    alpha = 0.25
  ) +
  geom_vline(
    xintercept = mean(subject_mse$log_MSE[subject_mse$scaleResponseEvidence == 'personal']),
    color = condition_colors['personal'],
    linewidth = 1,
    linetype = 'dashed'
  ) +
  geom_vline(
    xintercept = mean(subject_mse$log_MSE[subject_mse$scaleResponseEvidence == 'small talk']),
    color = condition_colors['small talk'],
    linewidth = 1,
    linetype = 'dashed'
  ) +
  scale_x_continuous(
    name = 'log mean squared error'
  ) +
  scale_fill_manual(
    name = element_blank(),
    values = condition_colors
  ) +
  scale_color_manual(
    name = element_blank(),
    values = condition_colors
  ) +
  default_plot_theme +
  theme(
    axis.title.y = element_blank(),
    axis.text.y = element_blank(),
    axis.ticks.y = element_blank(),
    axis.line.y = element_blank()
  )

# View figure
subject_mse_fig
# Save figure
ggsave(
  subject_mse_fig,
  filename = 'deep_shallow_error_comparison.pdf',
  path = FIGURE_PATH,
  device = cairo_pdf,
  width = 6,
  height = 6,
)


# ANALYSIS: Shuffled MSE (deep-shallow contrast) ----

# Separate out "deep" and "shallow" conditions
gpt_deep_only = gpt_deep_shallow_clean |>
  filter(scaleResponseEvidence == 'personal') |>
  arrange(
    prolificID,
    scaleID
  )
gpt_shallow_only = gpt_deep_shallow_clean |>
  filter(scaleResponseEvidence == 'small talk') |>
  arrange(
    prolificID,
    scaleID
  )

# Run nsims shuffled MSE calculations for deep questions only
# NB: uses same `get_mse_subj` function defined above
simulations_deep_only = data.frame(
  'simulation' = seq(1, nsims), # NB: nsims = 1000 ~ 1min
  'mean_shuffled_squared_error' = replicate(
    nsims,
    get_mse_subj(gpt_deep_only)
  )
)

# Summarize deep questions simulated MSE
simulations_deep_only |>
  summarize(
    mean_mse = mean(mean_shuffled_squared_error),
    min_mse = min(mean_shuffled_squared_error),
    max_mse = max(mean_shuffled_squared_error),
    sd_mse = sd(mean_shuffled_squared_error),
    sims = n(),
    se_mse = sd(mean_shuffled_squared_error) / sqrt(n())
  )

# Compare observed to simulations:
mean(gpt_deep_only$prediction_squared_error)

# Sanity check: plot empirical MSE and shuffled MSE distribution
simulations_deep_only |>
  ggplot(aes(x = mean_shuffled_squared_error)) +
  geom_density(
    linewidth = 1,
    fill = 'lightgray'
  ) +
  geom_vline(
    xintercept = mean(gpt_deep_only$prediction_squared_error),
    color = 'red',
    linewidth = 1
  ) +
  scale_x_continuous(
    name = 'mean squared error (personal questions)'
  ) +
  default_plot_theme

# Run nsims shuffled MSE calculations for small talk questions only
# NB: uses same `get_mse_subj` function defined above
simulations_small_talk_only = data.frame(
  'simulation' = seq(1, nsims), # NB: nsims = 1000 ~ 1min
  'mean_shuffled_squared_error' = replicate(
    nsims,
    get_mse_subj(gpt_shallow_only)
  )
)

# Summarize small talk questions simulated MSE
simulations_small_talk_only |>
  summarize(
    mean_mse = mean(mean_shuffled_squared_error),
    min_mse = min(mean_shuffled_squared_error),
    max_mse = max(mean_shuffled_squared_error),
    sd_mse = sd(mean_shuffled_squared_error),
    sims = n(),
    se_mse = sd(mean_shuffled_squared_error) / sqrt(n())
  )

# Compare observed to simulations:
mean(gpt_shallow_only$prediction_squared_error)

# Sanity check: plot empirical MSE and shuffled MSE distribution
simulations_small_talk_only |>
  ggplot(aes(x = mean_shuffled_squared_error)) +
  geom_density(
    linewidth = 1,
    fill = 'lightgray'
  ) +
  geom_vline(
    xintercept = mean(gpt_deep_only$prediction_squared_error),
    color = 'red',
    linewidth = 1
  ) +
  scale_x_continuous(
    name = 'mean squared error (small talk questions)'
  ) +
  default_plot_theme


# ANALYSIS: Model predictions (deep-shallow contrast) ----

# BRMS comparison: does model prediction error differ across question category ("deep", "shallow")?
# NB: both models below take several minutes to fit
m0_file = 'brms_fits/deep_shallow_baseline'
m0_brms = brm(
  data = gpt_deep_shallow_clean,
  formula = prediction_squared_error ~ 1 + (1 | prolificID) + (1 | scaleID),
  file = m0_file,
  seed = 1
)
m1_file = 'brms_fits/deep_shallow_main_effect'
m1_brms = brm(
  data = gpt_deep_shallow_clean,
  formula = prediction_squared_error ~ 1 + scaleResponseEvidence + (1 + scaleResponseEvidence | prolificID) + (1 + scaleResponseEvidence | scaleID),
  file = m1_file,
  seed = 1
)

# Leave-one-out comparison for each model
m0_brms = add_criterion(
  m0_brms,
  criterion = 'loo',
  reloo = T,
  file = m0_file
)
m1_brms = add_criterion(
  m1_brms,
  criterion = 'loo',
  reloo = T,
  file = m1_file
)
loo_compare(m0_brms, m1_brms)
emmeans(m1_brms, 'scaleResponseEvidence')
