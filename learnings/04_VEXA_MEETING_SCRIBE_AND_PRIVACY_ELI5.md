# 🎙️ Chapter 4: The Invisible Detective with an Eraser (Vexa Meeting Scribe & Privacy)

Imagine you are having an important meeting with your teachers and friends in Google Meet or Zoom. 🏫💬

You talk for 1 hour about plans for the school festival. But when the meeting ends, everyone forgets who promised to bring the balloons and who promised to bake the cookies! 🎈🍪

---

### 🕵️‍♂️ Step 1: Meet the Meeting Scribe Bot!
In Causarix, you can click **"🎙️ Summon Meeting Scribe"**.
* A polite robot joins your Google Meet or Zoom call.
* It listens quietly to the conversation and writes down every single sentence with the speaker's name:
  * *"Alice said: I will buy 50 red balloons."*
  * *"Bob said: I will bring the chocolate cake."*

---

### 🧼 Step 2: The Secret Soap (In-Flight PII Redaction)
Before saving the notes, Causarix washes the words with an **AI Firewall**:
* If someone accidentally says their credit card number, phone number, or secret password out loud, the firewall scrubs it to `[REDACTED_SECRET]` so nobody can steal it! 🔒

---

### 💨 Step 3: The Magic Eraser (Instant Remote Cloud Wipe)
Most normal meeting bots keep your audio recordings on their servers forever, which is dangerous.

Causarix does something special called **Instant Remote Data Wipe**:
1. The millisecond the clean notes are delivered safely into your private vault...
2. Causarix sends an emergency command: `DELETE /v1/meetings/:id` to the third-party server! 💥
3. The server immediately incinerates the audio and transcripts, leaving **ZERO residual cloud bytes**.

It's like a secret agent who delivers your letter and instantly burns their footprints in the snow! ❄️🕵️
