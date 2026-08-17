/**
 * Formats phone number ensuring valid international WhatsApp format.
 * Defaults to Indian country code (91) if 10-digit number is provided without country code.
 * @param {string} phone 
 * @returns {string}
 */
export function formatWhatsAppPhone(phone = '') {
  if (!phone) return '';
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Generate formatted WhatsApp link for cat purchase or interest inquiry.
 * @param {Object} cat - Cat object
 * @param {string} categoryName - Category breed name
 * @param {Object|string} settingsOrPhone - Settings object from CatContext or owner phone number string
 */
export function generateWhatsAppLink(cat, categoryName = 'Royal Cat', settingsOrPhone = {}) {
  let ownerPhone = '';
  let catteryName = 'Sha Cattery';
  let currency = '₹';

  if (typeof settingsOrPhone === 'object' && settingsOrPhone !== null) {
    if (settingsOrPhone.ownerPhone) ownerPhone = settingsOrPhone.ownerPhone;
    if (settingsOrPhone.catteryName) catteryName = settingsOrPhone.catteryName;
    if (settingsOrPhone.currency) currency = settingsOrPhone.currency;
  } else if (typeof settingsOrPhone === 'string' && settingsOrPhone.trim()) {
    ownerPhone = settingsOrPhone;
  }

  const cleanPhone = formatWhatsAppPhone(ownerPhone);
  const isAvailable = cat?.status?.toLowerCase() === 'available';

  const priceDisplay = cat?.price > 0 ? `${currency}${cat.price.toLocaleString()}` : 'Price on Request';
  const businessUpper = (catteryName || 'Sha Cattery').toUpperCase();

  let messageText = '';

  if (isAvailable) {
    messageText = `👑 *${businessUpper} — NEW ORDER REQUEST* 🐾
─────────────────────────────
*Hi ${catteryName || 'Sha Cattery'},* I would like to buy this kitten!

📌 *KITTEN DETAILS*
• *Title:* ${cat?.title || 'Cat'}
• *Breed:* ${categoryName}
• *Age:* ${cat?.age || 'N/A'}
• *Gender:* ${cat?.gender || 'N/A'}
• *Color:* ${cat?.color || 'N/A'}
• *Eye Color:* ${cat?.eye_color || 'N/A'}
• *Vaccinated:* ${cat?.is_vaccinated ? 'Yes ✅' : 'No ❌'}

💰 *PRICE:* ${priceDisplay}

📸 *PHOTO PREVIEW:*
${cat?.main_image_url || ''}

💬 *Please share payment details and delivery options.*
─────────────────────────────`;
  } else {
    // Sold Out or Booked
    messageText = `🔔 *${businessUpper} — INTEREST NOTIFICATION* 🐾
─────────────────────────────
*Hi ${catteryName || 'Sha Cattery'},* I am interested in this kitten (*Status: ${cat?.status || 'Not Available'}*):

📌 *KITTEN DETAILS*
• *Title:* ${cat?.title || 'Cat'}
• *Breed:* ${categoryName}
• *Age:* ${cat?.age || 'N/A'}
• *Gender:* ${cat?.gender || 'N/A'}
• *Color:* ${cat?.color || 'N/A'}
• *Eye Color:* ${cat?.eye_color || 'N/A'}
• *Vaccinated:* ${cat?.is_vaccinated ? 'Yes ✅' : 'No ❌'}

💰 *LISTED PRICE:* ${priceDisplay}

📸 *PHOTO PREVIEW:*
${cat?.main_image_url || ''}

📩 *Please notify me when a new litter or similar kitten becomes available!*
─────────────────────────────`;
  }

  const encodedText = encodeURIComponent(messageText);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedText}` : '#';
}
