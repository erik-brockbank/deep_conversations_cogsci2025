
#
# Analyses of experiment 2 data for publication in Cog Sci 2025
#


# INIT ----
rm(list = ls())
setwd(dirname(rstudioapi::getSourceEditorContext()$path))

library(emmeans)
library(lme4)
library(tidyverse)


# GLOBALS ----
DATA_PATH = '../../data/experiment_2'
SURVEY_DATA = 'survey_data.csv'
SCALE_DATA = 'scale_data.csv'
TEXT_DATA = 'text_data.csv'
FIGURE_PATH = '../../results/experiment_2'

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
survey_data = read_csv(paste(DATA_PATH, SURVEY_DATA, sep = '/'))
glimpse(survey_data)

scale_data = read_csv(paste(DATA_PATH, SCALE_DATA, sep = '/'))
glimpse(scale_data)

text_data = read_csv(paste(DATA_PATH, TEXT_DATA, sep = '/'))
glimpse(text_data)


# EXCLUSIONS: Attention check failures ----
# Exclude participants who failed to respond correctly to attention checks

# Summarize responses to attention check questions
# How far off were people who didn't choose the requested values?
attention_check_failures = scale_data |>
  filter(comprehensionCheck == 1) |>
  rowwise() |>
  mutate(
    comprehensionCheckDiff = comprehensionCheckRequestedResponse - response
  ) |>
  filter(
    comprehensionCheckDiff != 0
  ) |>
  select(prolificID, comprehensionCheckRequestedResponse, response, comprehensionCheckDiff) |> distinct()
attention_check_failures

# Make list of exclusions based on data above
# NB: keeping the person who had a diff of 3 and went the opposite direction on the other
attention_check_exclusion_IDs = c(
  '674ef0fd10320249899eff81',
  '6776af33bce81aa216b597e8',
  '678e1891053ba515ea427700',
  '677a967cc67b8280716e66e7',
  '678a34fce71acda92126acbf'
)

# Remove exclusions above
scale_data = scale_data |> filter(!(prolificID %in% attention_check_exclusion_IDs))
text_data = text_data |> filter(!(prolificID %in% attention_check_exclusion_IDs))
survey_data = survey_data |> filter(!(prolificID %in% attention_check_exclusion_IDs))


# EXCLUSIONS: AI responses ----
# Remove anybody who was obviously using LLMs or may have been a bot

# What did people say to each question?
# NB: toggle the index `idx` in each of the calls below to print each successive question and the responses
questionIDs = unique(text_data$questionID)
idx = 11 # 1-indexed, max = 12
unique(text_data$questionText[text_data$questionID == questionIDs[idx]])
unique(text_data$response[text_data$questionID == questionIDs[idx]])

# NB: strange responses from one participant, viewing their full response set here
unique(text_data$response[text_data$prolificID == '678b785febfcc8066ee47f94'])

# Remove this person
text_exclusion_IDs = c(
  '678b785febfcc8066ee47f94'
)
scale_data = scale_data |> filter(!(prolificID %in% text_exclusion_IDs))
text_data = text_data |> filter(!(prolificID %in% text_exclusion_IDs))
survey_data = survey_data |> filter(!(prolificID %in% text_exclusion_IDs))


# EXCLUSIONS: Write clean data to CSV ----
# NB: need processed data for GPT pipeline so GPT only predicts participants who were included in analyses
write_csv(text_data, paste(DATA_PATH, 'text_data_processed.csv', sep='/'))
write_csv(scale_data, paste(DATA_PATH, 'scale_data_processed.csv', sep='/'))
write_csv(survey_data,  paste(DATA_PATH, 'survey_data_processed.csv', sep='/'))


# DEMOGRAPHICS ----

# Total participants
n_distinct(scale_data$prolificID)
n_distinct(text_data$prolificID)

# Add survey demographic data to scale data
scale_data = scale_data |>
  left_join(
    survey_data,
    by = c('subjectID', 'prolificID', 'studyID', 'sessionID', 'DEBUG')
  )
# Add survey demographic data to text data
text_data = text_data |>
  left_join(
    survey_data,
    by = c('subjectID', 'prolificID', 'studyID', 'sessionID', 'DEBUG')
  )

# Age
summary(scale_data$age)
summary(text_data$age)

# Gender
scale_data |>
  group_by(gender) |>
  summarize(
    participants = n_distinct(prolificID)
  ) |>
  ungroup()
text_data |>
  group_by(gender) |>
  summarize(
    participants = n_distinct(prolificID)
  ) |>
  ungroup()

# Race
scale_data |>
  group_by(race) |>
  summarize(
    participants = n_distinct(prolificID)
  ) |>
  ungroup()
text_data |>
  group_by(race) |>
  summarize(
    participants = n_distinct(prolificID)
  ) |>
  ungroup()


# ANALYSIS: Free response length ----

# Add length of free response answers
text_data = text_data |>
  mutate(
    response_length = str_length(response)
  )

# Compare response lengths by question category
m0 = lmer(
  data = text_data,
  response_length ~ 1 + (1 | prolificID) + (1 | questionID),
  REML = F
)
m1 = lmer(
  data = text_data,
  response_length ~ 1 + questionCategory + (1 | prolificID) + (1 | questionID),
  REML = F
)
anova(m0, m1)
emmeans(m1, pairwise ~ questionCategory)


# TABLE: Sample free response answers ----
# Display interesting responses to small talk and personal questions
# NB: toggle questionID and row indices below (or remove indices) to view other responses

# Get unique question IDs
questionIDs = unique(text_data$questionID)

# Get question text
unique(text_data$questionText[text_data$questionID == questionIDs[2]])
# Get response text
text_data$response[text_data$questionID == questionIDs[2]][44]

# Get question text
unique(text_data$questionText[text_data$questionID == questionIDs[9]])
# Get response text
text_data$response[text_data$questionID == questionIDs[9]][22]


# FIGURE: Response distribution for sample scales ----

# Scales with low, medium, and high average values, large variance within scale
sample_scales = c(
  37, # low average ("disorganized")
  28,  # very middle ("worries a lot")
  17 # high average ("caring")
)

# Figure
scale_color = '#0968AF'
scale_sample = scale_data |>
  filter(scaleID %in% sample_scales) |>
  mutate(
    scaleID = factor(scaleID, levels = sample_scales)
  ) |>
  ggplot(
    aes(
      x = scaleID,
      y = response
    )
  ) +
  stat_summary(
    fun.data = 'mean_cl_boot',
    size = 1.5,
    linewidth = 1,
    color = scale_color
  ) +
  gghalves::geom_half_point(
    side = 'l',
    alpha = 0.5,
    range_scale = 0.25,
    color = scale_color
  ) +
  geom_text(
    data = scale_data |>
      filter(scaleID %in% sample_scales) |>
      mutate(
        scaleID = factor(scaleID, levels = sample_scales)
      ),
    aes(
      x = scaleID,
      y = 50,
      label = scaleText
    ),
    vjust = -5,
    size = 6,
    color = scale_color,
    family = 'Charter'
  ) +
  scale_x_discrete(
    name = element_blank(),
  ) +
  scale_y_continuous(
    name = 'scale response',
    breaks = seq(0, 100, by = 25),
    labels = seq(0, 100, by = 25),
    limits = c(0, 100)
  ) +
  default_plot_theme +
  theme(
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
scale_sample
# Save figure
ggsave(
  scale_sample,
  filename = 'sample_scale_responses.pdf',
  path = FIGURE_PATH,
  device = cairo_pdf,
  width = 8,
  height = 7,
)
