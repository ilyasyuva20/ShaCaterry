/**
 * Generate formatted WhatsApp link for cat purchase or interest inquiry.
 * @param {Object} cat - Cat object
 * @param {string} categoryName - Category breed name
 * @param {string} ownerPhone - Owner WhatsApp phone number
 */
export function generateWhatsAppLink(cat, categoryName = 'Royal Cat', ownerPhone = '919876543210') {
  // Clean phone number (only keep digits)
  const cleanPhone = ownerPhone.replace(/\D/g, '');

  let messageText = '';

  if (cat.status === 'Available') {
    messageText = `*[NEW ORDER REQUEST]* 🐾
Hi Sha Cattery, I would like to buy this cat:

*Cat ID:* ${cat.id}
*Category:* ${categoryName}
*Age:* ${cat.age} | *Gender:* ${cat.gender}
*Color:* ${cat.color} | *Eye Color:* ${cat.eye_color}
*Vaccinated:* ${cat.is_vaccinated ? 'Yes' : 'No'}

*Image Link:* ${cat.main_image_url}
Please let me know the payment and delivery details.`;
  } else {
    // Sold Out or Reserved
    messageText = `*[INTEREST NOTIFICATION]* 🔔
Hi Sha Cattery, I know this cat is currently *Sold Out*, but I am highly interested if a similar one becomes available!

*Category:* ${categoryName}
*Preferred Age:* ${cat.age} | *Gender:* ${cat.gender}
*Color:* ${cat.color}

*Reference Image:* ${cat.main_image_url}
Please notify me when a new litter arrives.`;
  }

  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
