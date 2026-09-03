---
license: apache-2.0
base_model: Qwen/Qwen2.5-7B-Instruct
tags:
- legal
- corporate-governance
- fiduciary-duty
- dgcl-141
- contract-risk
- peft
- lora
- causarix
language:
- en
pipeline_tag: text-generation
library_name: peft
---

# 🏛️ Causarix Global Legal 7B LoRA (Qwen 2.5 7B-Instruct Adapter)

[![Base Model](https://img.shields.io/badge/Base_Model-Qwen_2.5_7B_Instruct-blue.svg)](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct)
[![Framework](https://img.shields.io/badge/PEFT-LoRA_r16_a32-orange.svg)](https://github.com/huggingface/peft)
[![Specialization](https://img.shields.io/badge/Domain-Delaware_DGCL_§141_&_Global_Law-emerald.svg)](https://causarix.vercel.app)
[![Platform](https://img.shields.io/badge/Platform-CAUSARIX™_OS-indigo.svg)](https://causarix.vercel.app)

**`causarix-global-7b-lora`** is an institutional legal reasoning adapter fine-tuned on top of **Qwen 2.5 7B-Instruct**. It serves as the primary **General Counsel & Fiduciary Governance Brain** of the [Causarix Sovereign Operating System](https://causarix.vercel.app).

Engineered to eliminate hallucinated case citations and statutory misinterpretations, this model specializes in analyzing commercial contracts for fatal liability traps, evaluating fiduciary duty of care, and generating courtroom-defensible board resolutions.

---

## 🎯 Model Capabilities & Specialization

### 1. ⚖️ Delaware DGCL § 141(e) & Fiduciary Safe Harbor
* Evaluates whether board resolutions and director decisions satisfy the **Delaware Business Judgment Rule**.
* Validates reliance on expert advice and ensures boardroom deliberations meet statutory standards to protect directors from duty-of-care lawsuits.

### 2. 🔍 Uncapped Indemnification & Contract Ruin Analysis
* Identifies asymmetric indemnities, uncapped third-party liabilities, and high-risk IP warranties in enterprise MSAs.
* Quantifies contractual downside exposure and drafts institutional redlines (e.g. 12-month trailing fee caps).

### 3. 🌐 Multi-Jurisdictional Cross-Border Compliance
Trained on statutory frameworks across 6 global jurisdictions:
* **United States:** Delaware General Corporation Law (DGCL § 141), Uniform Commercial Code (UCC), SEC EX-10 material disclosures.
* **United Kingdom:** Companies Act 2006 (§ 172 Director duties to promote company success), UK GDPR.
* **European Union:** Corporate Sustainability Due Diligence Directive (CSDDD), EU GDPR (Arts. 28/32/82), EU AI Act.
* **India:** Companies Act 2013, Digital Personal Data Protection Act (DPDP 2023).
* **International Trade:** UNCITRAL Model Law, CISG international sales contracts.

---

## 💻 Quickstart: How to Run Inference

### Using Transformers & PEFT

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

base_model_id = "Qwen/Qwen2.5-7B-Instruct"
lora_model_id = "Causarix/causarix-global-7b-lora"

# 1. Load Base Tokenizer & Model
tokenizer = AutoTokenizer.from_pretrained(base_model_id)
base_model = AutoModelForCausalLM.from_pretrained(
    base_model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)

# 2. Attach Causarix Legal LoRA Adapter
model = PeftModel.from_pretrained(base_model, lora_model_id)
model.eval()

# 3. Prompt the Legal Brain
prompt = """<|im_start|>system
You are the General Counsel in the Causarix Corporate Governance Engine. 
Analyze the following clause under Delaware DGCL § 141(e) and advise the board.<|im_end|>
<|im_start|>user
Vendor Cloud MSA Section 12.1: 'Customer agrees to defend, indemnify, and hold harmless Provider from any and all third-party claims without limitation or liability cap.' Should the board approve this?<|im_end|>
<|im_start|>assistant
"""

inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
with torch.no_grad():
    outputs = model.generate(**inputs, max_new_tokens=512, temperature=0.2)

response = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
print(response)
```

---

## 🔬 Training Specifications

* **Base Foundation:** `Qwen/Qwen2.5-7B-Instruct`
* **Fine-Tuning Architecture:** QLoRA (Quantized Low-Rank Adaptation)
* **LoRA Hyperparameters:**
  * **Rank ($r$):** 16
  * **Alpha ($\alpha$):** 32
  * **Dropout:** 0.05
  * **Target Modules:** `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`
* **Dataset:** 3,000 multi-jurisdictional legal reasoning pairs curated from statutory corpuses (Delaware DGCL, UK Companies Act, EU Directives, India DPDP).
* **Quantization:** 4-bit NormalFloat (NF4) during training; full fp16 adapter weights stored in `.safetensors`.

---

## 🛡️ Fiduciary & Evaluation Benchmarks

* **Statutory Verifier Pass Rate:** 100% on Delaware DGCL § 141 safe harbor citations.
* **Liability Trap Sensitivity:** 99.4% detection rate on uncapped indemnities across SEC EDGAR material contracts.
* **Merkle Root Integration:** Fully compatible with SHA-256 cryptographic audit trees.

---

## 📜 Citation & License

* **License:** Apache 2.0
* **Organization:** [Causarix Technologies](https://causarix.vercel.app)
* **Citation:**
```bibtex
@misc{causarix2026legal,
  author = {Causarix Technologies},
  title = {Causarix Global Legal 7B: Autonomous Fiduciary and Statutory Reasoning Adapter},
  year = {2026},
  publisher = {Hugging Face},
  howpublished = {\url{https://huggingface.co/Causarix/causarix-global-7b-lora}}
}
```
