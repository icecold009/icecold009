import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const WIDTH = 1450;
const HEIGHT = 480;
const GRID_X = 118;
const GRID_Y = 232;
const CELL_STEP = 24;
const CELL_RADIUS = 9;
const COLORS = ["#101314", "#07532d", "#087f3f", "#09ad53", "#00d46a"];
const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const parseDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${value}`);
  return date;
};

const dateIso = (date) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const startOfWeek = (date) => addDays(date, -date.getUTCDay());

const todayIso = () => dateIso(new Date());

const getRange = () => {
  const to = parseDate(process.env.CONTRIBUTION_TO || todayIso());
  const from = parseDate(process.env.CONTRIBUTION_FROM || dateIso(addDays(to, -364)));
  return { from, to };
};

const queryGitHub = async (username, from, to) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required when no fixture is supplied");

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "icecold009-profile-contribution-card",
    },
    body: JSON.stringify({
      query: `
        query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              totalContributions
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        login: username,
        from: `${dateIso(from)}T00:00:00Z`,
        to: `${dateIso(to)}T23:59:59Z`,
      },
    }),
  });

  if (!response.ok) throw new Error(`GitHub GraphQL request failed: ${response.status}`);
  const payload = await response.json();
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join("; "));

  const calendar = payload.data?.user?.contributionsCollection;
  if (!calendar) throw new Error(`GitHub user not found: ${username}`);

  return {
    total: calendar.totalContributions,
    days: calendar.contributionCalendar.weeks.flatMap((week) => week.contributionDays),
  };
};

const buildColumns = (data, from, to) => {
  if (Array.isArray(data.columns)) return data.columns;

  const levels = new Map(data.days.map((day) => [day.date, LEVELS[day.contributionLevel] ?? 0]));
  const firstWeek = startOfWeek(from);
  const lastWeek = startOfWeek(to);
  const columns = [];

  for (let week = firstWeek; week <= lastWeek; week = addDays(week, 7)) {
    const column = [];
    for (let day = 0; day < 7; day += 1) {
      const date = addDays(week, day);
      const iso = dateIso(date);
      column.push(date < from || date > to ? 0 : levels.get(iso) ?? 0);
    }
    columns.push(column.join(""));
  }

  return columns;
};

const monthLabels = (columns, from, to) => {
  const labels = [];
  let previousMonth = "";
  const firstWeek = startOfWeek(from);
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

  columns.forEach((_, index) => {
    const week = addDays(firstWeek, index * 7);
    const visibleDate = Array.from({ length: 7 }, (_, day) => addDays(week, day))
      .find((date) => date >= from && date <= to);
    if (!visibleDate) return;
    const month = formatter.format(visibleDate);
    if (month !== previousMonth) {
      labels.push({ label: month, index });
      previousMonth = month;
    }
  });

  return labels;
};

const renderSvg = ({ username, total, columns, from, to }) => {
  const count = new Intl.NumberFormat("en-US").format(total);
  const dates = `${dateIso(from)} to ${dateIso(to)}`;
  const title = `GitHub contribution activity for ${username}: ${count} contributions in the last year`;
  const months = monthLabels(columns, from, to);
  const cells = columns.flatMap((column, columnIndex) => [...column].map((level, rowIndex) => {
    const x = GRID_X + columnIndex * CELL_STEP;
    const y = GRID_Y + rowIndex * CELL_STEP;
    return `<circle cx="${x}" cy="${y}" r="${CELL_RADIUS}" fill="${COLORS[Number(level)] ?? COLORS[0]}" stroke="#1a1f20" stroke-width="0.8" />`;
  })).join("");
  const labels = months.map(({ label, index }) => `<text x="${GRID_X + index * CELL_STEP - 10}" y="202" class="label">${label}</text>`).join("");
  const weekdays = [
    ["Mon", 1],
    ["Wed", 3],
    ["Fri", 5],
  ].map(([label, row]) => `<text x="69" y="${GRID_Y + row * CELL_STEP + 5}" class="label" text-anchor="end">${label}</text>`).join("");
  const legend = [0, 1, 2, 3, 4].map((level, index) => `<circle cx="${1201 + index * 28}" cy="419" r="9" fill="${COLORS[level]}" stroke="#1a1f20" stroke-width="0.8" />`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title>
  <desc id="description">A ${columns.length}-week GitHub contribution calendar for ${escapeXml(username)} from ${escapeXml(dates)}.</desc>
  <style>
    .eyebrow { fill: #8193a0; font: 18px/1 "Roboto Mono", "SFMono-Regular", Consolas, monospace; letter-spacing: 4px; }
    .heading { fill: #f5f7f8; font: 500 47px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .summary { fill: #8193a0; font: 20px/1 "Roboto Mono", "SFMono-Regular", Consolas, monospace; }
    .summaryCount { fill: #f5f7f8; font-weight: 700; }
    .label { fill: #8193a0; font: 15px/1 "Roboto Mono", "SFMono-Regular", Consolas, monospace; }
  </style>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#000" />
  <text x="30" y="43" class="eyebrow">ACTIVITY</text>
  <text x="30" y="105" class="heading">GitHub Contributions</text>
  <g aria-hidden="true" transform="translate(905 101)" fill="none" stroke="#7d8a92" stroke-width="2">
    <path d="M0 0h8m8 0h8M8 0v-6m8 6v6" />
    <circle cx="0" cy="0" r="3" fill="#000" />
    <circle cx="16" cy="-6" r="3" fill="#000" />
    <circle cx="16" cy="6" r="3" fill="#000" />
  </g>
  <text x="935" y="108" class="summary"><tspan class="summaryCount">${escapeXml(count)}</tspan><tspan dx="14">contributions in the last year</tspan></text>
  <rect x="30.5" y="153.5" width="1369" height="309" rx="24" fill="#000" stroke="#15191b" />
  <g font-family="Roboto Mono, SFMono-Regular, Consolas, monospace" font-size="15" fill="#8193a0">${labels}${weekdays}</g>
  <g aria-label="Contribution calendar">${cells}</g>
  <g font-family="Roboto Mono, SFMono-Regular, Consolas, monospace" font-size="15" fill="#8193a0">
    <text x="1150" y="424">Less</text>
    ${legend}
    <text x="1334" y="424">More</text>
  </g>
</svg>
`;
};

const main = async () => {
  const username = process.env.GITHUB_USERNAME || "icecold009";
  const fixturePath = process.argv[2];
  const { from, to } = getRange();
  const data = fixturePath
    ? JSON.parse(await readFile(resolve(fixturePath), "utf8"))
    : await queryGitHub(username, from, to);
  const columns = buildColumns(data, from, to);
  if (columns.length > 54) throw new Error(`Expected at most 54 calendar columns, received ${columns.length}`);

  const outputPath = resolve(process.env.CONTRIBUTION_OUTPUT || "dist/github-contribution-activity.svg");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderSvg({ username, total: data.total, columns, from, to }), "utf8");
  console.log(`Wrote ${outputPath} for ${data.total} contributions (${dateIso(from)} to ${dateIso(to)}).`);
};

await main();
