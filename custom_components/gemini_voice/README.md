# Gemini Multimodal Voice Engine for Home Assistant

A custom component (HACS Integration) for Home Assistant that provides a native Voice/Conversation Assistant powered directly by the official Google Gemini API (`google-genai` SDK).

## Features

- **Native Multimodal Pipeline:** Speech/Text directly processed using Gemini models.
- **Dynamic State Injection:** Discovers Home Assistant entities dynamically and includes active states in context.
- **Bengali First:** Configured with primary Bengali system instructions for clean speech synthesis without markdown formatting.
- **Companion App Ready:** Works smoothly on Home Assistant Companion App (Android/iOS) and browsers.
- **Sidebar Panel:** Adds a dedicated "Gemini Voice Engine" panel to the navigation bar.

## Installation via HACS

1. Open **HACS** in Home Assistant.
2. Click the three dots on the top right corner and select **Custom repositories**.
3. Add repository URL: `https://github.com/custom_components/gemini_voice`
4. Category: **Integration**
5. Click **Download** and restart Home Assistant.

## Configuration

1. Go to **Settings -> Devices & Services -> Add Integration**.
2. Search for **Gemini Multimodal Voice Engine**.
3. Enter your **Google Gemini API Key**.
4. Select model (e.g., `gemini-2.5-flash`) and adjust system prompt if required.
5. In **Settings -> Voice Assistants**, select **Gemini Voice Engine** as your default conversation provider.

## Network & Open Container Notes

This component requires outbound internet access to contact Google Gemini API endpoints (`generativelanguage.googleapis.com`). Ensure your Docker container or Host environment permits outgoing SSL connections.
