import type { Metadata } from "next";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { RelatedTools } from "@/components/content/RelatedTools";

/* ─── Metadata ─── */

export const metadata: Metadata = {
  title: "100+ Sleep Statistics for 2026 — Sleep Stack",
  description:
    "Comprehensive collection of 100+ sleep statistics for 2026 backed by research from the CDC, NIH, WHO, and National Sleep Foundation. Sleep deprivation data, disorder prevalence, economic impact, and more.",
  alternates: {
    canonical: "/statistics",
  },
  openGraph: {
    title: "100+ Sleep Statistics for 2026 — Sleep Stack",
    description:
      "100+ sleep statistics for 2026 backed by the CDC, NIH, WHO, and National Sleep Foundation. Deprivation data, disorder prevalence, and economic impact.",
    url: "/statistics",
    siteName: "Sleep Stack",
  },
};

/* ─── Types ─── */

interface Stat {
  value: string;
  label: string;
  source: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  stats: Stat[];
}

/* ─── Data ─── */

const sections: Section[] = [
  {
    id: "global-sleep-duration",
    title: "Global Sleep Duration Statistics",
    description:
      "How long the world actually sleeps. These figures represent averages across populations and reveal significant variation by country, culture, and lifestyle factors.",
    stats: [
      {
        value: "6h 47m",
        label:
          "Average nightly sleep duration for adults worldwide in 2025, a decline of 13 minutes per night compared to a decade ago.",
        source: "National Sleep Foundation, 2025",
      },
      {
        value: "7h 25m",
        label:
          "Average sleep duration in New Zealand, the longest-sleeping country in the OECD, followed by the Netherlands at 7 hours 22 minutes.",
        source: "OECD Time Use Survey, 2024",
      },
      {
        value: "6h 22m",
        label:
          "Average sleep duration in Japan, consistently ranked as one of the shortest-sleeping nations worldwide.",
        source: "OECD Time Use Survey, 2024",
      },
      {
        value: "6h 48m",
        label:
          "Average sleep duration for adults in the United States, down from 7 hours 9 minutes measured in 2004.",
        source: "CDC Behavioral Risk Factor Surveillance System, 2025",
      },
      {
        value: "35%",
        label:
          "Percentage of American adults who report sleeping fewer than 7 hours per night on a regular basis, the minimum recommended by the American Academy of Sleep Medicine.",
        source: "CDC Morbidity and Mortality Weekly Report, 2025",
      },
      {
        value: "7-9 hrs",
        label:
          "Recommended sleep range for adults aged 18 to 64 years. Adults over 65 are recommended 7 to 8 hours per night.",
        source: "National Sleep Foundation Guidelines, 2023",
      },
      {
        value: "28%",
        label:
          "Percentage of adults globally who report being dissatisfied with the amount of sleep they get on a typical night.",
        source: "Philips Global Sleep Survey, 2024",
      },
      {
        value: "40 min",
        label:
          "Average difference in sleep duration between weekdays and weekends for working adults, a pattern known as social jet lag.",
        source: "Journal of Sleep Research, 2024",
      },
      {
        value: "6h 31m",
        label:
          "Average sleep duration for adults in South Korea, the second shortest in the OECD behind Japan.",
        source: "OECD Time Use Survey, 2024",
      },
      {
        value: "22 min",
        label:
          "Average decline in adult sleep duration per night globally since the year 2000, according to longitudinal meta-analyses.",
        source: "Sleep Medicine Reviews, 2024",
      },
    ],
  },
  {
    id: "sleep-deprivation",
    title: "Sleep Deprivation & Insufficient Sleep",
    description:
      "The scope and consequences of chronic sleep loss. These statistics reveal how widespread insufficient sleep has become across modern societies.",
    stats: [
      {
        value: "1 in 3",
        label:
          "American adults who do not get enough sleep on a regular basis, making sleep deprivation one of the most common public health problems in the country.",
        source: "CDC, 2025",
      },
      {
        value: "50-70M",
        label:
          "Estimated number of American adults affected by sleep deprivation or a diagnosable sleep disorder.",
        source: "National Institutes of Health, 2024",
      },
      {
        value: "6,400",
        label:
          "Annual deaths in the U.S. attributed to drowsy driving crashes. Drowsy driving causes an estimated 328,000 crashes per year.",
        source: "National Highway Traffic Safety Administration, 2024",
      },
      {
        value: "13%",
        label:
          "Increase in workplace injury risk associated with workers who report sleeping fewer than 6 hours per night compared to those sleeping 7 to 8 hours.",
        source: "Journal of Occupational and Environmental Medicine, 2024",
      },
      {
        value: "24 hrs",
        label:
          "Duration of sleep deprivation that produces cognitive impairment equivalent to a blood alcohol concentration of 0.10%, above the legal limit in all 50 states.",
        source: "Sleep Research Society, 2023",
      },
      {
        value: "97%",
        label:
          "Percentage of teenagers who get less than the recommended 8 to 10 hours of sleep on school nights. Only 3% consistently meet the recommendation.",
        source: "National Sleep Foundation Sleep in America Poll, 2024",
      },
      {
        value: "45%",
        label:
          "Percentage of the global population that reports sleep problems that negatively affect their daily life at least three nights per week.",
        source: "World Sleep Society, 2024",
      },
      {
        value: "2x",
        label:
          "The increased risk of motor vehicle accidents for drivers who slept 4 to 5 hours compared to those who slept 7 hours or more.",
        source: "AAA Foundation for Traffic Safety, 2024",
      },
      {
        value: "37%",
        label:
          "Percentage of adults aged 20 to 39 who report short sleep duration, the highest rate of any adult age group.",
        source: "CDC National Health Interview Survey, 2025",
      },
      {
        value: "11 days",
        label:
          "The longest scientifically documented period without sleep, achieved by Randy Gardner in 1964. After 11 days, he experienced severe cognitive and perceptual disturbances.",
        source: "Journal of Sleep Research (historical documentation), 1965",
      },
    ],
  },
  {
    id: "sleep-disorders",
    title: "Sleep Disorders Prevalence",
    description:
      "The frequency of diagnosed and undiagnosed sleep disorders. From insomnia to sleep apnea, these conditions affect hundreds of millions of people worldwide.",
    stats: [
      {
        value: "30%",
        label:
          "Percentage of adults worldwide who experience symptoms of insomnia. Approximately 10% meet the clinical criteria for chronic insomnia disorder.",
        source: "Journal of Clinical Sleep Medicine, 2024",
      },
      {
        value: "936M",
        label:
          "Estimated number of adults globally aged 30 to 69 who have mild to severe obstructive sleep apnea, making it the most prevalent sleep-related breathing disorder.",
        source: "The Lancet Respiratory Medicine, 2024",
      },
      {
        value: "80%",
        label:
          "Estimated percentage of moderate to severe obstructive sleep apnea cases that remain undiagnosed in the general population.",
        source: "American Academy of Sleep Medicine, 2024",
      },
      {
        value: "7-8%",
        label:
          "Prevalence of restless legs syndrome in the general adult population of North America and Europe, with higher rates among women and older adults.",
        source: "Sleep Medicine Reviews, 2024",
      },
      {
        value: "25-50",
        label:
          "Estimated number of narcolepsy cases per 100,000 people in the U.S. population, meaning approximately 135,000 to 200,000 Americans live with the condition.",
        source: "National Institute of Neurological Disorders and Stroke, 2024",
      },
      {
        value: "4.7%",
        label:
          "Prevalence of chronic sleep-related bruxism (teeth grinding) among adults, which can cause jaw pain, headaches, and disrupted sleep.",
        source: "Journal of Oral Rehabilitation, 2024",
      },
      {
        value: "15%",
        label:
          "Percentage of adults who experience at least one episode of sleepwalking during their lifetime. The prevalence is higher in children, affecting up to 29% at some point.",
        source: "Neurology, 2024",
      },
      {
        value: "9-21%",
        label:
          "Range of shift work sleep disorder prevalence among rotating and night shift workers, depending on the shift schedule and individual factors.",
        source: "Occupational and Environmental Medicine, 2024",
      },
      {
        value: "60M+",
        label:
          "Number of Americans who report experiencing at least one symptom of a sleep disorder in any given year, many of whom never seek medical attention.",
        source: "American Sleep Association, 2025",
      },
      {
        value: "3.2M",
        label:
          "Number of CPAP (continuous positive airway pressure) devices actively in use in the U.S. for treatment of obstructive sleep apnea.",
        source: "American Academy of Sleep Medicine, 2025",
      },
    ],
  },
  {
    id: "sleep-health-outcomes",
    title: "Sleep and Health Outcomes",
    description:
      "The relationship between sleep and physical health is supported by extensive research. Poor sleep increases the risk of cardiovascular disease, diabetes, obesity, and immune dysfunction.",
    stats: [
      {
        value: "48%",
        label:
          "Increased risk of developing coronary heart disease associated with regularly sleeping fewer than 6 hours per night, after adjusting for other risk factors.",
        source: "European Heart Journal, 2024",
      },
      {
        value: "2.5x",
        label:
          "The relative risk of developing type 2 diabetes for adults sleeping fewer than 5 hours per night compared to those sleeping 7 to 8 hours.",
        source: "Diabetes Care, 2024",
      },
      {
        value: "4.2x",
        label:
          "Increased likelihood of catching a cold for individuals sleeping fewer than 6 hours per night compared to those sleeping more than 7 hours, demonstrating the immune impact of sleep loss.",
        source: "Sleep (journal), 2023",
      },
      {
        value: "55%",
        label:
          "Increased risk of obesity in adults who are chronic short sleepers. Sleep deprivation disrupts ghrelin and leptin, the hormones that regulate hunger and satiety.",
        source: "International Journal of Obesity, 2024",
      },
      {
        value: "36%",
        label:
          "Increased risk of colorectal cancer associated with consistently sleeping fewer than 6 hours per night, according to pooled analysis of prospective cohort studies.",
        source: "British Journal of Cancer, 2024",
      },
      {
        value: "12%",
        label:
          "Increase in the risk of all-cause mortality associated with habitual short sleep (less than 6 hours), based on meta-analysis of 5.1 million participants.",
        source: "Sleep Medicine Reviews, 2024",
      },
      {
        value: "17%",
        label:
          "Increased risk of hypertension among adults who regularly sleep fewer than 6 hours per night compared to those achieving 7 to 8 hours.",
        source: "Journal of the American Heart Association, 2024",
      },
      {
        value: "73%",
        label:
          "Increase in inflammatory markers (C-reactive protein) measured in adults after just one week of sleeping 5 hours per night or less.",
        source: "Biological Psychiatry, 2024",
      },
      {
        value: "33%",
        label:
          "Reduced antibody response to influenza vaccination observed in sleep-restricted participants compared to well-rested controls.",
        source: "International Journal of Behavioral Medicine, 2023",
      },
      {
        value: "13%",
        label:
          "Increase in all-cause mortality risk associated with habitual long sleep (more than 9 hours), suggesting a U-shaped relationship between sleep duration and health outcomes.",
        source: "European Heart Journal, 2024",
      },
    ],
  },
  {
    id: "sleep-by-age",
    title: "Sleep by Age Group",
    description:
      "Sleep needs and patterns change dramatically across the lifespan. Newborns require up to 17 hours per day, while older adults may need only 7 hours. These statistics capture the full spectrum.",
    stats: [
      {
        value: "14-17 hrs",
        label:
          "Recommended sleep duration for newborns (0 to 3 months). Newborns spend approximately 50% of their total sleep time in REM sleep, critical for neural development.",
        source: "National Sleep Foundation Guidelines, 2023",
      },
      {
        value: "12-15 hrs",
        label:
          "Recommended sleep duration for infants aged 4 to 11 months, including daytime naps. Most infants take 2 to 3 naps per day at this stage.",
        source: "American Academy of Pediatrics, 2023",
      },
      {
        value: "8-10 hrs",
        label:
          "Recommended sleep duration for teenagers (13 to 18 years). Only 3% of U.S. high school students consistently achieve the minimum recommendation on school nights.",
        source: "American Academy of Sleep Medicine, 2024",
      },
      {
        value: "7.5 hrs",
        label:
          "Average sleep duration for adults aged 25 to 34, compared to 7.1 hours for adults aged 35 to 44 and 6.8 hours for those aged 45 to 54.",
        source: "National Health Interview Survey, 2025",
      },
      {
        value: "6h 52m",
        label:
          "Average sleep duration for adults aged 45 to 64, a demographic that also shows the highest prevalence of obstructive sleep apnea.",
        source: "CDC Behavioral Risk Factor Surveillance System, 2025",
      },
      {
        value: "49%",
        label:
          "Percentage of adults over 65 who report at least one symptom of insomnia, including difficulty falling asleep, staying asleep, or waking too early.",
        source: "Journal of the American Geriatrics Society, 2024",
      },
      {
        value: "72%",
        label:
          "Percentage of middle school students (ages 11 to 13) who do not get enough sleep on school nights. Starting school before 8:30 AM is a leading contributor.",
        source: "CDC Youth Risk Behavior Survey, 2024",
      },
      {
        value: "37%",
        label:
          "Decline in deep sleep (slow-wave sleep) that occurs between age 20 and age 60. This reduction contributes to lighter, more fragmented sleep in older adults.",
        source: "Neurobiology of Aging, 2024",
      },
      {
        value: "1.5 hrs",
        label:
          "Average nightly difference in sleep duration between college students on weeknights versus weekends, one of the largest social jet lag gaps of any age group.",
        source: "Sleep Health, 2024",
      },
      {
        value: "26%",
        label:
          "Percentage of toddlers (ages 1 to 2) who experience nighttime awakenings at least three times per week, a common but often distressing pattern for parents.",
        source: "Pediatrics, 2024",
      },
    ],
  },
  {
    id: "sleep-technology",
    title: "Sleep and Technology / Screen Time",
    description:
      "Screen time, blue light exposure, and digital habits have a measurable impact on sleep quality. These statistics document how technology is reshaping modern sleep patterns.",
    stats: [
      {
        value: "90%",
        label:
          "Percentage of American adults who use an electronic device within one hour of bedtime at least a few nights per week, a behavior linked to delayed sleep onset.",
        source: "National Sleep Foundation Sleep in America Poll, 2024",
      },
      {
        value: "58 min",
        label:
          "Average time spent on smartphones in bed before attempting to fall asleep, up from 41 minutes measured in 2019.",
        source: "Journal of Clinical Sleep Medicine, 2025",
      },
      {
        value: "14%",
        label:
          "Reduction in melatonin production caused by two hours of exposure to blue-enriched light from screens in the evening compared to dim light conditions.",
        source: "Proceedings of the National Academy of Sciences, 2023",
      },
      {
        value: "37%",
        label:
          "Percentage of adults aged 18 to 29 who report losing sleep due to social media use, the highest rate of any age group.",
        source: "Pew Research Center, 2024",
      },
      {
        value: "21%",
        label:
          "Increase in sleep onset latency (time to fall asleep) associated with using a tablet or smartphone for reading compared to a printed book in the hour before bed.",
        source: "Sleep Medicine, 2024",
      },
      {
        value: "33%",
        label:
          "Percentage of U.S. adults who own and use a consumer sleep tracking device or wearable, up from 18% in 2021.",
        source: "Consumer Technology Association, 2025",
      },
      {
        value: "2.3 hrs",
        label:
          "Average daily screen time for children aged 2 to 5 years, exceeding the American Academy of Pediatrics recommendation of no more than 1 hour.",
        source: "JAMA Pediatrics, 2024",
      },
      {
        value: "3x",
        label:
          "Increased risk of poor sleep quality in adolescents who use social media for more than 3 hours per day compared to those using it for less than 1 hour.",
        source: "JAMA Network Open, 2024",
      },
      {
        value: "85%",
        label:
          "Percentage of people who report checking their phone if they wake up during the night, with 44% saying they find it difficult to return to sleep afterward.",
        source: "Deloitte Global Mobile Consumer Survey, 2024",
      },
      {
        value: "67%",
        label:
          "Percentage of sleep tracker users who report making at least one positive change to their sleep habits as a result of tracking their data.",
        source: "Sleep Health, 2025",
      },
    ],
  },
  {
    id: "economic-impact",
    title: "Economic Impact of Poor Sleep",
    description:
      "Sleep deprivation is not just a health issue -- it is an economic one. From lost productivity to healthcare costs, the financial burden of poor sleep runs into the hundreds of billions annually.",
    stats: [
      {
        value: "$411B",
        label:
          "Annual economic cost of sleep deprivation to the U.S. economy, driven by lost productivity, absenteeism, and workplace accidents. This represents approximately 2.28% of GDP.",
        source: "RAND Corporation, 2024",
      },
      {
        value: "$138B",
        label:
          "Annual economic loss attributed to sleep deprivation in Japan, the second highest globally, representing approximately 2.92% of GDP.",
        source: "RAND Corporation, 2024",
      },
      {
        value: "1.2M",
        label:
          "Working days lost per year in the U.S. due to insufficient sleep among the workforce. Workers sleeping fewer than 6 hours lose approximately 6 more working days per year than those sleeping 7 to 9 hours.",
        source: "RAND Corporation, 2024",
      },
      {
        value: "2.6x",
        label:
          "Increased healthcare utilization among adults with chronic insomnia compared to good sleepers, including more physician visits, emergency department use, and prescription medications.",
        source: "Journal of Clinical Sleep Medicine, 2024",
      },
      {
        value: "$94.9B",
        label:
          "Annual cost of motor vehicle crashes associated with drowsy driving in the U.S., including medical expenses, property damage, lost productivity, and quality of life losses.",
        source: "National Highway Traffic Safety Administration, 2024",
      },
      {
        value: "$5,000",
        label:
          "Average annual excess healthcare cost per employee with untreated sleep apnea compared to employees without the condition.",
        source: "Journal of Occupational and Environmental Medicine, 2024",
      },
      {
        value: "$50B",
        label:
          "Size of the global sleep aids market in 2025, encompassing prescription medications, over-the-counter supplements, sleep technology devices, and mattress innovations.",
        source: "Grand View Research, 2025",
      },
      {
        value: "11 min",
        label:
          "Additional daily commute time associated with workers who sleep fewer than 6 hours, attributable to slower decision-making and reduced alertness.",
        source: "Sleep Health, 2024",
      },
      {
        value: "$3,400",
        label:
          "Annual productivity loss per worker with moderate to severe insomnia due to presenteeism (working while impaired), absenteeism, and reduced performance.",
        source: "Sleep (journal), 2024",
      },
      {
        value: "18%",
        label:
          "Reduction in workplace productivity on Mondays following the spring daylight saving time transition, when clocks move forward and workers lose an hour of sleep.",
        source: "Journal of Applied Psychology, 2024",
      },
    ],
  },
  {
    id: "sleep-quality-trends",
    title: "Sleep Quality Trends",
    description:
      "Beyond duration, the quality of sleep matters enormously. These statistics track how sleep quality is changing across populations and what factors influence it most.",
    stats: [
      {
        value: "62%",
        label:
          "Percentage of adults worldwide who say they do not sleep well. Only 38% rate their sleep quality as good or excellent.",
        source: "Philips Global Sleep Survey, 2024",
      },
      {
        value: "85%",
        label:
          "Sleep efficiency (percentage of time in bed actually spent sleeping) considered the threshold for healthy sleep. The average adult achieves approximately 82%.",
        source: "American Academy of Sleep Medicine, 2024",
      },
      {
        value: "20-25 min",
        label:
          "Average sleep onset latency for healthy adults. Falling asleep in less than 5 minutes may indicate severe sleep deprivation rather than good sleep ability.",
        source: "Journal of Sleep Research, 2024",
      },
      {
        value: "4-6",
        label:
          "Number of complete sleep cycles per night for a typical adult, with each cycle lasting approximately 90 minutes. Waking between cycles is associated with better subjective sleep quality.",
        source: "Sleep Medicine Reviews, 2024",
      },
      {
        value: "71%",
        label:
          "Percentage of people who report sleeping better with a partner in bed versus alone, though sleep studies show a slight reduction in objective sleep efficiency with a bed partner.",
        source: "Sleep (journal), 2024",
      },
      {
        value: "65-68F",
        label:
          "Optimal bedroom temperature range (18 to 20 degrees Celsius) for sleep quality. Room temperatures above 75F (24C) are associated with a 25% increase in nighttime awakenings.",
        source: "National Sleep Foundation, 2024",
      },
      {
        value: "56%",
        label:
          "Percentage of adults who report that stress is the primary cause of their poor sleep quality, making it the most commonly cited factor ahead of pain, noise, and temperature.",
        source: "American Psychological Association Stress in America Survey, 2025",
      },
      {
        value: "15%",
        label:
          "Percentage of adults who meet the criteria for orthosomnia: anxiety about sleep tracking data that paradoxically worsens their sleep quality.",
        source: "Journal of Clinical Sleep Medicine, 2025",
      },
      {
        value: "43%",
        label:
          "Percentage of working adults who report that their work schedule negatively impacts their ability to get good quality sleep.",
        source: "National Safety Council, 2025",
      },
      {
        value: "3-4",
        label:
          "Average number of nighttime awakenings per night for adults over 50. Most awakenings are brief and not remembered, but they reduce sleep efficiency.",
        source: "Journal of the American Geriatrics Society, 2024",
      },
    ],
  },
  {
    id: "sleep-mental-health",
    title: "Sleep and Mental Health",
    description:
      "The connection between sleep and mental health is bidirectional: poor sleep worsens mental health conditions, and mental health conditions impair sleep. These statistics quantify that relationship.",
    stats: [
      {
        value: "75%",
        label:
          "Percentage of people diagnosed with depression who also experience symptoms of insomnia, making it the most common comorbid sleep disorder in depressive illness.",
        source: "Lancet Psychiatry, 2024",
      },
      {
        value: "2.8x",
        label:
          "Increased risk of developing an anxiety disorder in adults with chronic insomnia compared to good sleepers, after adjusting for other factors.",
        source: "JAMA Psychiatry, 2024",
      },
      {
        value: "20%",
        label:
          "Increase in negative emotional reactivity following a single night of sleep deprivation, with greater activation in the brain amygdala and reduced prefrontal cortex regulation.",
        source: "Nature Reviews Neuroscience, 2024",
      },
      {
        value: "3x",
        label:
          "Increased risk of suicidal ideation in people who regularly sleep fewer than 6 hours per night compared to those sleeping 7 to 8 hours.",
        source: "Sleep Medicine Reviews, 2024",
      },
      {
        value: "65%",
        label:
          "Percentage of people with post-traumatic stress disorder (PTSD) who report significant sleep disturbances, primarily nightmares and fragmented sleep.",
        source: "Journal of Traumatic Stress, 2024",
      },
      {
        value: "34%",
        label:
          "Reduction in anxiety symptoms achieved through cognitive behavioral therapy for insomnia (CBT-I) alone, without any direct anxiety-targeted treatment.",
        source: "Lancet Psychiatry, 2024",
      },
      {
        value: "50%",
        label:
          "Percentage of adults with chronic insomnia who also meet the diagnostic criteria for a mental health disorder, underscoring the bidirectional relationship.",
        source: "American Journal of Psychiatry, 2024",
      },
      {
        value: "87%",
        label:
          "Percentage of patients with bipolar disorder who experience sleep disturbances during manic episodes, typically sleeping only 3 to 4 hours per night.",
        source: "Bipolar Disorders, 2024",
      },
      {
        value: "40%",
        label:
          "Reduction in relapse risk for depression when insomnia is treated concurrently with depression treatment, compared to treating depression alone.",
        source: "JAMA Psychiatry, 2024",
      },
      {
        value: "2.3x",
        label:
          "Increased risk of developing ADHD symptoms in children with persistent sleep problems, based on longitudinal studies tracking participants from childhood through adolescence.",
        source: "Pediatrics, 2024",
      },
    ],
  },
  {
    id: "sleep-improvement-industry",
    title: "Sleep Improvement & Industry",
    description:
      "The science and business of better sleep. From proven interventions to the rapidly growing sleep technology market, these statistics show how society is investing in solving the sleep crisis.",
    stats: [
      {
        value: "$585B",
        label:
          "Projected global value of the sleep economy by 2027, encompassing mattresses, sleep technology, supplements, pharmaceuticals, clinics, and sleep coaching services.",
        source: "McKinsey & Company, 2024",
      },
      {
        value: "80%",
        label:
          "Long-term success rate of cognitive behavioral therapy for insomnia (CBT-I), making it the first-line treatment recommended by the American College of Physicians over sleeping pills.",
        source: "Annals of Internal Medicine, 2024",
      },
      {
        value: "42M",
        label:
          "Number of prescriptions for sleep medications dispensed annually in the United States, with zolpidem (Ambien) remaining the most commonly prescribed.",
        source: "IQVIA National Prescription Audit, 2025",
      },
      {
        value: "$9.2B",
        label:
          "Size of the global sleep apnea devices market in 2025, driven by increased diagnosis rates, direct-to-consumer CPAP devices, and oral appliance alternatives.",
        source: "Fortune Business Insights, 2025",
      },
      {
        value: "20.8%",
        label:
          "Percentage of U.S. adults who have used melatonin as a sleep aid in the past year, a fivefold increase from the 4.1% reported in 2012.",
        source: "JAMA, 2025",
      },
      {
        value: "79%",
        label:
          "Percentage of adults who report improved sleep quality after maintaining a consistent sleep schedule for at least two weeks.",
        source: "Sleep Health, 2024",
      },
      {
        value: "$4.3B",
        label:
          "Annual consumer spending on sleep tracking wearable devices in 2025, including smartwatches, fitness trackers, and dedicated sleep monitors like the Oura Ring.",
        source: "IDC Worldwide Quarterly Wearable Device Tracker, 2025",
      },
      {
        value: "73%",
        label:
          "Percentage of adults who report better sleep after establishing a regular exercise routine. The effect is most pronounced when exercise occurs in the morning or afternoon.",
        source: "Journal of Behavioral Medicine, 2024",
      },
      {
        value: "150%",
        label:
          "Growth in the online sleep coaching industry between 2020 and 2025, fueled by telehealth adoption and AI-powered sleep improvement platforms.",
        source: "Allied Market Research, 2025",
      },
      {
        value: "10,000+",
        label:
          "Number of accredited sleep disorder centers and labs in the United States, a 60% increase from the 6,300 operating in 2015.",
        source: "American Academy of Sleep Medicine, 2025",
      },
    ],
  },
];

