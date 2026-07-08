/**
 * Maps each blog post slug to topically relevant programmatic pages/hubs.
 *
 * Blog posts previously linked only to calculators/tools, so the 150+
 * programmatic pages received no in-body editorial link equity. This map wires
 * each article to the condition / age / profession / bedtime pages it naturally
 * relates to. Every target below is a verified, statically-generated route.
 */
export interface GuideLink {
  label: string;
  href: string;
}

export const BLOG_RELATED_GUIDES: Record<string, GuideLink[]> = {
  "anxiety-and-sleep": [
    { label: "Sleeping with anxiety", href: "/sleep-with/anxiety" },
    { label: "Sleeping with insomnia", href: "/sleep-with/insomnia" },
    { label: "Sleeping with depression", href: "/sleep-with/depression" },
  ],
  "best-mattress-for-sleep": [
    { label: "Best mattress guide", href: "/best-mattress" },
    { label: "Sleeping with chronic pain", href: "/sleep-with/chronic-pain" },
    { label: "Sleeping with fibromyalgia", href: "/sleep-with/fibromyalgia" },
  ],
  "best-sleep-supplements": [
    { label: "Sleeping with insomnia", href: "/sleep-with/insomnia" },
    { label: "Sleep during menopause", href: "/sleep-with/menopause" },
    { label: "Sleeping with anxiety", href: "/sleep-with/anxiety" },
  ],
  "best-sleeping-position": [
    { label: "Sleeping with acid reflux (GERD)", href: "/sleep-with/acid-reflux-gerd" },
    { label: "Sleeping during pregnancy", href: "/sleep-with/pregnancy" },
    { label: "Sleeping with sleep apnea", href: "/sleep-with/sleep-apnea" },
  ],
  "biphasic-and-polyphasic-sleep": [
    { label: "Sleep for new parents", href: "/profession/new-parent" },
    { label: "Sleep for military personnel", href: "/profession/military" },
    { label: "Bedtime by wake-up time", href: "/bedtime" },
  ],
  "chronotype-quiz-meaning": [
    { label: "Find your ideal bedtime", href: "/bedtime" },
    { label: "Find your ideal wake-up time", href: "/sleep-time" },
    { label: "Sleep for software engineers", href: "/profession/software-engineer" },
  ],
  "how-much-deep-sleep-do-you-need": [
    { label: "Sleep for adults (26–64)", href: "/age/adult-26-64-years" },
    { label: "Sleep for older adults (65+)", href: "/age/older-adult-65-plus" },
    { label: "Sleep needs by age", href: "/age" },
  ],
  "how-much-rem-sleep-do-you-need": [
    { label: "Sleep for adults (26–64)", href: "/age/adult-26-64-years" },
    { label: "Sleep for teenagers (14–17)", href: "/age/teenager-14-17-years" },
    { label: "Sleep needs by age", href: "/age" },
  ],
  "how-much-sleep-do-women-need": [
    { label: "Sleep during pregnancy", href: "/sleep-with/pregnancy" },
    { label: "Sleep during menopause", href: "/sleep-with/menopause" },
    { label: "Sleep for adults (26–64)", href: "/age/adult-26-64-years" },
  ],
  "how-much-sleep-do-you-need": [
    { label: "Sleep needs by age", href: "/age" },
    { label: "Sleep for teenagers (14–17)", href: "/age/teenager-14-17-years" },
    { label: "Sleep for older adults (65+)", href: "/age/older-adult-65-plus" },
  ],
  "how-to-fall-asleep-fast": [
    { label: "Sleeping with insomnia", href: "/sleep-with/insomnia" },
    { label: "Sleeping with anxiety", href: "/sleep-with/anxiety" },
    { label: "Find your ideal bedtime", href: "/bedtime" },
  ],
  "how-to-fix-sleep-schedule": [
    { label: "Find your ideal bedtime", href: "/bedtime" },
    { label: "Find your ideal wake-up time", href: "/sleep-time" },
    { label: "Sleep for college students", href: "/profession/college-student" },
  ],
  "how-to-get-more-deep-sleep": [
    { label: "Sleep for older adults (65+)", href: "/age/older-adult-65-plus" },
    { label: "Sleeping with insomnia", href: "/sleep-with/insomnia" },
    { label: "Sleeping with sleep apnea", href: "/sleep-with/sleep-apnea" },
  ],
  "how-to-nap-without-feeling-groggy": [
    { label: "Sleep for nurses", href: "/profession/nurse" },
    { label: "Sleep for truck drivers", href: "/profession/truck-driver" },
    { label: "Sleep for new parents", href: "/profession/new-parent" },
  ],
  "melatonin-for-sleep": [
    { label: "Sleeping with insomnia", href: "/sleep-with/insomnia" },
    { label: "Sleeping with ADHD", href: "/sleep-with/adhd" },
    { label: "Sleep for older adults (65+)", href: "/age/older-adult-65-plus" },
  ],
  "shift-work-sleep-disorder": [
    { label: "Sleep for nurses", href: "/profession/nurse" },
    { label: "Sleep for truck drivers", href: "/profession/truck-driver" },
    { label: "Sleeping with shift-work disorder", href: "/sleep-with/shift-work-disorder" },
  ],
  "sleep-and-weight-loss": [
    { label: "Sleeping with sleep apnea", href: "/sleep-with/sleep-apnea" },
    { label: "Sleep for adults (26–64)", href: "/age/adult-26-64-years" },
    { label: "Sleeping with acid reflux (GERD)", href: "/sleep-with/acid-reflux-gerd" },
  ],
  "sleep-debt-recovery": [
    { label: "Sleep for new parents", href: "/profession/new-parent" },
    { label: "Sleep for college students", href: "/profession/college-student" },
    { label: "Find your ideal bedtime", href: "/bedtime" },
  ],
  "sleep-deprivation-effects": [
    { label: "Sleep for truck drivers", href: "/profession/truck-driver" },
    { label: "Sleep for nurses", href: "/profession/nurse" },
    { label: "Sleeping with insomnia", href: "/sleep-with/insomnia" },
  ],
  "sleep-hygiene-tips": [
    { label: "Sleeping with insomnia", href: "/sleep-with/insomnia" },
    { label: "Find your ideal wake-up time", href: "/sleep-time" },
    { label: "Find your ideal bedtime", href: "/bedtime" },
  ],
  "why-do-i-wake-up-tired": [
    { label: "Sleeping with sleep apnea", href: "/sleep-with/sleep-apnea" },
    { label: "Sleeping with insomnia", href: "/sleep-with/insomnia" },
    { label: "Sleep for adults (26–64)", href: "/age/adult-26-64-years" },
  ],
};
