import { useCallback, useState } from "react";

import { useRcbEventInternal } from "./useRcbEventInternal";
import { useBotStatesContext } from "../../context/BotStatesContext";
import { useSettingsContext } from "../../context/SettingsContext";
import { RcbEvent } from "../../constants/RcbEvent";

/**
 * Internal custom hook for managing chat window logic.
 */
export const useChatWindowInternal = () => {
	// handles settings
	const { settings } = useSettingsContext();

	// handles bot states
	const { isChatWindowOpen, setIsChatWindowOpen } = useBotStatesContext();

	// handles rcb events
	const { callRcbEvent } = useRcbEventInternal();

	// tracks scroll height
	const [chatScrollHeight, setChatScrollHeight] = useState<number>(0);

	// tracks view port height and width (for auto-resizing on mobile view)
	const [viewportHeight, setViewportHeight] = useState<number>(window.visualViewport?.height as number
		|| window.innerHeight);
	const [viewportWidth, setViewportWidth] = useState<number>(window.visualViewport?.width as number
		|| window.innerWidth);

	/**
	 * Toggles chat window.
	 */
	const toggleChatWindow = useCallback(() => {
		// handles toggle chat window event
		if (settings.event?.rcbToggleChatWindow) {
			const event = callRcbEvent(
				RcbEvent.TOGGLE_CHAT_WINDOW,
				{currState: isChatWindowOpen, newState: !isChatWindowOpen}
			);
			if (event.defaultPrevented) {
				return;
			}
		}
		setIsChatWindowOpen(prev => !prev);
	}, []);

	/**
	 * Handles opening/closing of the chat window.
	 *
	 * @param isOpen boolean indicating whether to open/close the chat window
	 */
	const openChat = useCallback((isOpen: boolean) => {
		if (isChatWindowOpen === isOpen) {
			return;
		}
		toggleChatWindow();
	}, [isChatWindowOpen]);

	return {
		isChatWindowOpen,
		setIsChatWindowOpen,
		toggleChatWindow,
		openChat,
		chatScrollHeight,
		setChatScrollHeight,
		viewportHeight,
		setViewportHeight,
		viewportWidth,
		setViewportWidth,
	};
};