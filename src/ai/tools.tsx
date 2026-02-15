import { tool as createTool } from "ai";
import { z } from "zod";
import fs from "fs";
import path from "path";
import sharp from "sharp";

async function getImageDimensions(filepath: string) {
  const metadata = await sharp(filepath).metadata();
  return {
    width: metadata.width || 800,
    height: metadata.height || 600,
  };
}

const CompetitionEnum = z.enum([
  "QCAF",
  "ASL",
  "QAFC",
  "AAL",
  "APL",
  "ABL",
  "BJPP",
  "BJL",
  "BSB",
  "BSA",
  "CPD",
  "CSL",
  "CLP",
  "PRVA",
  "DELP",
  "DSU",
  "ELC",
  "PL",
  "FLC",
  "EL1",
  "ENL",
  "EL2",
  "FAC",
  "COM",
  "VEI",
  "FL2",
  "FPL",
  "FL1",
  "REG",
  "GSC",
  "BL3",
  "BLREL",
  "BL1",
  "BL2",
  "DFB",
  "GSL",
  "HNB",
  "ILH",
  "SA",
  "SB",
  "CIT",
  "ISC",
  "IPL",
  "JJL",
  "LMX",
  "KNV",
  "DED",
  "DJL",
  "TIP",
  "QOFC",
  "PPD",
  "PPL",
  "RL1",
  "RFPL",
  "CLI",
  "CA",
  "QCBL",
  "SD",
  "CDR",
  "PD",
  "ALL",
  "SSL",
  "TSL",
  "UPL",
  "MLS",
  "SUCU",
  "OLY",
  "WC",
  "QCCF",
]);

interface CompetitionInfo {
  id: number;
  code: string;
  name: string;
  region: string;
}