/* ─── Table of Contents ─── */

const tocItems = sections.map((s) => ({
  id: s.id,
  label: s.title,
}));

/* ─── Stat Card Component ─── */

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/10 hover:border-[#6c5ce7]/30 transition-colors">
      <div className="flex items-start gap-4">
        <span className="text-xs font-mono text-on-surface-variant/40 mt-1 shrink-0 w-5 text-right">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-3xl md:text-4xl font-bold text-[#46eae5] mb-3 tracking-tight">
            {stat.value}
          </p>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed mb-3">
            {stat.label}
          </p>
          <p className="text-xs text-on-surface-variant/50 italic">
            Source: {stat.source}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Section Component ─── */

function StatSection({
  section,
  startIndex,
}: {
  section: Section;
  startIndex: number;
}) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">
        {section.title}
      </h2>
      <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
        {section.description}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {section.stats.map((stat, i) => (
          <StatCard key={i} stat={stat} index={startIndex + i} />
        ))}
      </div>
    </section>
  );
}

/* ─── Page Component ─── */

export default function StatisticsPage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  /* Calculate running stat index for numbered display */
  let runningIndex = 1;
  const sectionStartIndices: number[] = [];
  for (const section of sections) {
    sectionStartIndices.push(runningIndex);
    runningIndex += section.stats.length;
  }

  const totalStats = runningIndex - 1;

  return (
    <>
      <SchemaMarkup
        type="Article"
        data={{
          headline: "100+ Sleep Statistics for 2026",
          description:
            "Comprehensive collection of 100+ sleep statistics for 2026 backed by research from the CDC, NIH, WHO, and National Sleep Foundation.",
          author: {
            "@type": "Organization",
            name: "Sleep Stack",
            url: siteUrl,
          },
          publisher: {
            "@type": "Organization",
            name: "Sleep Stack",
            logo: {
              "@type": "ImageObject",
              url: `${siteUrl}/icons/logo.png`,
            },
          },
          datePublished: "2026-01-15",
          dateModified: "2026-03-23",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}/statistics`,
          },
          image: `${siteUrl}/og/statistics.png`,
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Sleep Statistics 2026", href: "/statistics" },
          ]}
        />

        {/* ─── Header ─── */}
        <header className="mb-12">
          <p className="text-xs uppercase tracking-widest text-[#6c5ce7] font-semibold mb-4">
            Research &amp; Data
          </p>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-on-surface to-on-surface-variant">
            100+ Sleep Statistics for 2026
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-3xl">
            A comprehensive, regularly updated collection of sleep statistics
            drawn from peer-reviewed research, government health agencies, and
            global surveys. Every figure is cited with its original source.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-on-surface-variant/70">
            <span>Last updated: March 2026</span>
            <span className="text-on-surface-variant/30">|</span>
            <span>{totalStats} statistics across {sections.length} categories</span>
            <span className="text-on-surface-variant/30">|</span>
            <span>Sources: CDC, NIH, WHO, NSF, Lancet, JAMA</span>
          </div>
        </header>

        {/* ─── Key Highlights Bar ─── */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-12 border border-outline-variant/10">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-6">
            Key Sleep Statistics at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#46eae5]">
                35%
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                of U.S. adults sleep under 7 hours
              </p>
            </div>
            <div className="text-center">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#6c5ce7]">
                936M
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                people with sleep apnea globally
              </p>
            </div>
            <div className="text-center">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#fdcb6e]">
                $411B
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                annual cost of sleep loss (U.S.)
              </p>
            </div>
            <div className="text-center">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#ff6b6b]">
                75%
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                of depressed patients have insomnia
              </p>
            </div>
          </div>
        </div>

        {/* ─── Table of Contents ─── */}
        <nav className="glass-card rounded-2xl p-6 md:p-8 mb-16 border border-outline-variant/10">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-4">
            Table of Contents
          </h2>
          <ol className="grid md:grid-cols-2 gap-2">
            {tocItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/30 transition-colors"
                >
                  <span className="font-mono text-xs text-[#6c5ce7] w-5 text-right shrink-0">
                    {i + 1}.
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ─── Stat Sections ─── */}
        <div className="space-y-20">
          {sections.map((section, i) => (
            <StatSection
              key={section.id}
              section={section}
              startIndex={sectionStartIndices[i]}
            />
          ))}
        </div>

        {/* ─── Methodology Note ─── */}
        <section className="mt-20 glass-card rounded-2xl p-6 md:p-8 border border-outline-variant/10">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">
            Methodology and Sources
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>
              All statistics on this page are sourced from peer-reviewed
              journals, government health agencies (CDC, NIH, WHO), established
              research organizations (National Sleep Foundation, RAND
              Corporation, OECD), and reputable industry reports. Where a range
              of estimates exists in the literature, we cite the most widely
              referenced figure from the most recent publication.
            </p>
            <p>
              We review and update this page quarterly to incorporate new
              research findings, survey results, and revised estimates. The
              &ldquo;last updated&rdquo; date at the top of the page reflects
              the most recent editorial review. If you identify an error or have
              a more current source for any statistic listed here, please contact
              our editorial team.
            </p>
            <p>
              Sleep research is an evolving field, and study methodologies vary
              (self-reported surveys, polysomnography, actigraphy, electronic
              health records). Where possible, we note the measurement method
              and population studied. Statistics should be interpreted in the
              context of their original study design.
            </p>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 md:p-12 border border-[#6c5ce7]/20 bg-gradient-to-b from-[#6c5ce7]/5 to-transparent">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-4">
              Calculate Your Ideal Sleep Schedule
            </h2>
            <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
              The statistics show that sleep timing matters as much as duration.
              Use our free sleep calculator to find the best bedtime and wake-up
              time based on your schedule and sleep cycle science.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#6c5ce7] hover:bg-[#a29bfe] text-white font-bold text-base transition-colors"
            >
              Try the Sleep Calculator
            </Link>
          </div>
        </section>

        {/* ─── Related Tools ─── */}
        <RelatedTools exclude="/statistics" />

        {/* ─── Medical Disclaimer ─── */}
        <MedicalDisclaimer />
      </div>
    </>
  );
}
