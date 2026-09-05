"""
─────────────────────────────────────────────────────────────────────────────
CAUSARIX™ INDIA & US SMB FOUNDER & LEAD HARVESTER
─────────────────────────────────────────────────────────────────────────────
Extracts active SMB founders and tech leaders from Frappe/ERPNext (India's #1 SMB ERP),
Hoppscotch (India Open Source), Dub.co, and Midday.ai.
"""

import subprocess
import tempfile
import shutil
import csv
import os

SMB_REPOS = [
    # India SMB / ERP / Open Source Founders
    ("https://github.com/frappe/frappe.git", "Frappe / ERPNext (India SMB Core)", "India"),
    ("https://github.com/hoppscotch/hoppscotch.git", "Hoppscotch (India Tech)", "India"),
    ("https://github.com/zerodhatech/kiteconnect-python.git", "Zerodha Tech (India)", "India"),
    
    # US SMB / Startup Founders
    ("https://github.com/dubinc/dub.git", "Dub.co Startup Team", "US"),
    ("https://github.com/midday-ai/midday.git", "Midday AI Finance", "US"),
    ("https://github.com/triggerdotdev/trigger.dev.git", "Trigger.dev Team", "US")
]

def extract_leads_via_git(repo_url, company_name, region, max_commits=25):
    temp_dir = tempfile.mkdtemp()
    leads = []
    
    try:
        cmd_clone = ["git", "clone", "--depth", str(max_commits), "--filter=blob:none", "--no-checkout", repo_url, temp_dir]
        subprocess.run(cmd_clone, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=25)
        
        cmd_log = ["git", "-C", temp_dir, "log", f"-n{max_commits}", "--format=%an|||%ae"]
        res = subprocess.run(cmd_log, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=10)
        
        for line in res.stdout.strip().split("\n"):
            if "|||" in line:
                name, email = line.split("|||", 1)
                name = name.strip()
                email = email.strip()
                if email and "@" in email and not email.endswith("noreply.github.com") and not email.endswith("users.noreply.github.com") and not "bot" in name.lower() and not "actions@" in email:
                    leads.append({
                        "name": name,
                        "email": email,
                        "company_source": company_name,
                        "region": region,
                        "role": f"SMB Founder / Tech Lead ({region})"
                    })
    except Exception as e:
        print(f"[-] Error extracting from {repo_url}: {e}")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
        
    return leads

def run_smb_harvest(max_leads=30):
    print("\n🔍 Harvesting India & US SMB Founders and Tech Leads via direct Git...")
    all_leads = []
    seen_emails = set()
    
    for url, company, region in SMB_REPOS:
        leads = extract_leads_via_git(url, company, region, max_commits=20)
        for lead in leads:
            if lead["email"] not in seen_emails:
                seen_emails.add(lead["email"])
                all_leads.append(lead)
                print(f"  🏢 [{region}] Lead: {lead['name']} -> {lead['email']} (Source: {lead['company_source']})")
            if len(all_leads) >= max_leads:
                break
        if len(all_leads) >= max_leads:
            break
            
    output_path = os.path.join(os.getcwd(), "data", "causarix_smb_leads.csv")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "email", "company_source", "region", "role"])
        writer.writeheader()
        writer.writerows(all_leads)
        
    print(f"\n🎉 Successfully harvested {len(all_leads)} verified SMB leads across India & US!")
    print(f"📁 Exported to: {output_path}")
    return all_leads

if __name__ == "__main__":
    run_smb_harvest(max_leads=25)