const competitionDetails: Record<string, CompetitionInfo> = {
  QCAF: {
    id: 2006,
    code: "QCAF",
    name: "WC Qualification CAF",
    region: "Africa",
  },
  ASL: { id: 2024, code: "ASL", name: "Liga Profesional", region: "Argentina" },
  QAFC: {
    id: 2147,
    code: "QAFC",
    name: "WC Qualification AFC",
    region: "Asia",
  },
  AAL: { id: 2008, code: "AAL", name: "A League", region: "Australia" },
  APL: { id: 2022, code: "APL", name: "Playoffs 1/2", region: "Austria" },
  ABL: { id: 2012, code: "ABL", name: "Bundesliga", region: "Austria" },
  BJPP: { id: 2032, code: "BJPP", name: "Playoffs", region: "Belgium" },
  BJL: { id: 2009, code: "BJL", name: "Jupiler Pro League", region: "Belgium" },
  BSB: {
    id: 2029,
    code: "BSB",
    name: "Campeonato Brasileiro Série B",
    region: "Brazil",
  },
  BSA: {
    id: 2013,
    code: "BSA",
    name: "Campeonato Brasileiro Série A",
    region: "Brazil",
  },
  CPD: { id: 2048, code: "CPD", name: "Primera División", region: "Chile" },
  CSL: {
    id: 2044,
    code: "CSL",
    name: "Chinese Super League",
    region: "China PR",
  },
  CLP: { id: 2045, code: "CLP", name: "Liga Postobón", region: "Colombia" },
  PRVA: { id: 2047, code: "PRVA", name: "Prva Liga", region: "Croatia" },
  DELP: {
    id: 2141,
    code: "DELP",
    name: "Euro League - Playoff",
    region: "Denmark",
  },
  DSU: { id: 2050, code: "DSU", name: "Superliga", region: "Denmark" },
  ELC: { id: 2016, code: "ELC", name: "Championship", region: "England" },
  PL: { id: 2021, code: "PL", name: "Premier League", region: "England" },
  FLC: {
    id: 2139,
    code: "FLC",
    name: "Football League Cup",
    region: "England",
  },
  EL1: { id: 2030, code: "EL1", name: "League One", region: "England" },
  ENL: { id: 2053, code: "ENL", name: "National League", region: "England" },
  EL2: { id: 2054, code: "EL2", name: "League Two", region: "England" },
  FAC: { id: 2055, code: "FAC", name: "FA Cup", region: "England" },
  COM: {
    id: 2056,
    code: "COM",
    name: "FA Community Shield",
    region: "England",
  },
  VEI: { id: 2031, code: "VEI", name: "Veikkausliiga", region: "Finland" },
  FL2: { id: 2142, code: "FL2", name: "Ligue 2", region: "France" },
  FPL: { id: 2143, code: "FPL", name: "Playoffs 1/2", region: "France" },
  FL1: { id: 2015, code: "FL1", name: "Ligue 1", region: "France" },
  REG: { id: 2129, code: "REG", name: "Regionalliga", region: "Germany" },
  GSC: { id: 2134, code: "GSC", name: "DFL Super Cup", region: "Germany" },
  BL3: { id: 2140, code: "BL3", name: "3. Bundesliga", region: "Germany" },
  BLREL: { id: 2156, code: "BLREL", name: "Relegation", region: "Germany" },
  BL1: { id: 2002, code: "BL1", name: "Bundesliga", region: "Germany" },
  BL2: { id: 2004, code: "BL2", name: "2. Bundesliga", region: "Germany" },
  DFB: { id: 2011, code: "DFB", name: "DFB-Pokal", region: "Germany" },
  GSL: { id: 2132, code: "GSL", name: "Super League", region: "Greece" },
  HNB: { id: 2128, code: "HNB", name: "NB I", region: "Hungary" },
  ILH: { id: 2125, code: "ILH", name: "Ligat ha'Al", region: "Israel" },
  SA: { id: 2019, code: "SA", name: "Serie A", region: "Italy" },
  SB: { id: 2121, code: "SB", name: "Serie B", region: "Italy" },
  CIT: { id: 2122, code: "CIT", name: "Coppa Italia", region: "Italy" },
  ISC: { id: 2123, code: "ISC", name: "Serie C", region: "Italy" },
  IPL: { id: 2158, code: "IPL", name: "Playoffs 1/2", region: "Italy" },
  JJL: { id: 2119, code: "JJL", name: "J. League", region: "Japan" },
  LMX: { id: 2113, code: "LMX", name: "Liga MX", region: "Mexico" },
  KNV: { id: 2109, code: "KNV", name: "KNVB Beker", region: "Netherlands" },
  DED: { id: 2003, code: "DED", name: "Eredivisie", region: "Netherlands" },
  DJL: { id: 2005, code: "DJL", name: "Eerste Divisie", region: "Netherlands" },
  TIP: { id: 2106, code: "TIP", name: "Tippeligaen", region: "Norway" },
  QOFC: {
    id: 2103,
    code: "QOFC",
    name: "WC Qualification OFC",
    region: "Oceania",
  },
  PPD: { id: 2101, code: "PPD", name: "Primera División", region: "Peru" },
  PPL: { id: 2017, code: "PPL", name: "Primeira Liga", region: "Portugal" },
  RL1: { id: 2094, code: "RL1", name: "Liga I", region: "Romania" },
  RFPL: { id: 2137, code: "RFPL", name: "RFPL", region: "Russia" },
  CLI: {
    id: 2152,
    code: "CLI",
    name: "Copa Libertadores",
    region: "South America",
  },
  CA: { id: 2080, code: "CA", name: "Copa America", region: "South America" },
  QCBL: {
    id: 2082,
    code: "QCBL",
    name: "WC Qualification CONMEBOL",
    region: "South America",
  },
  SD: { id: 2077, code: "SD", name: "Segunda División", region: "Spain" },
  CDR: { id: 2079, code: "CDR", name: "Copa del Rey", region: "Spain" },
  PD: { id: 2014, code: "PD", name: "Primera Division", region: "Spain" },
  ALL: { id: 2073, code: "ALL", name: "Allsvenskan", region: "Sweden" },
  SSL: { id: 2072, code: "SSL", name: "Super League", region: "Switzerland" },
  TSL: { id: 2070, code: "TSL", name: "Süper Lig", region: "Turkey" },
  UPL: { id: 2064, code: "UPL", name: "Premier Liha", region: "Ukraine" },
  MLS: { id: 2145, code: "MLS", name: "MLS", region: "United States" },
  SUCU: {
    id: 2148,
    code: "SUCU",
    name: "Supercopa Uruguaya",
    region: "Uruguay",
  },
  OLY: { id: 2153, code: "OLY", name: "Summer Olympics", region: "World" },
  WC: { id: 2000, code: "WC", name: "FIFA World Cup", region: "World" },
  QCCF: {
    id: 2155,
    code: "QCCF",
    name: "WC Qualification CONCACAF",
    region: "World",
  },
};

