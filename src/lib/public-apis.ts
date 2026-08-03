export interface PublicApiItem {
  id: string;
  name: string;
  description: string;
  category: 'Business & Finance' | 'Hospitality & Tourism' | 'Security & Compliance' | 'News & Intelligence' | 'Open Data & Gov' | 'AI & Analytics' | 'Development';
  url: string;
  auth: 'No' | 'apiKey' | 'OAuth' | 'User-Agent';
  https: boolean;
  cors: 'yes' | 'no' | 'unknown';
  icon?: string;
  connected?: boolean;
}

export const PUBLIC_APIS_CATALOG: PublicApiItem[] = [
  // Business & Finance
  {
    id: 'api-currencylayer',
    name: 'CurrencyExchange Rates API',
    description: 'Real-time and historical foreign exchange rates for 170+ currencies to calculate hotel & corporate billing.',
    category: 'Business & Finance',
    url: 'https://exchangerate-api.com',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-alpha-vantage',
    name: 'Alpha Vantage Stock & Financials',
    description: 'Real-time stock quotes, forex, economic indicators, and commodity prices for financial decision matrices.',
    category: 'Business & Finance',
    url: 'https://www.alphavantage.co',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-stripe-public',
    name: 'Stripe Billing & Payments',
    description: 'Payment processing, invoice tracking, customer subscriptions, and automated revenue reconciliation.',
    category: 'Business & Finance',
    url: 'https://stripe.com/docs/api',
    auth: 'OAuth',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-coin-gecko',
    name: 'CoinGecko Crypto & FX Market',
    description: 'Live cryptocurrency prices, market cap, volume, and cross-border settlement rates.',
    category: 'Business & Finance',
    url: 'https://www.coingecko.com/en/api',
    auth: 'No',
    https: true,
    cors: 'yes',
  },

  // Hospitality & Tourism
  {
    id: 'api-open-weather',
    name: 'OpenWeatherMap Global Weather',
    description: 'Hyper-local weather forecasts and extreme weather alerts for hotel locations, staffing, and event planning.',
    category: 'Hospitality & Tourism',
    url: 'https://openweathermap.org/api',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-google-places',
    name: 'Google Places & Local Intelligence',
    description: 'Local business details, guest reviews, competitor ratings, and geographic points of interest.',
    category: 'Hospitality & Tourism',
    url: 'https://developers.google.com/maps/documentation/places/web-service',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-flightaware',
    name: 'FlightAware Aviation Tracking',
    description: 'Flight schedules, airport arrivals, and flight delay metrics for airport shuttle and concierge automation.',
    category: 'Hospitality & Tourism',
    url: 'https://flightaware.com/commercial/flightxml/',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-tripadvisor-data',
    name: 'TripAdvisor Guest Sentiment',
    description: 'Hotel reviews, rating analytics, guest satisfaction scores, and reputation management metrics.',
    category: 'Hospitality & Tourism',
    url: 'https://developer-tripadvisor.com/',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },

  // Security & Compliance
  {
    id: 'api-ipify',
    name: 'Ipify IP Address Resolution',
    description: 'Public IP identification and regional network auditing for tenant security logging.',
    category: 'Security & Compliance',
    url: 'https://www.ipify.org',
    auth: 'No',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-hibp',
    name: 'Have I Been Pwned Breach Checker',
    description: 'Security breach monitoring for corporate emails and compromised credential audits.',
    category: 'Security & Compliance',
    url: 'https://haveibeenpwned.com/API/v3',
    auth: 'apiKey',
    https: true,
    cors: 'no',
  },
  {
    id: 'api-shodan',
    name: 'Shodan Security Threat Scanner',
    description: 'Exposed server ports, IoT devices, and infrastructure vulnerability scanning for multi-property networks.',
    category: 'Security & Compliance',
    url: 'https://developer.shodan.io/api',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-cve-circ',
    name: 'CIRCL Vulnerability & CVE Database',
    description: 'Real-time Common Vulnerabilities and Exposures (CVE) tracking for software compliance.',
    category: 'Security & Compliance',
    url: 'https://www.circ.lu/services/cve-search/',
    auth: 'No',
    https: true,
    cors: 'yes',
  },

  // News & Intelligence
  {
    id: 'api-news-api',
    name: 'Global News & Media Intelligence',
    description: 'Real-time news articles, industry trends, market announcements, and brand sentiment monitoring.',
    category: 'News & Intelligence',
    url: 'https://newsapi.org',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-hackernews',
    name: 'Hacker News Tech Trends',
    description: 'Trending technology topics, software engineering discussions, and AI ecosystem updates.',
    category: 'News & Intelligence',
    url: 'https://github.com/HackerNews/API',
    auth: 'No',
    https: true,
    cors: 'yes',
  },

  // Open Data & Gov
  {
    id: 'api-world-bank',
    name: 'World Bank Global Economic Data',
    description: 'Economic development indicators, inflation data, GDP growth rates, and regional trade metrics.',
    category: 'Open Data & Gov',
    url: 'https://datahelpdesk.worldbank.org/knowledgebase/topics/12558-developer-information',
    auth: 'No',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-data-gov-in',
    name: 'Data.gov.in Open Government India',
    description: 'Official Indian government datasets, GST compliance metrics, agricultural rates, and tourism stats.',
    category: 'Open Data & Gov',
    url: 'https://data.gov.in/data-api',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },

  // AI & Analytics
  {
    id: 'api-huggingface',
    name: 'Hugging Face Open Models',
    description: 'Open-source LLMs, document extraction transformers, and custom domain sentiment classifiers.',
    category: 'AI & Analytics',
    url: 'https://huggingface.co/docs/api-inference/index',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  },
  {
    id: 'api-openai-public',
    name: 'OpenAI Enterprise API',
    description: 'GPT-4o text generation, structured JSON extraction, and OpenAI embeddings API.',
    category: 'AI & Analytics',
    url: 'https://platform.openai.com/docs/api-reference',
    auth: 'apiKey',
    https: true,
    cors: 'yes',
  }
];

export async function fetchPublicApis(category?: string, query?: string): Promise<PublicApiItem[]> {
  let list = PUBLIC_APIS_CATALOG;

  if (category && category !== 'ALL') {
    list = list.filter(item => item.category === category);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }

  return list;
}
