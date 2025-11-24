# Copilot Studio Configuration

This directory contains the configuration files for the AgriVoice Copilot Studio integration.

## Setup Instructions

### 1. Create the Bot in Copilot Studio
- Log in to [Microsoft Copilot Studio](https://copilotstudio.microsoft.com)
- Click "Create" and choose "New bot"
- Name it "AgriVoice"
- Select "Integrate with an external service" when asked about knowledge sources

### 2. Configure Custom Actions
- In Copilot Studio, go to **Settings > Catalog**
- Click "Create action"
- Use the action definitions from `manifest.json` as reference:
  - **Analyze Image**: Call `/api/v1/analyze-image` endpoint
  - **Diagnose Crop**: Call `/api/v1/diagnose` endpoint
  - **Speech-to-Text**: Call `/api/v1/speech-to-text` endpoint
  - **Text-to-Speech**: Call `/api/v1/text-to-speech` endpoint

### 3. Create Topics
Create these topics in Copilot Studio:

#### Topic: "Check Crop Health"
- **Trigger phrases**: "my crop is sick", "diagnose my plant", "what's wrong with my maize"
- **Actions**: Call "Analyze Image" → Call "Diagnose Crop"
- **Response template**:
  ```
  Your crop has {disease_name} (Severity: {severity})
  
  Recommendations:
  {solutions}
  
  Recovery time: {recovery_days} days
  ```

#### Topic: "Voice Diagnosis"
- **Trigger phrases**: "ask me about my crop", "i want to speak"
- **Actions**: Call "Speech-to-Text" → Call "Diagnose Crop"
- **Response**: Same as above

### 4. Configure Environment
Update the following environment variables in Copilot Studio:
- `AGRIVOICE_API_URL`: URL of your deployed FastAPI backend

### 5. Test
- Open the "Test" panel in Copilot Studio
- Ask "my crop is sick"
- The bot should respond with diagnosis and recommendations

## API Integration Notes

All HTTP calls from Copilot Studio to the FastAPI backend should:
- Include proper error handling
- Use JSON payloads
- Handle authentication headers if needed
- Map response fields correctly

## For Production
- Update `AGRIVOICE_API_URL` to production backend URL
- Configure authentication tokens if required
- Set up monitoring and logging
- Test end-to-end workflows
