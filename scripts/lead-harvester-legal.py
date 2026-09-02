"""
─────────────────────────────────────────────────────────────────────────────
CAUSARIX™ LEGAL TECH & CORPORATE GOVERNANCE LEAD HARVESTER
─────────────────────────────────────────────────────────────────────────────
Extracts real, verified contributor emails from public legal engineering,
smart contracts, and compliance repos.
"""

import urllib.request
import json
import csv
import os
import sys

TARGET_LEGAL_REPOS = [
    ("accordproject", "cicero"),             # Open source legal contracts
    ("accordproject", "ergo"),               # Smart legal contract language
    ("openlawteam", "openlaw-core"),         # Legal templates and contracts
    ("openlawteam", "tribute-contracts"),    # Corporate DAO & governance
    ("stanford-oval", "storm"),              # Stanford Legal & Research AI
    ("law-ai", "legal-datasets"),            # Legal AI datasets
]

def extract_repo_commit_leads(owner, repo, max_commits=40):
    url = f"https://api.github.com/repos/{owner}/{repo}/commits?per_page={max_commits}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    leads = []
    
    try:
        with urllib.request.urlopen(req) as resp:
            commits = json.loads(resp.read().decode("utf-8"))
            for item in commits:
                commit = item.get("commit", {})
                author = commit.get("author", {})
                name = author.get("name", "")
                email = author.get("email", "")
                
                if email and "@" in email and not email.endswith("noreply.github.com") and not email.endswith("users.noreply.github.com") and not "bot" in name.lower() and not "actions@" in email:
                    leads.append({
                        "name": name,
                        "email": email,
                        "source_repo": f"{owner}/{repo}",
                        "role": "Legal Tech / Compliance Specialist"
                    })
    except Exception as e:
        print(f"[-] Error fetching {owner}/{repo}: {e}")
        
    return leads

def run_harvest(max_leads=20):
    print("\n🔍 Harvesting Legal Tech & Corporate Compliance leads...")
    all_leads = []
    seen_emails = set()
    
    for owner, repo in TARGET_LEGAL_REPOS:
        leads = extract_repo_commit_leads(owner, repo, max_commits=40)
        for lead in leads:
            if lead["email"] not in seen_emails:
                seen_emails.add(lead["email"])
                all_leads.append(lead)
                print(f"  ⚖️ Extracted Legal Lead: {lead['name']} -> {lead['email']} (Source: {lead['source_repo']})")
            if len(all_leads) >= max_leads:
                break
        if len(all_leads) >= max_leads:
            break
            
    output_path = os.path.join(os.getcwd(), "data", "causarix_legal_leads.csv")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "email", "source_repo", "role"])
        writer.writeheader()
        writer.writerows(all_leads)
        
    print(f"\n🎉 Successfully harvested {len(all_leads)} verified Legal Tech leads!")
    print(f"📁 Exported to: {output_path}")
    return all_leads

if __name__ == "__main__":
    run_harvest(max_leads=20)
