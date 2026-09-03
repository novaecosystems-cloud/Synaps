---
license: apache-2.0
base_model: Qwen/Qwen2.5-7B-Instruct
tags:
- finance
- corporate-finance
- gaap
- ifrs
- ebitda-runway
- cashflow-sensitivity
- peft
- lora
- causarix
language:
- en
pipeline_tag: text-generation
library_name: peft
---

# 💰 Causarix Global Finance 7B LoRA (Qwen 2.5 7B-Instruct Adapter)

[![Base Model](https://img.shields.io/badge/Base_Model-Qwen_2.5_7B_Instruct-blue.svg)](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct)
[![Framework](https://img.shields.io/badge/PEFT-LoRA_r16_a32-orange.svg)](https://github.com/huggingface/peft)
[![Specialization](https://img.shields.io/badge/Domain-US_GAAP_&_IFRS_Accounting-emerald.svg)](https://causarix.vercel.app)
[![Platform](https://img.shields.io/badge/Platform-CAUSARIX™_OS-indigo.svg)](https://causarix.vercel.app)

**`causarix-global-finance-7b-lora`** is an institutional financial reasoning adapter fine-tuned on top of **Qwen 2.5 7B-Instruct**. It serves as the primary **Chief Financial Officer (CFO) & Quant Risk Brain** of the [Causarix Sovereign Operating System](https://causarix.vercel.app).

Engineered to eliminate numerical hallucinations and arithmetic drift, this model specializes in analyzing enterprise balance sheets, pro-forma EBITDA drag, debt covenants, revenue recognition compliance, and cash runway sensitivity under macroeconomic stress.

---

## 🎯 Model Capabilities & Specialization

### 1. 📊 US GAAP & International IFRS Standards
* **Revenue Recognition (ASC 606 / IFRS 15):** Audits multi-element software and SaaS subscription contracts for performance obligations and deferred revenue recognition.
* **Lease Accounting (ASC 842 / IFRS 16):** Evaluates operating vs finance lease balance sheet capitalization and EBITDA distortive impacts.
* **OECD Transfer Pricing & BEPS:** Models arm's-length intercompany transactions, tax nexus exposure, and cross-border currency hedging sensitivity.

### 2. 📉 Pro-Forma EBITDA & Cash Runway Drag
* Quantifies the true balance sheet drag of high-interest credit lines, capex overruns, and deferred vendor liabilities.
* Accurately calculates Value-at-Risk (VaR95) and Conditional Value-at-Risk (CVaR95) when paired with the Causarix C++ Box-Muller simulation kernel.

### 3. 🏢 M&A Diligence & Capital Allocation
* Audits target acquisition pro-formas for EBITDA adjustments, working capital pegs, and post-merger integration costs.
* Validates board decisions against fiduciary capital preservation rules (mandating minimum 20% liquid cash buffers).

---

## 💻 Quickstart: How to Run Inference

### Using Transformers & PEFT

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

base_model_id = "Qwen/Qwen2.5-7B-Instruct"
lora_model_id = "Causarix/causarix-global-finance-7b-lora"

# 1. Load Base Tokenizer & Model
tokenizer = AutoTokenizer.from_pretrained(base_model_id)
base_model = AutoModelForCausalLM.from_pretrained(
    base_model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)

# 2. Attach Causarix Finance LoRA Adapter
model = PeftModel.from_pretrained(base_model, lora_model_id)
model.eval()

# 3. Prompt the Finance Brain
prompt = """<|im_start|>system
You are the Chief Financial Officer (CFO) in the Causarix Corporate Governance Engine. 
Evaluate the revenue recognition impact under ASC 606 and cash runway sensitivity.<|im_end|>
<|im_start|>user
We signed a $12M multi-year contract: $4M upfront for customization, $8M in annual SaaS licenses over 2 years. Customization delivers standalone value. How should revenue be recognized under ASC 606, and what is our adjusted EBITDA impact?<|im_end|>
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
* **Dataset:** 3,000 corporate finance, GAAP/IFRS, and numerical stress-testing pairs from SEC 10-K disclosures, FinQA, and synthetic balance sheet shocks.
* **Quantization:** 4-bit NormalFloat (NF4) during training; fp16 adapter weights stored in `.safetensors`.

---

## 📜 Citation & License

* **License:** Apache 2.0
* **Organization:** [Causarix Technologies](https://causarix.vercel.app)
* **Citation:**
```bibtex
@misc{causarix2026finance,
  author = {Causarix Technologies},
  title = {Causarix Global Finance 7B: Autonomous GAAP/IFRS & Financial Stress Reasoning Adapter},
  year = {2026},
  publisher = {Hugging Face},
  howpublished = {\url{https://huggingface.co/Causarix/causarix-global-finance-7b-lora}}
}
```
