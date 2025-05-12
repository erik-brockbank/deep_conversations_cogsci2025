
#
# Analyses of experiment 1 data for publication in Cog Sci 2025
#


# INIT ----
rm(list = ls())
setwd(dirname(rstudioapi::getSourceEditorContext()$path))

library(tidyverse)


# GLOBALS ----
DATA_PATH = '../../data/experiment_1'
TRIAL_DATA = 'trial_data.csv'
SURVEY_DATA = 'survey_data.csv'
FIGURE_PATH = '../../results/experiment_1'

# ggplot theme
default_plot_theme = theme(
  # titles
  plot.title = element_text(size = 32, family = 'Charter', margin = margin(b = 0.5, unit = 'line')),
  axis.title.y = element_text(size = 32, family = 'Charter', margin = margin(r = 0.5, unit = 'line')),
  axis.title.x = element_text(size = 32, family = 'Charter', margin = margin(t = 0.5, unit = 'line')),
  legend.title = element_text(size = 24, family = 'Charter'),
  # axis text
  axis.text.x = element_text(size = 20, angle = 0, vjust = 1, family = 'Charter', margin = margin(t = 0.5, unit = 'line'), color = 'black'),
  axis.text.y = element_text(size = 20, family = 'Charter', margin = margin(r = 0.5, unit = 'line'), color = 'black'),
  # legend text
  legend.text = element_text(size = 24, family = 'Charter', margin = margin(b = 0.5, unit = 'line')),
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
trial_data = read_csv(paste(DATA_PATH, TRIAL_DATA, sep = '/'))
glimpse(trial_data)

survey_data = read_csv(paste(DATA_PATH, SURVEY_DATA, sep = '/'))
glimpse(survey_data)


# EXCLUSIONS ----
# Exclude participants who did not pass the attention check trials
attention_exclusions = trial_data |>
  filter(questionCategory == 'comprehension check') |>
  rowwise() |>
  mutate(
    comprehensionCheckDiff = comprehensionCheckRequestedResponse - response
  ) |>
  filter(
    comprehensionCheckDiff != 0
  ) |>
  select(subjectID, prolificID, comprehensionCheckRequestedResponse, response, comprehensionCheckDiff) |>
  # how many unique participants is this?
  select(prolificID) |>
  unique()
attention_exclusions

# Remove participants identified above
trial_data = trial_data |>
  filter(!(prolificID %in% attention_exclusions$prolificID))


# DEMOGRAPHICS ----
# NB: completion time and payment data reported alongside demographics came from Prolific experiment summary

# Total participants
n_distinct(trial_data$prolificID)

# Add survey demographic data to trial data
trial_data = trial_data |>
  left_join(
    survey_data,
    by = c('subjectID', 'prolificID', 'studyID', 'sessionID', 'DEBUG')
  )

# Age
summary(trial_data$age)

# Gender
trial_data |>
  group_by(gender) |>
  summarize(
    participants = n_distinct(prolificID)
  ) |>
  ungroup()

# Race
trial_data |>
  group_by(race) |>
  summarize(
    participants = n_distinct(prolificID)
  ) |>
  ungroup()


# ANALYSIS: Reliability (Cronbach's alpha) ----

# Convert trial data to wide format matrix with only relevant columns
trial_response_matrix = as.matrix(
  trial_data |>
    filter(questionCategory != 'comprehension check') |>
    select(
      prolificID,
      questionID, question, questionCategory,
      scaleID, scaleText,
      response
    ) |>
    pivot_wider(
      id_cols = c(prolificID, questionID, question, questionCategory),
      names_from = c(scaleText),
      values_from = c(response)
    ) |>
    select(!c(prolificID, questionID, question, questionCategory))
)
# sanity checks
dim(trial_response_matrix)
colnames(trial_response_matrix)

# Calculate Cronbach's alpha
cronbach_alpha = ltm::cronbach.alpha(
  trial_response_matrix,
  standardized = FALSE,
  CI = TRUE
)
cronbach_alpha


# ANALYSIS: Factor analysis ----

# Average response for each question, scale combination
item_summary = trial_data |>
  filter(questionCategory != 'comprehension check') |>
  group_by(questionID, question, questionCategory, scaleID, scaleText) |>
  summarize(
    subjects = n(),
    response_mean = mean(response),
    response_sd = sd(response),
    response_var = var(response),
    response_se = sd(response) / sqrt(subjects)
  ) |>
  ungroup()
# sanity checks
glimpse(item_summary)

# Get evaluation matrix: m questions x q scales
eval_matrix = item_summary |>
  pivot_wider(
    id_cols = c(questionID, question, questionCategory),
    names_from = c(scaleID),
    values_from = c(response_mean)
  ) |>
  select(
    questionID, question, questionCategory,
    `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`
  )
# sanity checks
glimpse(eval_matrix)

# Calculate factor analysis
fa_evals_metadata = eval_matrix |> select(questionID, question, questionCategory)
fa_evals = psych::fa(
  r = eval_matrix |> select(!c(questionID, question, questionCategory)),
  nfactors = 9,
  rotate = 'none',
  fm = 'ml',
  scores = 'regression'
)
# sanity checks
fa_evals
fa_evals$loadings


# FIGURE: Factor loadings ----

# Add shortened question text
question_format = c(
  'How personal is this question?' = 'how PERSONAL...?',
  'How informative is this question?' = 'how INFORMATIVE...?',
  'How deep is this question?' = 'how DEEP...?',
  'If you asked this question to someone you just met, how much do you think their answer would help you get to know them better (assuming they provided an honest answer)?' = '...would help you GET TO KNOW them?',
  'If someone you just met asked you this question, how much do you think your answer would help them get to know you better (assuming you provided an honest answer)?' = '...would help them GET TO KNOW you?',
  'If you asked this question to someone you just met, how much do you think you would learn about them (assuming they provided an honest answer)?' = '...how much would you LEARN about them?',
  'If someone you just met asked you this question, how much do you think they would learn about you (assuming you provided an honest answer)?' = '...how much would they LEARN about you?',
  'If you asked this question to someone you just met, how close would you feel with them upon hearing their answer (assuming they provided an honest answer)?' = '...how CLOSE would you feel after hearing their answer?',
  'If someone you just met asked you this question, how close would you feel with them after sharing your answer (assuming you provided an honest answer)?' = '...how CLOSE would you feel after sharing your answer?'
)
question_format_order = c(
  '...how CLOSE would you feel after sharing your answer?',
  '...how CLOSE would you feel after hearing their answer?',
  '...how much would they LEARN about you?',
  '...how much would you LEARN about them?',
  '...would help them GET TO KNOW you?',
  '...would help you GET TO KNOW them?',
  'how INFORMATIVE...?',
  'how DEEP...?',
  'how PERSONAL...?'
)

# Make dataframe with factor loadings above and shortened question text
loadings_df = as.data.frame(
  unclass(fa_evals$loadings[,1:3])
  ) |>
  mutate(
    scaleID = as.numeric(rownames(fa_evals$loadings))
  ) |>
  left_join(
    item_summary |> select(scaleID, scaleText) |> distinct(),
    by = c('scaleID')
  ) |>
  mutate(
    scaleTextFormatted = factor(question_format[scaleText], levels = question_format_order)
  ) |>
  rename(
    'factor 1' = ML1,
    'factor 2' = ML2,
    'factor 3' = ML3,
  ) |>
  pivot_longer(
    cols = !c('scaleID', 'scaleText', 'scaleTextFormatted')
  )
# sanity checks
glimpse(loadings_df)

# Figure
loadings_fig = loadings_df |>
  ggplot(
    aes(
      x = scaleTextFormatted,
      y = factor(name, levels = c('factor 3', 'factor 2', 'factor 1')),
      fill = value
    )
  ) +
  geom_tile(
    color = 'white',
    lwd = 1.5,
    linetype = 1
  ) +
  geom_text(
    aes(label = round(value, 2)),
    color = 'black',
    size = 4,
    family = 'Charter'
  ) +
  coord_fixed() +
  scale_y_discrete(
    name = element_blank()
  ) +
  scale_x_discrete(
    name = element_blank(),
    limits = rev(question_format_order)
  ) +
  # can futz with this
  scale_fill_gradientn(
    name = element_blank(),
    colors = c('#A51122', '#FAEDA9', '#76B345', '#006228'),
    # NB: this specifies "position" in range (0, 1) where colors above must be
    values = c(0, .14, 0.5, 1)
  ) +
  default_plot_theme +
  theme(
    axis.text.x = element_text(size = 10, angle = 90, family = 'Charter', margin = margin(r = 0.5, unit = 'line'), color = 'black'),
    axis.line = element_blank(),
    axis.ticks = element_blank(),
    legend.position = 'none'
  )

# View figure
loadings_fig
# Save figure
ggsave(
  loadings_fig,
  filename = 'factor_loadings.pdf',
  path = FIGURE_PATH,
  device = cairo_pdf,
  width = 6,
  height = 6,
)


# FIGURE: Scale responses on 1st factor (subset of questions) ----

# Make wide dataframe with individual responses
trial_data_wide = trial_data |>
  # make wide dataframe w individual responses
  filter(questionCategory != 'comprehension check') |>
  pivot_wider(
    id_cols = c(prolificID, questionID, question, questionCategory),
    names_from = c(scaleID),
    values_from = c(response)

  )
# sanity checks
glimpse(trial_data_wide)

# Project responses onto first 3 factors
k_factors = 3
trial_projections = trial_data_wide |>
  select(prolificID, questionID, question, questionCategory) |>
  cbind(
    data.frame(
      as.matrix(trial_data_wide |> select(!c(prolificID, questionID, question, questionCategory))) %*%
        as.matrix(fa_evals$loadings[, 1:k_factors])
    )
  )
# sanity checks
glimpse(trial_projections)

# Show only subset of questions
questionID_shortshortlist = c(
  111, # past self, current self
  41, # relive any day
  213, # hotels
  192 # best pair of shoes
)

# Select subset of questions above
trial_projections_subset = trial_projections |>
  filter(questionID %in% questionID_shortshortlist) |>
  rename(
    'factor 1' = ML1,
    'factor 2' = ML2,
    'factor 3' = ML3
  ) |>
  # Re-scale to match original scale magnitudes
  mutate(
    `factor 1` = `factor 1` / 9,
    `factor 2` = `factor 2` / 9,
    `factor 3` = `factor 3` / 9
  )

# Order question subset
trial_projections_subset$questionID = factor(
  trial_projections_subset$questionID,
  levels = questionID_shortshortlist
)

# Add question text shorthand
questionAbbrevs = c(
  'What would your past self think of your current self? Would you say a lot has changed regarding how you think about the world and what you believe in?' =
    'What would your past self think of your current self?',
  'If you were given the chance to relive any day in your life, do you know which day it would be? What happened?' =
    'Given the chance to relive any day in your life, which would it be?',
  'Do you enjoy staying in hotels? What do you like or not like about them?' =
    'Do you enjoy staying in hotels?',
  'What’s the best pair of shoes you own or have owned? What makes them awesome?' =
    'What’s the best pair of shoes you own or have owned?'
)
trial_projections_subset = trial_projections_subset |>
  mutate(
    questionAbbrev = questionAbbrevs[question]
  )
# sanity checks
glimpse(trial_projections_subset)

# Figure
question_category_colors = c(
  'personal' = '#C8A2C8',
  'small talk' = '#8FB0A9'
)
projections_fig = trial_projections_subset |>
  ggplot(
    aes(
      x = questionID,
      y = `factor 1`,
      color = questionCategory
    ),
  ) +
  # offset jitter: helpful but only works on Y-axis
  gghalves::geom_half_point(
    side = 'l',
    size = 3,
    alpha = 0.5,
    range_scale = 0.2
  ) +
  stat_summary(
    fun.data = 'mean_cl_boot',
    size = 1.5,
    linewidth = 1
  ) +
  geom_text(
    data = trial_projections_subset |>
      group_by(questionID, questionCategory, questionAbbrev) |>
      summarize(mean_resp = mean(`factor 1`)) |>
      ungroup(),
    aes(
      x = questionID,
      y = mean_resp,
      label = questionAbbrev
    ),
    vjust = -2,
    size = 5.5,
    family = 'Charter'
  ) +
  scale_x_discrete(
    name = element_blank(),
  ) +
  scale_y_continuous(
    name = 'factor 1 (question depth)',
    breaks = seq(0, 100, by = 25),
    labels = seq(0, 100, by = 25),
    limits = c(0, 100)
  ) +
  scale_color_manual(
    name = element_blank(),
    values = question_category_colors
  ) +
  default_plot_theme +
  theme(
    # remove legend
    legend.position = 'none',
    # remove Y axis
    axis.text.y = element_blank(),
    axis.ticks.y = element_blank(),
    axis.line.y = element_blank(),
    # change color of X axis
    axis.text.x = element_text(color = '#7d7d7d'),
    axis.ticks.x = element_line(color = '#7d7d7d'),
    axis.line.x = element_line(color = '#7d7d7d'),
    axis.title.x = element_text(color = '#7d7d7d')
  ) +
  coord_flip()

# View figure
projections_fig
# Save figure
ggsave(
  projections_fig,
  filename = 'question_subset_factor1.pdf',
  path = FIGURE_PATH,
  device = cairo_pdf,
  width = 12,
  height = 6,
)
