# Project Showcase Workflow

Use this workflow once per project to create a presentation, speaker script, and polished case study from the project repository and any available live demo.

## How to use

Copy the prompt below into a new Codex task, replace the values in the `PROJECT INPUTS` section, and attach any extra screenshots, links, or documents you want included.

```text
You are preparing a professional project showcase for one project. Work from the project files, repository history, live demo, and attached material that are actually available.

PROJECT INPUTS
- Project name: [NAME]
- Project path or repository URL: [PATH OR URL]
- Live demo URL: [URL OR NONE]
- Intended audience: [RECRUITER / CLIENT / INVESTOR / TECHNICAL REVIEWER / GENERAL]
- Presentation purpose: [PORTFOLIO / INTERVIEW / DEMO DAY / CASE STUDY / OTHER]
- Desired tone: [CLEAR, PROFESSIONAL, CONCISE]
- Target presentation length: [for example, 7 slides]
- Target spoken script length: [for example, 2 minutes]
- Known constraints or required points: [LIST OR NONE]

PRIMARY OBJECTIVE
Create a complete, evidence-based showcase for this project. Focus on the presentation and the script/case study. Do not create or plan a video unless explicitly requested.

SKILL AND TOOL ROUTING
Use the following exact skills when they are relevant and available:
- `github:github` — understand a remote GitHub repository, issues, pull requests, and repository context.
- `browser:control-in-app-browser` — inspect a live web app in the in-app browser and capture screenshots.
- `vercel:agent-browser` — navigate a local dev server or website, interact with the UI, and capture screenshots.
- `vercel:agent-browser-verify` — perform a visual and browser smoke check after starting a local dev server.
- `imagegen` — create non-product visuals such as a cover image, illustration, texture, or presentation thumbnail.
- `visualize:visualize` — create architecture diagrams, flow diagrams, charts, plots, or other explanatory visuals.
- `presentations:Presentations` — create or edit the `.pptx` presentation and verify its layout.
- `documents:documents` — create or edit the `.docx` case study or supporting project document.

Use these optional skills only when the project needs them:
- `vercel:verification` — verify the complete browser-to-API-to-data flow of a deployed application.
- `vercel:vercel-api` — inspect Vercel deployments, domains, or live project metadata.
- `spreadsheets:Spreadsheets` — analyze project metrics, experiment results, or evaluation exports.
- `pdf:pdf` — render and inspect an exported PDF version of the presentation or case study.

Useful supporting tools:
- `shell_command` — inspect files, run the project, execute tests, and collect local evidence.
- `view_image` — inspect existing screenshots and visual assets before selecting them for the deck.
- `web__run` — verify public facts or referenced sources and include citations; never use it as a substitute for repository evidence.
- `codex_app__load_workspace_dependencies` — locate the bundled runtimes and libraries before creating slides, documents, or spreadsheets.

Do not use `imagegen` to fabricate product screenshots, user results, or evidence; screenshots must come from the actual project or be clearly labeled as mockups.

WORKFLOW
1. Inspect the project before writing.
   - Identify the problem, target user, main workflow, key features, technology choices, architecture, data sources, integrations, and current project status.
   - Read the README, package/configuration files, important source files, tests, and relevant documentation.
   - If a live demo is available, use `browser:control-in-app-browser` for the in-app browser or `vercel:agent-browser` for a local dev server/website to inspect the main user journey and capture clean screenshots of the strongest screens.
   - If a local dev server is started, use `vercel:agent-browser-verify` for a visual smoke check when appropriate.
   - If this is a GitHub repository, use `github:github` and repository history/issues/PRs only when they are accessible and relevant.

2. Establish evidence and limitations.
   - Separate verified facts from reasonable interpretation.
   - Never invent users, revenue, performance numbers, benchmark scores, adoption, testimonials, or production claims.
   - Label results as local, tested, live, or unverified.
   - If a requested fact cannot be verified, write `[NEEDS EVIDENCE]` and explain what would verify it.
   - Record important assumptions and missing inputs in a short final section.

3. Build the presentation narrative.
   Use this sequence unless the project clearly needs a better one:
   - Slide 1: Project title, one-line value proposition, and strongest visual
   - Slide 2: Problem, target user, and why the problem matters
   - Slide 3: Solution overview and primary user journey
   - Slide 4: Product walkthrough with screenshots or a key interaction
   - Slide 5: Technical approach, architecture, or important implementation decision
   - Slide 6: Results, validation, or current proof of functionality
   - Slide 7: Lessons learned, limitations, and next steps

   For every slide, provide:
   - Slide title
   - Main message
   - 3 to 5 concise on-slide points maximum
   - Recommended visual or screenshot
   - Speaker notes
   - Evidence source or file path

   Use `visualize:visualize` for architecture, workflow, or results diagrams when a diagram communicates the idea more clearly than prose. Use `imagegen` only for supporting presentation artwork, not evidence.

4. Write the spoken script.
   - Write a natural script that follows the slide order.
   - Include a strong opening, a clear explanation of the problem, a concrete product walkthrough, the most important technical decision, honest validation, and a memorable closing.
   - Keep it within the requested spoken length.
   - Use plain language and define technical terms when the audience is non-technical.
   - Mark any claim that still needs evidence.

5. Write the case study.
   Use these sections:
   - Project overview
   - Problem and audience
   - Goals and constraints
   - Solution and key user flow
   - Design and technical decisions
   - Implementation highlights
   - Validation and results
   - Challenges and tradeoffs
   - What I learned
   - Future improvements
   - Technologies used

   Make the case study portfolio-ready, specific, and first-person where appropriate. Do not turn it into generic marketing copy.

6. Prepare the final deliverables.
   Create or return:
   - A slide-by-slide presentation outline with speaker notes
   - A complete spoken presentation script
   - A polished Markdown case study
   - A screenshot/evidence checklist with suggested filenames and captions
   - A short list of missing evidence, assumptions, and follow-up actions

   If file creation is supported and appropriate:
   - Use `presentations:Presentations` to create a `.pptx` deck.
   - Use `documents:documents` to create a `.docx` case study.
   - If metrics or experiment exports are provided, use `spreadsheets:Spreadsheets` to inspect them before reporting results.
   - If deployment evidence is important, use `vercel:verification` and/or `vercel:vercel-api` where applicable.
   - If a PDF is supplied or exported, use `pdf:pdf` to render and inspect its layout.
   - Save screenshots in a clearly named project evidence folder.
   - Keep source claims traceable to repository files, tests, screenshots, or live verification.

7. Perform a quality review before finishing.
   Check that:
   - The presentation tells one coherent story rather than listing random features.
   - The strongest visual appears early.
   - Slides are readable and not overloaded with text.
   - The script matches the slides and requested duration.
   - The case study explains both what was built and why decisions were made.
   - Technical claims are accurate and evidence-backed.
   - Limitations are visible rather than hidden.
   - The project status is explicitly described as prototype, local demo, deployed demo, or production where supported by evidence.

FINAL RESPONSE FORMAT
Start with a short project summary and a status label. Then provide the deliverables in this order:
1. Presentation overview
2. Slide-by-slide content and speaker notes
3. Complete spoken script
4. Case study
5. Screenshot/evidence checklist
6. Assumptions, missing evidence, and recommended next actions

Do not claim that a file, screenshot, deployment, test, or metric exists unless you verified it.
```

## Recommended project inputs

The minimum useful inputs are:

- Project name
- Local project folder or GitHub URL
- Live demo URL, if one exists
- Audience
- Desired presentation length
- Desired script length

If you do not know the audience or length, use `general portfolio audience`, `7 slides`, and `2 minutes`.

## Suggested output files

For a project named `example-project`, use a structure such as:

```text
showcase/example-project/
  presentation-outline.md
  presentation-script.md
  case-study.md
  evidence-checklist.md
  screenshots/
```

The workflow can later be extended to create a `.pptx` deck and `.docx` case study, but the Markdown outputs should remain the source of truth because they are easy to review and update.
