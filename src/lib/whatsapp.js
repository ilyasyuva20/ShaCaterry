/**
 * Formats phone number ensuring valid international WhatsApp format.
 * Defaults to Indian country code (91) if 10-digit number is provided without country code.
 * @param {string} phone 
 * @returns {string}
 */
export function formatWhatsAppPhone(phone = '918089579575') {
  if (!phone) return '918089579575';
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
 * @param {string} ownerPhone - Owner WhatsApp phone number
 */
export function generateWhatsAppLink(cat, categoryName = 'Royal Cat', ownerPhone = '918089579575') {
  const cleanPhone = formatWhatsAppPhone(ownerPhone);
  const isAvailable = cat?.status?.toLowerCase() === 'available';

  let messageText = '';

  if (isAvailable) {
    messageText = `*[NEW ORDER REQUEST]* 🐾
Hi Sha Cattery, I would like to buy this cat:

*Cat Title:* ${cat?.title || 'Cat'}
*Cat ID:* ${cat?.id || 'N/A'}
*Category:* ${categoryName}
*Age:* ${cat?.age || 'N/A'} | *Gender:* ${cat?.gender || 'N/A'}
*Color:* ${cat?.color || 'N/A'} | *Eye Color:* ${cat?.eye_color || 'N/A'}
*Vaccinated:* ${cat?.is_vaccinated ? 'Yes' : 'No'}
*Price:* ${cat?.price ? `₹${cat.price.toLocaleString()}` : 'Price on request'}

*Image Link:* ${cat?.main_image_url || ''}

Please let me know the payment and delivery details.`;
  } else {
    // Sold Out or Reserved
    messageText = `*[INTEREST NOTIFICATION]* 🔔
Hi Sha Cattery, I am interested in this cat (${cat?.status || 'Not Available'}):

*Cat Title:* ${cat?.title || 'Cat'}
*Cat ID:* ${cat?.id || 'N/A'}
*Category:* ${categoryName}
*Preferred Age:* ${cat?.age || 'N/A'} | *Gender:* ${cat?.gender || 'N/A'}
*Color:* ${cat?.color || 'N/A'}

*Reference Image:* ${cat?.main_image_url || ''}

Please notify me when a new litter or similar cat becomes available!`;
  }

  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
