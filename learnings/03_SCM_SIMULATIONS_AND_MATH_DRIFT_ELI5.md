# 🧮 Chapter 3: The Magic Calculator That Never Lies (SCM & 0.00% Math Drift)

Have you ever tried adding lots of numbers in your head when you were super tired? You might calculate `50 + 75 = 120` by accident. 😴

Did you know normal AI models (like GPT-4o or Claude) do the same thing? When an AI is asked to calculate complicated multi-step finances (like revenue, taxes, interest rates, and inflation), it drifts and makes math errors between **9% and 17% of the time**! 😱

---

### 🎲 What is "SCM" (Structural Causal Modeling)?
**SCM** is a smart math formula created by a famous scientist named Judea Pearl. 

Instead of saying *"Ice cream sales and shark attacks happen at the same time, so ice cream attracts sharks!"* (which is silly), SCM finds the real **CAUSE**:
* The real cause is **SUMMER HEAT**! ☀️ (Hot weather makes people swim in the ocean AND eat ice cream).

In Causarix, SCM figures out what will REALLY happen if you change one lever:
* *"If we raise our prices by 10%, how many customers will leave, and will our bank account grow or shrink?"*

---

### 🎯 What Does "0.00% Math Drift" Mean?
To make sure Causarix never makes a math mistake, we built a **Python WebAssembly (WASM) engine**:
1. When you run 10,000 simulations, it uses real physics formulas (Box-Muller Gaussian normal distribution).
2. It enforces a strict rule:
   $$\text{Original Money} + \text{Real Impact} = \text{Final Money}$$
3. If even 1 penny is missing, the system alarms: *"Invariant Violation!"* and recalibrates automatically.

This guarantees that CFOs and banks get **100.00% exact math** every single time! 💯