let footballCompetitionDescription =
  "The competition where the team plays mostly. Available codes:\n" +
  "- International & World: WC (FIFA World Cup), OLY (Summer Olympics)\n" +
  "- England: PL (Premier League), ELC (Championship), EL1 (League One), EL2 (League Two), ENL (National League), FAC (FA Cup), FLC (League Cup), COM (Community Shield)\n" +
  "- France: FL1 (Ligue 1), FL2 (Ligue 2), FPL (Playoffs)\n" +
  "- Germany: BL1 (Bundesliga), BL2 (2. Bundesliga), BL3 (3. Bundesliga), DFB (DFB-Pokal), GSC (Super Cup), REG (Regionalliga), BLREL (Relegation)\n" +
  "- Italy: SA (Serie A), SB (Serie B), ISC (Serie C), CIT (Coppa Italia), IPL (Playoffs)\n" +
  "- Spain: PD (Primera Division), SD (Segunda División), CDR (Copa del Rey)\n" +
  "- Other European Leagues: PPL (Primeira Liga Portugal), DED (Eredivisie Netherlands), BJL (Jupiler Pro League Belgium), ABL (Bundesliga Austria), DSU (Superliga Denmark), SSL (Super League Switzerland), UPL (Premier League Ukraine), RFPL (Premier League Russia)\n" +
  "- Americas: BSA (Brasileirão Série A), BSB (Brasileirão Série B), MLS (Major League Soccer), LMX (Liga MX), CLI (Copa Libertadores), CA (Copa America)\n" +
  "- Asian & Others: CSL (Chinese Super League), JJL (J.League Japan), AAL (A-League Australia)\n" +
  "- World Cup Qualifiers: QCAF (Africa), QAFC (Asia), QUFA (Europe), QOFC (Oceania), QCBL (South America), QCCF (North America)";

const username = process.env.NEXT_PUBLIC_USER_NAME;

const ResumeTool = {
  name: "getResume",
  description: `Render ${username}'s resume. Use this tool when users want to see or learn about the resume.`,
  tool: createTool({
    description: `Render ${username}'s resume.`,
    parameters: z.object({}),
    execute: async () => {
      const resume = `You should now provide a short introductive sentence in user's last message language summarizing ${username}'s profile: 5+ years of experience designing scalable, AI-driven applications. Expertise in developing robust systems, managing cloud infrastructure, and delivering impactful solutions for startups and enterprises. Keep it factual and professional. Not more than 30 words !!!! Do NOT include any image, link, or URL in your response.`;
      return resume;
    },
  }),
};

const ExperienceTool = {
  name: "getExperience",
  description: `Display ${username}'s professional experience. Use this tool when discussing career history, work achievements, or professional background.`,
  tool: createTool({
    description: `This tool allows the chatbot to render ${username}'s professional experience. Use this tool sparingly and strategically to enhance responses when relevant. It's beneficial to showcase the experience to provide concrete examples of skills and achievements, but avoid overuse. The tool should complement natural conversation rather than dominate it.`,
    parameters: z.object({
      experiences: z.array(
        z.object({
          company: z.string().describe("Company or organization name"),
          position: z.string().describe("Job title or position"),
          startDate: z.string().describe("Start date of employment"),
          endDate: z.string().describe("End date of employment"),
          website: z.string().optional().describe("Website of the company"),
        }),
      ),
    }),
    execute: async ({ experiences }) => {
      const result = {
        content: `This message has triggered the rendering of ${username}'s professional experience. You should now provide a really short and concise sentence in user's last message language to the user to introduce ${username}'s professional experience as this message already provides thes experiences to the user. Not more than 20 words !!!!`,
        experiences: experiences,
      };
      return result;
    },
  }),
};

