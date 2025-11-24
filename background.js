/**
 * Nizarios WA Direct - Background Service Worker
 * Handles context menu creation and phone number processing.
 */

// Initialize the context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "nizarios-wa-direct",
    title: "Open in WhatsApp 💬",
    contexts: ["selection"]
  });
});

// Handle the click event
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "nizarios-wa-direct" && info.selectionText) {
    const rawText = info.selectionText;
    const finalNumber = formatPhoneNumber(rawText);
    
    if (finalNumber) {
      openWhatsApp(finalNumber);
    } else {
      console.warn("Nizarios WA Direct: Could not parse a valid number from selection.");
    }
  }
});

/**
 * Strips non-numeric characters and applies localization rules.
 * @param {string} text - The selected text.
 * @returns {string} - The formatted phone number.
 */
function formatPhoneNumber(text) {
  // 1. Strip ALL non-numeric characters
  let cleanNumber = text.replace(/\D/g, '');

  // 2. Morocco Localization Rule
  // If number starts with '0' and is exactly 10 digits (e.g., 0611223344),
  // strip the '0' and prepend '212'.
  if (cleanNumber.startsWith('0') && cleanNumber.length === 10) {
    cleanNumber = '212' + cleanNumber.substring(1);
  }

  // Edge case: If the selection was just symbols/letters, cleanNumber might be empty
  if (cleanNumber.length === 0) return null;

  return cleanNumber;
}

/**
 * Opens the WhatsApp Web/API link in a new tab.
 * @param {string} phone - The clean phone number.
 */
function openWhatsApp(phone) {
  const url = `https://wa.me/${phone}`;
  chrome.tabs.create({ url: url, active: true });
}