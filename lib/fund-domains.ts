// Map each tracked manager slug → the public-facing domain of their fund.
// Used by <FundLogo /> to render a favicon sourced from duckduckgo's icon
// CDN. DDG is chosen over Google Favicons because Google redirects to a
// gstatic URL with a cache-buster that can 404 intermittently; DDG serves
// a stable 32×32 PNG with strong HTTP caching.
//
// Domains are the operator-facing homepage (not their SEC filer URL). When
// a manager doesn't have a public site (family offices, some activists),
// we intentionally leave them out — <FundLogo /> falls back to an initial-
// letter circle. That's the honest outcome; fabricating a domain would
// yield a wrong or generic logo.

export const FUND_DOMAINS: Record<string, string> = {
  // The majors — all have solid brand sites
  "warren-buffett": "berkshirehathaway.com",
  "bill-ackman": "pershingsquareholdings.com",
  "carl-icahn": "icahnenterprises.com",
  "david-einhorn": "greenlightcapital.com",
  "seth-klarman": "baupost.com",
  "michael-burry": "scionasset.com",
  "howard-marks": "oaktreecapital.com",
  "monish-pabrai": "chaipartners.com",
  "joel-greenblatt": "gothamcapital.com",
  "stanley-druckenmiller": "duquesnefamilyoffice.com",
  "li-lu": "himalayacapital.com",
  "prem-watsa": "fairfax.ca",
  "bill-nygren": "oakmark.com",
  "glenn-greenberg": "brave-warrior.com",
  "andreas-halvorsen": "viking-global.com",
  "chris-hohn": "tcifund.com",
  "jeffrey-ubben": "inclusivecapital.com",
  "stephen-mandel": "lonepine.com",
  "lee-ainslie": "maverickcapital.com",
  "chuck-akre": "akrecapital.com",
  "terry-smith": "fundsmith.co.uk",
  "polen-capital": "polencapital.com",
  "david-tepper": "appaloosamgmt.com",
  "chase-coleman": "tigerglobal.com",
  "john-armitage": "egertoncapital.com",
  "david-rolfe": "wedgewoodpartners.com",
  "francois-rochon": "giverny.com",
  "dev-kantesaria": "vailcapital.com",
  "william-von-mueffling": "cantillon.com",
  "tom-slater": "bailliegifford.com",
};

export function fundDomainFor(slug: string): string | null {
  return FUND_DOMAINS[slug] ?? null;
}
