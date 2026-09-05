"""
─────────────────────────────────────────────────────────────────────────────
CAUSARIX™ REGION-TAILORED SMB ADVICE COLD EMAIL GENERATOR (INDIA & US)
─────────────────────────────────────────────────────────────────────────────
Generates ultra-short (<60 words) personalized founder-to-founder advice emails
tailored for India & US SMB founders and tech leaders.
"""

import csv
import os

TEMPLATES = {
    "India": {
        "subject": "Quick advice from a fellow founder in India?",
        "body": """Hi {first_name},

Came across your work at {company} — huge respect for what you've built in the Indian startup ecosystem.

I'm building Causarix (an institutional governance OS that automates India DPDP Act 2023 compliance, MCA board resolutions, and 0.00% math-drift financial forecasting).

Not selling anything — would genuinely love 2 minutes of your candid feedback on our interactive sandbox:
👉 https://causarix.vercel.app/demo

Any chance you’d be open to sharing your thoughts?

Best,
Shourya
Founder, Causarix
"""
    },
    "US": {
        "subject": "Quick advice from a fellow founder?",
        "body": """Hi {first_name},

Came across your work at {company} — huge fan of what you're building.

I'm an ambitious founder building Causarix (an air-gapped governance OS that seals boardroom decisions with Delaware DGCL § 141 SHA-256 Merkle proofs to protect directors under the Business Judgment Rule).

Not selling anything — would genuinely value 2 minutes of your expert feedback on our live sandbox:
👉 https://causarix.vercel.app/demo

Open to sharing your quick impressions?

Best,
Shourya
Founder, Causarix
"""
    }
}

def generate_smb_campaign():
    input_path = os.path.join(os.getcwd(), "data", "causarix_smb_leads.csv")
    output_path = os.path.join(os.getcwd(), "data", "causarix_smb_email_campaign.csv")
    
    if not os.path.exists(input_path):
        print("[-] No SMB leads file found.")
        return
        
    generated = []
    with open(input_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_name = row["name"].strip()
            first_name = raw_name.split()[0] if " " in raw_name else raw_name
            region = row.get("region", "US")
            company = row.get("company_source", "your team").split("(")[0].strip()
            
            tmpl = TEMPLATES.get(region, TEMPLATES["US"])
            subject = tmpl["subject"]
            body = tmpl["body"].format(first_name=first_name, company=company)
            
            generated.append({
                "to_name": raw_name,
                "to_email": row["email"],
                "region": region,
                "company": company,
                "subject": subject,
                "email_body": body
            })
            
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["to_name", "to_email", "region", "company", "subject", "email_body"])
        writer.writeheader()
        writer.writerows(generated)
        
    print(f"\n🎉 Generated {len(generated)} region-tailored SMB email drafts!")
    print(f"📁 Campaign saved to: {output_path}")

if __name__ == "__main__":
    generate_smb_campaign()