const WeatherTool = {
  name: "getWeather",
  description:
    "Get the current weather at a location. If you don't have the location, you should ask the user the city he wants to know the weather of.",
  tool: createTool({
    description: "Get the current weather at a location.",
    parameters: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    execute: async ({ latitude, longitude }) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
      );

      const weatherData = await response.json();
      return weatherData;
    },
  }),
};

const DisplayLocationTool = {
  name: "getLocation",
  description:
    "If the user ask for the weather but doesn't provide a location, this tool should display a list of 4 famous random cities in the world.",
  tool: createTool({
    description:
      "Display a list of 4 famous random cities in the world. The cities should be in the user's language.",
    parameters: z.object({
      cities: z
        .array(z.string())
        .describe("Array of 4 famous random cities in the world"),
    }),
    execute: async ({ cities }) => {
      const result = {
        content:
          "Tell the user that he has provide a city he wants to know the weather of or click on one of the following cities. Don't mention the cities in your response.",
        cities: cities,
      };
      return result;
    },
  }),
};

const ContactTool = {
  name: "getContact",
  description: `Display the contact form to get in touch with ${username}. Use this when users want to reach out or communicate.`,
  tool: createTool({
    description: "Display the contact form.",
    parameters: z.object({}),
    execute: async () => {
      const contact = `You should now provide a really short and concise sentence in user's last message language to the user to introduce ${username}'s Contact form as this message already contains the contact form. Not more than 20 words !!!!`;
      return contact;
    },
  }),
};

const PhotosTool = {
  name: "getPhotos",
  description: `Display ${username}'s photo gallery.`,
  tool: createTool({
    description: `This tool allows the chatbot to display ${username}'s photo gallery.`,
    parameters: z.object({}),
    execute: async () => {
      const photosDir = path.join(process.cwd(), "public/photos");
      const files = fs.readdirSync(photosDir);

      const shuffleArray = (array: string[]) => {
        let seed = Math.floor(Date.now() / (1000 * 60 * 60));

        const seededRandom = () => {
          const newSeed = (seed * 9301 + 49297) % 233280;
          seed = newSeed;
          return newSeed / 233280;
        };

        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(seededRandom() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      const shuffledFiles = shuffleArray(
        files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file)),
      );

      const photos = await Promise.all(
        shuffledFiles.map(async (file, index) => {
          const dimensions = await getImageDimensions(`${photosDir}/${file}`);
          return {
            url: `/photos/${file}`,
            alt: `Photo ${index + 1}`,
            width: dimensions.width,
            height: dimensions.height,
          };
        }),
      );

      const result = {
        content: `You should now provide a really short and impressive sentence in user's last message language to highlight ${username}'s talent and artistic eye for street photography. Be enthusiastic and complimentary, this is a portfolio. Emphasize ${username}'s creativity and unique perspective. Not more than 25 words !!!! Do NOT include any image, link, or URL in your response.`,
        photos: photos,
      };

      return result;
    },
  }),
};

