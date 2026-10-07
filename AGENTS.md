# Handover: "Bar the Line" / The Bar Party

**Goal:** A satirical UK campaign against single-file queueing in pubs, bars and breweries, framed as a mock political party.

## Deliverables

All files are in `/mnt/user-data/outputs/`.

- **Landing page:** Design artifact at https://claude.ai/artifact/VQk6yjEdCu5YtDmXXsqKqb
  - Source: `artifacts/e6108d6a-1ed5-4e1f-9a5c-75f720b5b46a/project/Main.dc.html` plus `canvas.json`
  - To edit, change those files and republish with the artifact `url`. Don't create a new canvas.
- **`uk_pub_campaign_contacts.xlsx`:** 17 trade body and pub group contacts, colour-coded by confidence.
- **`london_breweries_contacts.xlsx`:** 84 London breweries with websites, the London Brewers' Alliance emails (`hi@` and `pr@londonbrewers.org`), and only one confirmed brewery email (Five Points).
- **`find_brewery_emails.py`:** Local scraper that fills in the brewery emails.
  - The decoding is tested, but it hasn't been run against live sites.
  - Set `YOUR_EMAIL_HERE` in it before running.

## Open items

- **Landing page placeholders:** contact email, promoter name and address, domain, and backers.
- **Domain:** Ideas are `bartheline.uk` (top pick), `thebarparty.uk` and `stoptheline.uk`. Availability is unchecked.
- **Offered but not done:** press release and logo concept.

## Caveats

- **Sources:** The Guardian, Sun and Reddit links were blocked for me. The page's figures come from Metro and Broadsheet and are the brewery's own (service about 3x slower, +25% sales).
- **Existing campaign:** @QueuesPub has been running since 2023. Consider allying with them.
- **Legal:** PECR says sole traders and partnerships need consent before campaign emails. Include an opt-out and follow UK GDPR. I only collected role-based addresses.
- **Tools:** Brewery sites hide their emails, and fetching only works on URLs that appear in search results.
