# **LLM-4-LLU: Large Language Models for Low Literacy Users**

## Project Overview

Almost everyone in Pakistan, including those who cannot read or write or those technologically less literate, such as the elderly, can communicate using WhatsApp through voice notes, calls, video calls, and sending photos. WhatsApp is also highly accessible to such users due to packages and deals by telecommunication companies where free mobile data is allocated purely for WhatsApp and Facebook.

### Aim 1: Leverage WhatsApp for Access to LLMs

**Objective:** Leverage the accessibility and usability of WhatsApp and bring access to LLMs like the GPT-4 API using low literacy first interfaces like voice notes.

**Pipeline:** 
- The user sends a voice note with a query to our bot, which is some standard phone number.
- Use audio-to-text models like Whisper-1 to transcribe the voice note.
- Pre-process it using local LLM or cheaper API like GPT-3.5, and then send a more straightforward prompt to GPT-4.
- The response is processed and sent to the user using some text-to-speech model like the one Dr. Agha’s lab has worked on.

**Challenges:** 
- Creating a system to weed out misuse of our service and filter out irrelevant requests or requests from blocked users.
- Creating a WhatsApp bot, leveraging an unofficial API based on Puppeteer and WhatsApp web, and accessing the official WhatsApp business API.

### Aim 2: Create an Efficient Pipeline

**Objective:** Create an efficient pipeline(s) of different LLMs and evaluate our approaches, such as using a local or cheap LLM to process the request and response.

**Challenges:** 
- The cumulative costs can be high for it to be a free-for-all service, especially with high usage.
- Explore other models for sustainability, like leveraging Jazz Cash for a pre-paid or post-paid account balance system.

### Aim 3: Design Pipelines for Advanced Use Cases

**Example:** 
A low-literacy Pakistani user wants to fill out a government form to apply for a CNIC but needs help reading or writing.

**Other Use Cases:** 
- Helping women who cannot read understand the legal implications of their nikah namas.
- Helping people learn about and apply for income support programs.
- Improving the availability of information and the internet to those who cannot read or write.
- Tackling education disparities.

### Alternative Projects

#### Aim A: Helpline Interface Over Phone

Utilize Whisper-1 to create a similar interface over the phone, with WhatsApp or phone calls, as a helpline the user can call for any general query.

#### Aim B: Intelligent Speech Processing

Create an intelligent speech processing algorithm to leverage Whisper-1’s transcription capabilities to do this more in real-time.
