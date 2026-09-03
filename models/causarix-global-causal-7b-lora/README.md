---
license: apache-2.0
base_model: Qwen/Qwen2.5-7B-Instruct
tags:
- causal-inference
- structural-causal-models
- judea-pearl
- do-calculus
- boardroom-quorum
- dgcl-141-merkle
- counterfactual-analysis
- peft
- lora
- causarix
language:
- en
pipeline_tag: text-generation
library_name: peft
---

# 🌐 Causarix Global Causal 7B LoRA (Qwen 2.5 7B-Instruct Adapter)

[![Base Model](https://img.shields.io/badge/Base_Model-Qwen_2.5_7B_Instruct-blue.svg)](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct)
[![Framework](https://img.shields.io/badge/PEFT-LoRA_r16_a32-orange.svg)](https://github.com/huggingface/peft)
[![Specialization](https://img.shields.io/badge/Domain-Judea_Pearl_SCM_&_Boardroom_Quorum-emerald.svg)](https://causarix.vercel.app)
[![Platform](https://img.shields.io/badge/Platform-CAUSARIX™_OS-indigo.svg)](https://causarix.vercel.app)

**`causarix-global-causal-7b-lora`** is an institutional causal inference and arbitration adapter fine-tuned on top of **Qwen 2.5 7B-Instruct**. It serves as the primary **Chief Executive Officer (CEO) & Causal Arbitration Brain** of the [Causarix Sovereign Operating System](https://causarix.vercel.app).

Unlike standard LLMs that confuse correlation with causation, this model is specifically trained on **Judea Pearl's Structural Causal Models (SCM)**, interventional $do$-calculus graph surgery, multi-agent adversarial boardroom debate synthesis, and cryptographic SHA-256 Merkle proof generation under Delaware DGCL § 141.

---

## 🎯 Model Capabilities & Specialization

### 1. 🔬 Judea Pearl Structural Causal Models (SCM) & $do$-Calculus
* Distinguishes observational correlations $P(Y \mid X)$ from true interventional counterfactual distributions $P(Y \mid do(X))$.
* Performs DAG graph surgery: cuts inbound parent edges during interventions to simulate isolated strategic shocks (e.g. cutting supplier dependencies, imposing sudden tariff shifts, or pricing interventions).

### 2. 🏛️ 10-Agent Boardroom Quorum Dialectic Synthesis
* Ingests conflicting arguments from 10 specialized C-suite executive twins (`CEO`, `CFO`, `COO`, `CTO`, `General Counsel`, `CPO`, `CRO`, `CMO`, `Operations`, `Compliance`).
* Arbitrates trade-offs between legal risk, financial runway, technical debt, and growth opportunities to produce a unified, consensus-backed boardroom resolution.

### 3. 🛡️ Delaware DGCL § 141 Cryptographic Merkle Root Sealing
* Translates executive deliberations into immutable leaf nodes of an SHA-256 Merkle tree.
* Generates audit-grade evidence demonstrating that directors exercised statutory due diligence under the Business Judgment Rule.

---

## 💻 Quickstart: How to Run Inference

### Using Transformers & PEFT

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

base_model_id = "Qwen/Qwen2.5-7B-Instruct"
lora_model_id = "Causarix/causarix-global-causal-7b-lora"

# 1. Load Base Tokenizer & Model
tokenizer = AutoTokenizer.from_pretrained(base_model_id)
base_model = AutoModelForCausalLM.from_pretrained(
    base_model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)

# 2. Attach Causarix Causal LoRA Adapter
model = PeftModel.from_pretrained(base_model, lora_model_id)
model.eval()

# 3. Prompt the Causal Arbitration Brain
prompt = """<|im_start|>system
You are the CEO Twin & Causal Arbitration Engine in the Causarix Corporate Governance Engine. 
Apply Judea Pearl do-calculus to arbitrate the following strategic dilemma and synthesize a boardroom resolution.<|im_end|>
<|im_start|>user
Dilemma: CFO warns that an upcoming $15M datacenter expansion will deplete cash reserves below our 20% runway threshold. CTO insists that failure to expand will cause 40% latency degradation during Q4 peak. SCM DAG shows Latency -> Churn -> Revenue. How should the board act?<|im_end|>
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
* **Dataset:** 3,000 SCM counterfactual reasoning, graph surgery, and boardroom quorum consensus pairs with verified SHA-256 Merkle root leaves.
* **Quantization:** 4-bit NormalFloat (NF4) during training; fp16 adapter weights stored in `.safetensors`.

---

## 📜 Citation & License

* **License:** Apache 2.0
* **Organization:** [Causarix Technologies](https://causarix.vercel.app)
* **Citation:**
```bibtex
@misc{causarix2026causal,
  author = {Causarix Technologies},
  title = {Causarix Global Causal 7B: Autonomous SCM Counterfactual & Boardroom Quorum Adapter},
  year = {2026},
  publisher = {Hugging Face},
  howpublished = {\url{https://huggingface.co/Causarix/causarix-global-causal-7b-lora}}
}
```
