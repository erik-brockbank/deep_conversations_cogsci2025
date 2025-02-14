
#
# Analyses of experiment 1 data for initial submission to Cog Sci 2025
#


# INIT ----
rm(list = ls())
setwd(dirname(rstudioapi::getSourceEditorContext()$path))

library(psych) # used for factor analysis
library(tidyverse)


# GLOBALS ----
DATA_PATH = '../../data/experiment_1'
TRIAL_DATA = 'trial_data.csv'
SURVEY_DATA = 'survey_data.csv'
FIGURE_PATH = '../../results/experiment_1'

QUESTION_CATEGORY_COLORS = c(
  'personal' = '#C8A2C8',
  'small talk' = '#8FB0A9'
)

default_plot_theme = theme(
  # titles
  plot.title = element_text(size = 32, family = "Charter", margin = margin(b = 0.5, unit = "line")),
  axis.title.y = element_text(size = 32, family = "Charter", margin = margin(r = 0.5, unit = "line")),
  axis.title.x = element_text(size = 32, family = "Charter", margin = margin(t = 0.5, unit = "line")),
  legend.title = element_text(size = 24, family = "Charter"),
  # axis text
  axis.text.x = element_text(size = 20, angle = 0, vjust = 1, family = "Charter", margin = margin(t = 0.5, unit = "line"), color = "black"),
  axis.text.y = element_text(size = 20, family = "Charter", margin = margin(r = 0.5, unit = "line"), color = "black"),
  # legend text
  legend.text = element_text(size = 24, family = "Charter", margin = margin(b = 0.5, unit = "line")),
  # facet text
  strip.text = element_text(size = 12, family = "Charter"),
  # backgrounds, lines
  panel.background = element_blank(),
  strip.background = element_blank(),
  panel.grid = element_line(color = "gray"),
  axis.line = element_line(color = "black"),
  panel.grid.major.x = element_blank(),
  panel.grid.minor.x = element_blank(),
  panel.grid.major.y = element_blank(),
  panel.grid.minor.y = element_blank(),
  # positioning
  legend.position = "bottom",
  legend.key = element_rect(colour = "transparent", fill = "transparent")
)



# READ DATA ----
trial_data = read_csv(paste(DATA_PATH, TRIAL_DATA, sep = '/'))
glimpse(trial_data)
survey_data = read_csv(paste(DATA_PATH, SURVEY_DATA, sep = '/'))
glimpse(survey_data)


# EXCLUSIONS ----
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

# Remove exclusion participants identified above
trial_data = trial_data |>
  filter(!(prolificID %in% attention_exclusions$prolificID))
n_distinct(trial_data$prolificID)


# DEMOGRAPHICS ----

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


# FACTOR ANALYSIS ----

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
glimpse(eval_matrix)


fa_evals_metadata = eval_matrix |> select(questionID, question, questionCategory)
fa_evals = fa(r = eval_matrix |> select(!c(questionID, question, questionCategory)),
              nfactors = 9,
              rotate = 'none',
              fm = 'ml', # 'minres' similar
              scores = 'regression'
)
fa_evals
fa_evals$loadings


# FACTOR PROJECTIONS ----
# Make wide dataframe with individual responses
trial_data_wide = trial_data |>
  filter(questionCategory != 'comprehension check') |>
  pivot_wider(
    id_cols = c(prolificID, questionID, question, questionCategory),
    names_from = c(scaleID),
    values_from = c(response)

  )
glimpse(trial_data_wide)
# Add columns with factor projections
k_factors = 3
trial_projections = trial_data_wide |>
  select(prolificID, questionID, question, questionCategory) |>
  cbind(
    data.frame(
      as.matrix(trial_data_wide |> select(!c(prolificID, questionID, question, questionCategory))) %*%
        as.matrix(fa_evals$loadings[, 1:k_factors])
    )
  )
glimpse(trial_projections)



# FIGURE Scale responses on 1st factor (subset of questions) ----

# Show only subset of questions
questionID_shortshortlist = c(
  111, # past self, current self
  41, # relive any day
  213, # hotels
  192 # best pair of shoes
)

trial_projections_subset = trial_projections |>
  filter(questionID %in% questionID_shortshortlist) |>
  rename(
    'factor 1' = ML1,
    'factor 2' = ML2,
    'factor 3' = ML3
  ) |>
  # Re-scale to match original scale
  mutate(
    `factor 1` = `factor 1` / 9,
    `factor 2` = `factor 2` / 9,
    `factor 3` = `factor 3` / 9
  )
trial_projections_subset$questionID = factor(trial_projections_subset$questionID,
                                             levels = questionID_shortshortlist)


# 95% CI
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
    # width = 0
  ) +
  stat_summary(
    fun.data = 'mean_cl_boot',
    size = 1.5,
    linewidth = 1
  ) +
  geom_text(
    data = trial_projections_subset |>
      group_by(questionID, questionCategory, question) |>
      summarize(mean_resp = mean(`factor 1`)) |>
      ungroup(),
    aes(
      x = questionID,
      y = mean_resp,
      label = question
    ),
    vjust = -2,
    size = 4
  ) +
  scale_x_discrete(
    name = element_blank(),
  ) +
  scale_y_continuous(
    name = 'question depth',
    breaks = seq(0, 100, by = 25),
    labels = seq(0, 100, by = 25),
    limits = c(0, 100)
  ) +
  scale_color_manual(
    name = element_blank(),
    values = QUESTION_CATEGORY_COLORS
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

