import { Message } from "../types/Message";
import { Settings } from "../types/Settings";

/**
 * Handles reading out of messages sent by the bot.
 * 
 * @param message message to read out
 * @param language language to listen for
 * @param voiceNames list of voice names to use
 * @param rate speech rate
 * @param volume play volume
 */
const speak = (message: string, language: string, voiceNames: string[], rate: number, volume: number) => {
	const utterance = new SpeechSynthesisUtterance();
	utterance.text = message;
	utterance.lang = language;
	utterance.rate = rate;
	utterance.volume = volume;

	let voiceIdentified = false;
	for (const voiceName of voiceNames) {
		window.speechSynthesis.getVoices().find((voice) => {
			if (voice.name === voiceName) {
				utterance.voice = voice;
				window.speechSynthesis.speak(utterance);
				voiceIdentified = true;
				return;
			}
		});
		if (voiceIdentified) {
			break;
		}
	}
	
	// if cannot find voice, use default
	if (!voiceIdentified) {
		window.speechSynthesis.speak(utterance);
	}
}

/**
 * Handles logic for whether a bot message should be read out.
 * 
 * @param botSettings options provide to the bot
 * @param voiceToggledOn boolean indicating if voice is toggled on
 * @param message message to read out
 */
export const processAudio = (botSettings: Settings, voiceToggledOn: boolean, message: Message) => {
	if (botSettings.audio?.disabled || message.sender === "user" || typeof message.content !== "string"
		|| (!botSettings?.isOpen && !botSettings.general?.embedded) || !voiceToggledOn) {
		return;
	}

	speak(message.content, botSettings.audio?.language as string, botSettings.audio?.voiceNames as string[],
		botSettings.audio?.rate as number, botSettings.audio?.volume as number);
}