const FootballTool = {
  name: "getFootball",
  description:
    "Get the match history for football teams. Use this when discussing sports results or team performance. If you don't have the team name, you should ask the user the team name.",
  tool: createTool({
    description: "Get the history of games of a football team",
    parameters: z.object({
      team: z
        .array(z.string())
        .describe(
          'Array of all possibles team name variations (e.g. ["PSG", "Paris Saint-Germain", "Paris SG", ...] for PSG, adapt to the users team name)',
        ),
      competition: CompetitionEnum.describe(footballCompetitionDescription),
    }),
    execute: async ({ team, competition }) => {
      const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
      const BASE_URL = "https://api.football-data.org/v4";

      let competitionId = competitionDetails[competition].id;

      const teamsResponse = await fetch(
        `${BASE_URL}/competitions/${competitionId}/teams`,
        {
          headers: {
            "X-Auth-Token": API_KEY as string,
          },
        },
      );

      const teamsData = await teamsResponse.json();

      // Find matching team from the list
      const matchingTeam = teamsData.teams?.find((t: any) =>
        team.some(
          (searchName) =>
            t.name.toLowerCase().includes(searchName.toLowerCase()) ||
            t.shortName?.toLowerCase().includes(searchName.toLowerCase()) ||
            t.tla?.toLowerCase() === searchName.toLowerCase(),
        ),
      );

      if (!matchingTeam) {
        return {
          content: `You should now provide a really short and concise sentence in user's last message language to the user to prevent him that we didn't find the team he is talking about in our database. Not more than 20 words !!!!`,
          matches: [],
        };
      }

      const teamId = matchingTeam.id;

      // Get the matches
      const matchesResponse = await fetch(
        `${BASE_URL}/teams/${teamId}/matches?status=FINISHED&limit=3`,
        {
          headers: {
            "X-Auth-Token": API_KEY as string,
          },
        },
      );

      const matchesData = await matchesResponse.json();

      const result = {
        content: `Games data are already provided to the user. You have now to provide a really short and concise sentence to introduce the result and that he can find the result just below. Do not mention the games again in your response. Not more than 20 words !!!! Example of sentence in 11 words, not more : "You will find here below the last 3 games of ${team[0]}." Translate the sentence in user's last message language.`,
        matches: matchesData.matches,
      };

      return result;
    },
  }),
};

const GitHubTool = {
  name: "getGithub",
  description: `Display ${username}'s GitHub activity and contribution graph. Use this when users ask about GitHub activity, contributions, coding activity, or open source work.`,
  tool: createTool({
    description: `Display ${username}'s GitHub contribution graph.`,
    parameters: z.object({}),
    execute: async () => {
      const token = process.env.GITHUB_TOKEN;
      const githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME;

      if (!token || !githubUsername) {
        return {
          content: `GitHub configuration is missing.`,
          contributions: null,
        };
      }

      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      const fromDate = sixMonthsAgo.toISOString();
      const toDate = now.toISOString();

      const query = `
                query($username: String!, $from: DateTime!, $to: DateTime!) {
                    user(login: $username) {
                        contributionsCollection(from: $from, to: $to) {
                            totalCommitContributions
                            totalPullRequestContributions
                            totalIssueContributions
                            totalRepositoryContributions
                            contributionCalendar {
                                totalContributions
                                weeks {
                                    contributionDays {
                                        contributionCount
                                        contributionLevel
                                        date
                                    }
                                }
                            }
                        }
                    }
                }
            `;

      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { username: githubUsername, from: fromDate, to: toDate },
        }),
      });

      const data = await response.json();
      const contributions = data?.data?.user?.contributionsCollection;

      return {
        content: `You should now provide a really short and impressive sentence in user's last message language to highlight ${username}'s dedication and work ethic based on their GitHub activity. Be enthusiastic and complimentary, this is a portfolio. Emphasize how active and committed ${username} is as a developer. Not more than 25 words !!!! Do NOT include any image, link, or URL in your response.`,
        totalContributions:
          contributions?.contributionCalendar?.totalContributions,
        totalCommits: contributions?.totalCommitContributions,
        totalPRs: contributions?.totalPullRequestContributions,
        totalIssues: contributions?.totalIssueContributions,
        totalRepos: contributions?.totalRepositoryContributions,
        weeks: contributions?.contributionCalendar?.weeks,
      };
    },
  }),
};

export const tools = {
  getResume: ResumeTool,
  getExperience: ExperienceTool,
  getWeather: WeatherTool,
  getLocation: DisplayLocationTool,
  getPhotos: PhotosTool,
  getContact: ContactTool,
  getFootball: FootballTool,
  getGithub: GitHubTool,
};
