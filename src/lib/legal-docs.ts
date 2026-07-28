export interface LegalDoc {
  slug: string;
  title: string;
  category: 'Legal' | 'Privacy & Security' | 'Governance & AI' | 'Support & Contact';
  lastUpdated: string;
  summary: string;
  tableOfContents: { id: string; title: string }[];
  contentMd: string;
}

export const LEGAL_DOCUMENTS: Record<string, LegalDoc> = {
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    category: 'Privacy & Security',
    lastUpdated: 'July 26, 2026',
    summary: 'Comprehensive details on data collection, processing, user rights under GDPR, CCPA, and the Indian DPDP Act 2023.',
    tableOfContents: [
      { id: 'introduction', title: '1. Introduction' },
      { id: 'data-collection', title: '2. Information We Collect' },
      { id: 'data-processing', title: '3. Legal Basis & How We Use Data' },
      { id: 'regional-compliance', title: '4. Regional Privacy Rights (GDPR, CCPA, DPDP Act)' },
      { id: 'data-retention', title: '5. Data Retention & Deletion' },
      { id: 'third-party', title: '6. Sub-Processors & Integrations' },
      { id: 'contact-dpo', title: '7. Contacting Our Data Protection Officer (DPO)' }
    ],
    contentMd: `
# Privacy Policy

**Effective Date:** July 26, 2026

## 1. Introduction {#introduction}
Welcome to **Synaps** ("Company", "we", "us", or "our"). Synaps is an Enterprise Intelligence Platform and Digital Twin system. We are committed to protecting your organizational and personal privacy in accordance with applicable global privacy laws, including the European Union General Data Protection Regulation (**GDPR**), the California Consumer Privacy Act (**CCPA / CPRA**), and the Indian Digital Personal Data Protection Act (**DPDP Act 2023**).

This Privacy Policy explains how we collect, process, store, and safeguard your data when you use our SaaS application, enterprise memory graph, and related services (collectively, the "Services").

---

## 2. Information We Collect {#data-collection}
We collect data directly provided by your organization, automatically logged through application telemetry, or submitted via third-party integrations:

* **Account & Identity Data:** Full name, corporate email address, role, organization name, authentication credentials (managed via secure Firebase Auth and SSO tokens).
* **Uploaded Enterprise Content:** Documents (PDFs, DOCX, CSVs), meeting transcripts, proposals, contracts, SOPs, and decisions uploaded to the Enterprise Memory Graph.
* **Usage & Telemetry Data:** IP addresses, browser user-agent, session timestamps, feature usage, API requests, and audit logs.
* **Billing Information:** Corporate billing contact details, invoice addresses, and payment references (processed via PCI-DSS compliant third-party payment gateways).

---

## 3. Legal Basis & How We Use Data {#data-processing}
We process your personal data under the following legal bases:
1. **Performance of Contract:** To operate the Synaps Enterprise Digital Twin OS, fulfill customer queries, and manage enterprise tenants.
2. **Legitimate Interests:** To prevent security vulnerabilities, optimize graph RAG performance, and audit compliance.
3. **Legal Obligations:** To maintain audit records for tax, financial reporting, and regulatory disclosures.

**Zero Model Training Promise:** Synaps does **NOT** use customer's uploaded enterprise documents, proprietary knowledge graphs, or private data to train public LLM models.

---


## 4. Regional Privacy Rights (Global Compliance) {#regional-compliance}

### A. European Union & United Kingdom (GDPR / UK GDPR)
Under GDPR Articles 15-22 and UK GDPR, EU and UK data subjects have the right to:
* **Access** personal data we hold about you (Article 15).
* **Rectify** inaccurate data (Article 16).
* **Erase** personal data ("Right to be Forgotten") (Article 17).
* **Restrict** processing in certain circumstances (Article 18).
* **Data portability** in JSON/CSV format (Article 20).
* **Object** to processing based on legitimate interests (Article 21).
* **Lodge a complaint** with your national supervisory authority or the UK ICO.

### B. California Residents (CCPA / CPRA)
California residents have the right to know what personal information is collected, request deletion, opt-out of the sale/sharing of personal data (Synaps does **NOT** sell personal data), correct inaccurate data, and receive non-discriminatory treatment. Exercise rights: novaecosystems@gmail.com — Subject: "CCPA Privacy Request".

### C. Other US States (Virginia, Colorado, Connecticut, Texas)
Residents of these states have similar rights to access, delete, correct, and opt out of targeted advertising under their respective state privacy laws.

### D. India (DPDP Act 2023)
Pursuant to the Digital Personal Data Protection Act 2023, Indian Data Principals have the right to obtain a summary of personal data processed, correct or erase personal data, nominate a representative, withdraw consent at any time, and register grievances with our Grievance Officer (72-hour acknowledgement, 30-day resolution).

### E. Canada (PIPEDA + Quebec Law 25)
Canadian residents have the right to access, correct, and request deletion of personal information, and lodge complaints with the Office of the Privacy Commissioner of Canada (OPC).

### F. Australia (Privacy Act 1988 - Australian Privacy Principles)
Australian individuals have the right to access (APP 12) and correct (APP 13) personal information, and lodge complaints with the Office of the Australian Information Commissioner (OAIC).

### G. Singapore (PDPA 2012)
Singapore residents have the right to access, correct, and withdraw consent for data collection, and lodge complaints with the Personal Data Protection Commission (PDPC).

---

## 5. Data Retention & Deletion {#data-retention}
We retain enterprise data only for the duration of your active subscription or as legally required:
* **Active Customer Data:** Retained for the lifecycle of the enterprise organization account.
* **Deleted Tenant Data:** Permanently purged within **30 days** of account termination.
* **Audit Logs:** Preserved for **365 days** for legal and regulatory compliance.
* **Payment Records:** Retained for **7 years** as required by financial regulations across India, EU, USA, and Australia.

To request early data deletion, email: novaecosystems@gmail.com — Subject: "Data Deletion Request".

---

## 6. Sub-Processors & Integrations {#third-party}
Synaps partners with verified sub-processors (see our full [Data Processing Agreement](/legal/data-processing)):
* **Cloud Infrastructure:** Google Cloud Platform (GCP) — primary compute and database hosting.
* **Authentication:** Firebase Authentication (Google Cloud) — session management.
* **Storage:** Supabase Inc. — encrypted document blob storage.
* **Payments:** LemonSqueezy (Merchant of Record) — PCI-DSS Level 1 compliant.
* **AI Inference:** Groq Inc. & Google Gemini — zero data retention API usage.
* **Analytics:** Vercel Web Analytics — anonymised, aggregate usage data only.

---

## 7. Contacting Our Data Protection Officer (DPO) {#contact-dpo}
To exercise your rights or ask questions about this Privacy Policy:

* **Email:** novaecosystems@gmail.com
* **Subject Line:** "Privacy Request — [Your Right] — [Your Country]"
* **Postal Address:** Synaps AI Legal & Compliance Dept., Pune, Maharashtra 411001, India
* **Response SLA:** 72-hour acknowledgement — 30-day resolution (GDPR/DPDP) — 45 days (CCPA)
`
  },

  terms: {
    slug: 'terms',
    title: 'Terms & Conditions',
    category: 'Legal',
    lastUpdated: 'July 26, 2026',
    summary: 'Terms of Service governing your use of Synaps Enterprise Intelligence Platform and Digital Twin OS.',
    tableOfContents: [
      { id: 'acceptance', title: '1. Acceptance of Terms' },
      { id: 'saas-license', title: '2. Enterprise SaaS License & Usage' },
      { id: 'user-accounts', title: '3. Account Responsibilities & Tenant Isolation' },
      { id: 'intellectual-property', title: '4. Intellectual Property & Ownership' },
      { id: 'payment-terms', title: '5. Payment & Subscription Terms' },
      { id: 'limitation-liability', title: '6. Limitation of Liability & Warranties' },
      { id: 'governing-law', title: '7. Governing Law & Dispute Resolution' }
    ],
    contentMd: `
# Terms & Conditions / Terms of Service

**Effective Date:** July 26, 2026

## 1. Acceptance of Terms {#acceptance}
By accessing, registering for, or utilizing the **Synaps** Enterprise Intelligence Platform ("Platform"), you ("Customer", "User", or "Organization") enter into a legally binding agreement governed by these Terms & Conditions ("Terms"). If you represent an entity, you warrant that you have full authority to bind that entity.

---

## 2. Enterprise SaaS License & Usage {#saas-license}
Subject to compliance with these Terms and timely payment of subscription fees, Synaps grants Customer a non-exclusive, non-transferable, worldwide license to access and use the Platform, including the Enterprise Memory Graph, Digital Twin OS, and AI Reasoning engines.

**Restrictions:** Customer shall not:
* Reverse engineer, decompile, or extract source code from the Platform.
* Use the Platform to build a competitive enterprise knowledge graph software.
* Attempt unauthorized bypass of multi-tenant security boundaries or rate limits.

---

## 3. Account Responsibilities & Tenant Isolation {#user-accounts}
Customer is responsible for maintaining the confidentiality of administrative credentials and managing authorized user roles within their organization account. Synaps enforces strict cryptographic and database tenant isolation using organization-bound scopes.

---

## 4. Intellectual Property & Ownership {#intellectual-property}
* **Customer Ownership:** Customer retains 100% ownership of all uploaded enterprise documents, transcripts, proprietary graph entities, and generated strategic outputs.
* **Synaps Ownership:** Synaps retains all rights, titles, and interests in the underlying platform architecture, machine learning algorithms, design system, and trademarks.

---

## 5. Payment & Subscription Terms {#payment-terms}
* **Billing Cycles:** Subscriptions are billed on a monthly or annual auto-renewing basis.
* **Payment Processing:** All payments are processed via LemonSqueezy Merchant of Record with automated 1-click real-money refunds within 14 days.
* **Taxes:** Prices exclude applicable GST, VAT, or withholding taxes, which shall be calculated based on Customer jurisdiction.

---

## 6. Limitation of Liability & Warranties {#limitation-liability}
To the maximum extent permitted by applicable law:
* Synaps is provided on an "AS IS" and "AS AVAILABLE" basis.
* Synaps shall not be liable for indirect, incidental, punitive, or consequential damages resulting from business disruption, reliance on AI predictions, or loss of profits.
* Maximum aggregate liability shall not exceed the subscription fees paid by Customer to Synaps during the 12 months preceding the claim.

---

## 7. Governing Law & Dispute Resolution {#governing-law}

### Primary Governing Law
These Terms shall be governed by and construed in accordance with the laws of **India** (jurisdiction: Pune, Maharashtra), without regard to conflict of law principles.

### Regional Provisions
* **EU / UK Customers:** Mandatory EU/UK consumer protection laws that cannot be excluded by contract apply. Nothing in these Terms limits statutory rights under EU Directive 2019/770, UK Consumer Rights Act 2015, or GDPR.
* **USA / California Customers:** California residents retain the right to bring individual claims in small claims court. To the maximum extent permitted by law, class action waiver applies.
* **India Customers:** Disputes subject to the Arbitration & Conciliation Act 1996 (as amended), with arbitration seat in Pune, Maharashtra, India.
* **Australia Customers:** Australian Consumer Law (Competition and Consumer Act 2010) rights cannot be excluded and supersede any conflicting clause. Implied guarantees under the ACL apply to consumer customers.
* **Canada Customers:** Quebec residents retain rights under the Quebec Consumer Protection Act regardless of governing law clause.
* **Singapore Customers:** Disputes may be referred to the Singapore Mediation Centre (SMC) prior to arbitration.

### Class Action Waiver
To the maximum extent permitted by applicable law, you agree to resolve disputes on an individual basis. This waiver does not apply where prohibited by law.

**Contact:** Legal queries should be submitted to novaecosystems@gmail.com.
`
  },

  'acceptable-use': {
    slug: 'acceptable-use',
    title: 'Acceptable Use Policy',
    category: 'Governance & AI',
    lastUpdated: 'July 26, 2026',
    summary: 'Guidelines on permitted and prohibited uses of the Synaps Enterprise Platform.',
    tableOfContents: [
      { id: 'purpose', title: '1. Purpose' },
      { id: 'prohibited-activities', title: '2. Prohibited System Abuse' },
      { id: 'ai-conduct', title: '3. AI Ethics & Conduct Standards' },
      { id: 'enforcement', title: '4. Monitoring & Enforcement' }
    ],
    contentMd: `
# Acceptable Use Policy (AUP)

**Effective Date:** July 26, 2026

## 1. Purpose {#purpose}
This Acceptable Use Policy defines the standards of conduct required when using **Synaps**. All users, enterprise tenants, and API consumers must strictly comply with these guidelines to protect system integrity and legal compliance.

---

## 2. Prohibited System Abuse {#prohibited-activities}
You must NOT use Synaps to:
* Upload malware, trojans, ransomware, or malicious script payloads.
* Perform automated scraping, denial of service (DoS) attacks, or stress-test production APIs beyond published rate limits.
* Attempt unauthorized privilege escalation across tenant accounts.
* Process unlawful, defamatory, or illicit content.

---

## 3. AI Ethics & Conduct Standards {#ai-conduct}
When interacting with Synaps AI Agents, Executive Boardroom models, or Digital Twin simulations, users agree NOT to submit prompt injection vectors intended to bypass corporate boundaries or extract un-redacted system keys.

---

## 4. Monitoring & Enforcement {#enforcement}
Synaps automatically monitors application telemetry for security threats. Violations may result in temporary account suspension or permanent termination without refund.

Report abuse to: novaecosystems@gmail.com.
`
  },

  cookies: {
    slug: 'cookies',
    title: 'Cookie Policy',
    category: 'Privacy & Security',
    lastUpdated: 'July 26, 2026',
    summary: 'Details on session cookies, security tokens, and user preference tracking.',
    tableOfContents: [
      { id: 'what-are-cookies', title: '1. What Are Cookies' },
      { id: 'cookies-we-use', title: '2. Cookies We Deploy' },
      { id: 'managing-cookies', title: '3. Managing Your Preferences' }
    ],
    contentMd: `
# Cookie Policy

**Effective Date:** July 26, 2026

## 1. What Are Cookies {#what-are-cookies}
Cookies are small text files stored on your device when visiting websites. Synaps utilizes cookies and local storage tokens strictly for essential session authentication, security checks, and interface preferences.

---

## 2. Cookies We Deploy {#cookies-we-use}
* **synaps-session (Strictly Necessary):** Encrypted Firebase session cookie used to authenticate enterprise users and enforce HttpOnly, SameSite=Lax security.
* **synaps-csrf (Security):** Double-submit CSRF protection token for API state modifications.
* **synaps-theme (Functional):** Remembers dark mode vs light mode theme selection.

**No Third-Party Advertising Cookies:** Synaps does NOT deploy ad-tracking or cross-site commercial cookies.

---

## 3. Managing Your Preferences {#managing-cookies}
You can block or clear cookies via your browser settings. However, disabling essential session cookies will prevent login access to dashboard.
`
  },

  security: {
    slug: 'security',
    title: 'Security Policy',
    category: 'Privacy & Security',
    lastUpdated: 'July 26, 2026',
    summary: 'Technical architecture, encryption standards, SOC2 readiness, and risk management practices.',
    tableOfContents: [
      { id: 'encryption', title: '1. Data Encryption Standards' },
      { id: 'access-control', title: '2. Access Control & RBAC' },
      { id: 'network-security', title: '3. Network & Infrastructure Security' },
      { id: 'incident-response', title: '4. Incident Response Plan' }
    ],
    contentMd: `
# Security Policy

**Effective Date:** July 26, 2026

## 1. Data Encryption Standards {#encryption}
* **In Transit:** All HTTP traffic is strictly encrypted using TLS 1.3 with HTTP Strict Transport Security (HSTS) enforced.
* **At Rest:** Enterprise databases, storage buckets, and memory vector indices are encrypted using AES-256 with key rotation.

---

## 2. Access Control & RBAC {#access-control}
Synaps implements zero-trust authorization. Access to enterprise organization data is restricted via Role-Based Access Control (RBAC) and scoped JWT claim validation.

---

## 3. Network & Infrastructure Security {#network-security}
* Multi-tenant data segregation enforced at application and database layers.
* Automated vulnerability scanning for dependencies and container images.
* Rate limiting and WAF rules to protect against OWASP Top 10 vulnerabilities.

---

## 4. Incident Response Plan {#incident-response}
In the event of a confirmed security incident affecting customer data, Synaps will notify affected enterprise administrators within 72 hours in compliance with GDPR and global breach notification standards.

Security Team Contact: novaecosystems@gmail.com.
`
  },

  'data-processing': {
    slug: 'data-processing',
    title: 'Data Processing Notice',
    category: 'Governance & AI',
    lastUpdated: 'July 26, 2026',
    summary: 'Data Processing Addendum (DPA) details and sub-processor commitments.',
    tableOfContents: [
      { id: 'scope', title: '1. Scope & Applicability' },
      { id: 'sub-processors', title: '2. Authorized Sub-Processors' },
      { id: 'transfers', title: '3. International Data Transfers' }
    ],
    contentMd: `
# Data Processing & Privacy Notice (DPA)

**Effective Date:** July 26, 2026

## 1. Scope & Applicability {#scope}
This Data Processing Notice forms part of the master enterprise agreement for Customers operating in regulated jurisdictions under GDPR, CCPA, or DPDP Act requiring formal data processing terms.

---

## 2. Authorized Sub-Processors {#sub-processors}
Synaps engages the following infrastructure providers:
* **Google Cloud Platform (GCP):** Primary cloud compute and database hosting.
* **Supabase Inc:** Encrypted blob and document storage.
* **LemonSqueezy:** Merchant of Record & Payment processing.

---

## 3. International Data Transfers {#transfers}
Where data transfers outside the European Economic Area (EEA) occur, Synaps relies on Standard Contractual Clauses (SCCs) approved by the European Commission.

Contact DPO: novaecosystems@gmail.com.
`
  },

  'ai-policy': {
    slug: 'ai-policy',
    title: 'AI Usage Policy',
    category: 'Governance & AI',
    lastUpdated: 'July 26, 2026',
    summary: 'Responsible AI principles, hallucination safeguards, and model transparency.',
    tableOfContents: [
      { id: 'responsible-ai', title: '1. Responsible AI Principles' },
      { id: 'zero-hallucination', title: '2. Zero-Hallucination Graph Grounding' },
      { id: 'human-oversight', title: '3. Human-in-the-Loop Oversight' }
    ],
    contentMd: `
# AI Usage & Responsible AI Policy

**Effective Date:** July 26, 2026

## 1. Responsible AI Principles {#responsible-ai}
Synaps builds AI engines designed to augment human executive decision-making with transparency, safety, and accountability.

---

## 2. Zero-Hallucination Graph Grounding {#zero-hallucination}
Our Enterprise Memory Graph and AI Assistant employ multi-hop Graph RAG. If corporate memory lacks factual data for a query, the assistant explicitly states knowledge is missing rather than generating unverified statements.

---

## 3. Human-in-the-Loop Oversight {#human-oversight}
AI strategic recommendations, simulation models, and boardroom debate synthesis are decision-support tools. Final organizational execution remains under human executive approval.
`
  },

  disclaimer: {
    slug: 'disclaimer',
    title: 'Disclaimer',
    category: 'Legal',
    lastUpdated: 'July 26, 2026',
    summary: 'Legal disclaimers regarding AI predictions and business recommendations.',
    tableOfContents: [
      { id: 'general-disclaimer', title: '1. Operational & Financial Disclaimer' },
      { id: 'ai-limitation', title: '2. AI Output Limitations' }
    ],
    contentMd: `
# Legal Disclaimer

**Effective Date:** July 26, 2026

## 1. Operational & Financial Disclaimer {#general-disclaimer}
All simulations, predictive risk scores, revenue projections, and strategic proposals generated by Synaps are analytical models intended for informational decision support. Synaps does NOT provide licensed legal, financial, accounting, or tax advice.

---

## 2. AI Output Limitations {#ai-limitation}
While Synaps employs state-of-the-art verification and graph grounding, business outputs depend on the accuracy of documents and inputs provided by the user. Customer assumes responsibility for validating outputs prior to commercial execution.
`
  },

  copyright: {
    slug: 'copyright',
    title: 'Copyright Notice',
    category: 'Legal',
    lastUpdated: 'July 26, 2026',
    summary: 'Intellectual property rights and DMCA copyright takedown procedure.',
    tableOfContents: [
      { id: 'ip-rights', title: '1. Proprietary Rights' },
      { id: 'dmca', title: '2. DMCA Takedown Notice Procedure' }
    ],
    contentMd: `
# Copyright Notice & DMCA Policy

**Effective Date:** July 26, 2026

## 1. Proprietary Rights {#ip-rights}
© 2026 Synaps AI. All rights reserved. The code, user interface, brand assets, and graphics are protected by global copyright and trademark laws.

---

## 2. DMCA Takedown Notice Procedure {#dmca}
If you believe content hosted on Synaps infringes your copyright, send a written DMCA notice to our designated Copyright Agent:

* **Email:** novaecosystems@gmail.com
* **Required Info:** Description of copyrighted work, URL/location of infringing material, your contact details, and a statement under penalty of perjury.
`
  },

  'ip-infringement': {
    slug: 'ip-infringement',
    title: 'IP Infringement Policy',
    category: 'Legal',
    lastUpdated: 'July 26, 2026',
    summary: 'Comprehensive policy governing copyright, trademark, patent, and trade secret infringement notices.',
    tableOfContents: [
      { id: 'ip-policy', title: '1. Intellectual Property Protection & Scope' },
      { id: 'infringement-claims', title: '2. Submitting an IP Infringement Claim' },
      { id: 'counter-notice', title: '3. Counter-Notification Procedure' },
      { id: 'repeat-infringers', title: '4. Repeat Infringer Account Termination' },
      { id: 'designated-agent', title: '5. Designated IP Agent Contact' }
    ],
    contentMd: `
# Intellectual Property Infringement Policy

**Effective Date:** July 26, 2026

## 1. Intellectual Property Protection & Scope {#ip-policy}
Synaps AI ("Synaps") respects the intellectual property rights of third parties and expects all users, enterprise tenants, and API consumers of the Synaps Platform to do the same. This Policy covers claims of infringement involving **Copyrights, Trademarks, Patents, and Trade Secrets**.

---

## 2. Submitting an IP Infringement Claim {#infringement-claims}
If you are an intellectual property rights owner or an authorized agent thereof and believe that any content, document, data, or output processed within Synaps infringes upon your IP rights, you may submit a formal Notice of Infringement to our designated IP Agent.

Your notice MUST contain the following information:
1. **Identification of the Protected Work:** Description of the copyrighted work, registered trademark, patent number, or trade secret claimed to be infringed.
2. **Identification of the Infringement:** Exact location or URL of the material on Synaps claimed to be infringing.
3. **Contact Details:** Your full legal name, company name, address, telephone number, and email address.
4. **Good Faith Statement:** A statement that you have a good faith belief that use of the material is not authorized by the IP owner, its agent, or the law.
5. **Perjury Statement:** A statement made under penalty of perjury that the information in the notification is accurate and that you are authorized to act on behalf of the IP owner.
6. **Signature:** Physical or electronic signature of the IP owner or authorized representative.

---

## 3. Counter-Notification Procedure {#counter-notice}
If an enterprise tenant or user receives a notice that content uploaded by them has been removed due to an IP claim, and believes the removal was due to mistake or misidentification, a Counter-Notification may be submitted to our IP Agent containing:
* Identification of the material removed and its former location.
* A statement under penalty of perjury that the user has a good faith belief that the material was removed or disabled as a result of mistake or misidentification.
* Consent to jurisdiction in court.

---

## 4. Repeat Infringer Account Termination {#repeat-infringers}
In accordance with applicable global IP laws, Synaps maintains a strict **Repeat Infringer Policy**. Accounts of enterprise tenants or individual users who repeatedly infringe upon third-party intellectual property rights will be subject to immediate account suspension or permanent termination.

---

## 5. Designated IP Agent Contact {#designated-agent}
All IP Infringement notices and counter-notifications should be sent to our designated IP Enforcement Agent:

* **Email:** novaecosystems@gmail.com
* **Attn:** Designated Intellectual Property & DMCA Compliance Officer
`
  },

  contact: {
    slug: 'contact',
    title: 'Contact Us',
    category: 'Support & Contact',
    lastUpdated: 'July 26, 2026',
    summary: 'Official corporate communication channels, headquarters directory, and inquiries.',
    tableOfContents: [
      { id: 'directory', title: '1. Corporate Communications Directory' },
      { id: 'offices', title: '2. Office Locations' }
    ],
    contentMd: `
# Contact Us

We welcome your inquiries, feedback, and enterprise partnership requests.

## 1. Corporate Communications Directory {#directory}
* **General Inquiries & Support:** novaecosystems@gmail.com
* **Enterprise Sales & Custom Integrations:** novaecosystems@gmail.com
* **Legal & Privacy Officer:** novaecosystems@gmail.com
* **Security Reporting:** novaecosystems@gmail.com

---

## 2. Office Locations {#offices}
* **Global Headquarters:** Synaps AI, Pune, Maharashtra, India.
`
  },

  support: {
    slug: 'support',
    title: 'Support & SLA Policy',
    category: 'Support & Contact',
    lastUpdated: 'July 26, 2026',
    summary: 'Customer support response times, service level agreements, and help channels.',
    tableOfContents: [
      { id: 'channels', title: '1. Support Channels' },
      { id: 'sla-tiers', title: '2. SLA & Response Targets' }
    ],
    contentMd: `
# Support Policy & SLA

**Effective Date:** July 26, 2026

## 1. Support Channels {#channels}
Enterprise users access 24/7 priority support via:
* In-app Assistant Console: /dashboard/assistant
* Priority Email Channel: novaecosystems@gmail.com

---

## 2. SLA & Response Targets {#sla-tiers}
* **Severity 1 (Critical Outage):** < 1 Hour Response (24/7)
* **Severity 2 (High Impact):** < 4 Hours Response
* **Severity 3 (General Query):** < 24 Hours Response
`
  },

  'security-vulnerability': {
    slug: 'security-vulnerability',
    title: 'Report a Security Vulnerability',
    category: 'Support & Contact',
    lastUpdated: 'July 26, 2026',
    summary: 'Vulnerability disclosure program, safe harbor terms, and security contact.',
    tableOfContents: [
      { id: 'disclosure-policy', title: '1. Responsible Disclosure Policy' },
      { id: 'submission-guidelines', title: '2. How to Report' },
      { id: 'safe-harbor', title: '3. Safe Harbor Commitments' }
    ],
    contentMd: `
# Report a Security Vulnerability

Synaps takes security seriously. We encourage independent security researchers to responsibly disclose vulnerabilities.

## 1. Responsible Disclosure Policy {#disclosure-policy}
Researchers agree to:
* Allow us reasonable time (at least 30 days) to remediate vulnerabilities before public disclosure.
* Avoid accessing or modifying customer data.
* Refrain from performing denial of service (DoS) attacks or social engineering.

---

## 2. How to Report {#submission-guidelines}
Send vulnerability reports directly to novaecosystems@gmail.com. Include:
* Vulnerability type (e.g. CSRF, XSS, SSRF, Access Control).
* Step-by-step proof of concept (PoC).
* Affected API endpoint or URL.

---

## 3. Safe Harbor Commitments {#safe-harbor}
Good-faith security research complying with this policy will be protected under full legal safe harbor, and will not be subject to civil litigation or law enforcement referral.
`
  }
};
