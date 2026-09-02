"""
─────────────────────────────────────────────────────────────────────────────
CAUSARIX™ SIGNAL-BASED PERSONALIZED COLD EMAIL GENERATOR
─────────────────────────────────────────────────────────────────────────────
Generates high-converting, personalized 3-step outbound sequences
for harvested enterprise leads.
"""

import csv
import os

TEMPLATES = {
    "ai_leader": {
        "subject": "Quick question on multi-agent governance in {source_repo}",
        "body": """Hi {first_name},

Saw your recent work on {source_repo} — impressive technical depth.

Most teams deploying multi-agent architectures struggle with two massive enterprise blockers:
1. Non-deterministic math drift on financial calculations (balance sheets / EBITDA).
2. Fiduciary liability under Delaware DGCL § 141 when AI makes boardroom recommendations.

We built Causarix (an air-gapped Neuro-Symbolic Causal OS) that enforces 0.00% math drift via seed-locked SCM kernels and seals every 10-agent boardroom consensus with cryptographic SHA-256 Merkle proofs.

We just published our 413-test suite and live interactive sandbox:
👉 https://causarix.vercel.app/demo

Open to checking out a 3-minute architecture walkthrough this week?

Best,
Shourya
Founder, Causarix
"""
    }
}

def generate_campaign():
    input_path = os.path.join(os.getcwd(), "data", "causarix_b2b_leads.csv")
    output_path = os.path.join(os.getcwd(), "data", "causarix_email_campaign.csv")
    
    if not os.path.exists(input_path):
        print("[-] No leads file found. Run lead-harvester.py first.")
        return
        
    generated = []
    with open(input_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_name = row["name"].strip()
            first_name = raw_name.split()[0] if " " in raw_name else raw_name
            source = row.get("source_repo", "enterprise AI")
            
            tmpl = TEMPLATES["ai_leader"]
            subject = tmpl["subject"].format(source_repo=source.split("/")[-1] if "/" in source else source)
            body = tmpl["body"].format(first_name=first_name, source_repo=source)
            
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
        
    print(f"\n🎉 Generated {len(generated)} personalized cold email drafts!")
    print(f"📁 Campaign saved to: {output_path}")

if __name__ == "__main__":
    generate_campaign()
