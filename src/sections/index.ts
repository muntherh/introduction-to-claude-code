import type { ComponentType } from "react";
import type { SectionProps } from "@/components/PresentationSection";
import { ChatVsClaudeCodeSection } from "@/sections/ChatVsClaudeCodeSection";
import { ClaudeMdSection } from "@/sections/ClaudeMdSection";
import { ContextSection } from "@/sections/ContextSection";
import { ControlSection } from "@/sections/ControlSection";
import { FirstSessionSection } from "@/sections/FirstSessionSection";
import { GoodPromptSection } from "@/sections/GoodPromptSection";
import { HeroSection } from "@/sections/HeroSection";
import { HowItWorksSection } from "@/sections/HowItWorksSection";
import { InstallSection } from "@/sections/InstallSection";
import { PlanSection } from "@/sections/PlanSection";
import { QuizSection } from "@/sections/QuizSection";
import { ShipItSection } from "@/sections/ShipItSection";
import { SlashCommandsSection } from "@/sections/SlashCommandsSection";
import { SummarySection } from "@/sections/SummarySection";
import { WhatIsClaudeCodeSection } from "@/sections/WhatIsClaudeCodeSection";
import { WhereItLivesSection } from "@/sections/WhereItLivesSection";

/**
 * Running order, index-aligned with SLIDES in data/slides.ts. Index N here is
 * slide N there. Add to both in the same change, then walk the whole deck —
 * nothing checks the alignment for you, and a mismatch shows up as a wrong
 * slide number, usually noticed on stage.
 */
export const SECTION_COMPONENTS: ComponentType<SectionProps>[] = [
  HeroSection, //             01  hero
  WhatIsClaudeCodeSection, // 02  what-is-claude-code
  WhereItLivesSection, //     03  where-it-lives
  HowItWorksSection, //       04  how-it-works
  ContextSection, //          05  it-reads-your-project
  ChatVsClaudeCodeSection, // 06  chat-vs-claude-code
  ControlSection, //          07  you-are-in-control
  InstallSection, //          08  install
  FirstSessionSection, //     09  first-session
  GoodPromptSection, //       10  a-good-prompt
  PlanSection, //             11  working-in-steps
  ClaudeMdSection, //         12  claude-md
  SlashCommandsSection, //    13  slash-commands
  ShipItSection, //           14  ship-it
  QuizSection, //             15  quiz
  SummarySection, //          16  summary
];
