"""
─────────────────────────────────────────────────────────────────────────────
CAUSARIX™ ULTRA-SHORT ADVICE-SEEKING COLD EMAIL GENERATOR
─────────────────────────────────────────────────────────────────────────────
Crafts ultra-short (<65 words), respectful, founder-to-expert advice emails.
"""

import csv
import os

TEMPLATE_LEGAL = {
    "subject": "Quick advice from a fellow builder in legal AI?",
    "body": """Hi {first_name},

Came across your work on {source_repo} — huge fan of what you've built in legal tech.

I'm an ambitious founder building Causarix (an air-gapped governance OS that seals boardroom decisions with Delaware DGCL § 141 SHA-256 Merkle proofs to protect directors under the Business Judgment Rule).

Not selling anything — would genuinely value 2 minutes of your expert feedback on our live interactive sandbox:
👉 https://causarix.vercel.app/demo

Any chance you’d be open to sharing your candid thoughts?

Best,
Shourya
Founder, Causarix
"""
}

def generate_legal_campaign():
    input_path = os.path.join(os.getcwd(), "data", "causarix_legal_leads.csv")
    output_path = os.path.join(os.getcwd(), "data", "causarix_legal_email_campaign.csv")
    
    if not os.path.exists(input_path):
        print("[-] No legal leads file found.")
        return
        
    generated = []
    with open(input_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_name = row["name"].strip()
            first_name = raw_name.split()[0] if " " in raw_name else raw_name
            source = row.get("source_repo", "legal tech")
            repo_short = source.split("/")[-1] if "/" in source else source
            
            subject = TEMPLATE_LEGAL["subject"]
            body = TEMPLATE_LEGAL["body"].format(first_name=first_name, source_repo=repo_short)
            
            generated.append({
                "to_name": raw_name,
                "to_email": row["email"],
                "subject": subject,
                "email_body": body
            })
            
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["to_name", "to_email", "subject", "email_body"])
        writer.writeheader()
        writer.writerows(generated)
        
    print(f"\n🎉 Generated {len(generated)} ultra-short advice-seeking email drafts for legal tech leaders!")
    print(f"📁 Campaign saved to: {output_path}")

if __name__ == "__main__":
    generate_legal_campaign()
