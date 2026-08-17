export const INITIAL_CATEGORIES = [
  { id: 1, name: 'Persian Cat' },
  { id: 2, name: 'Siamese Cat' },
  { id: 3, name: 'Maine Coon' },
  { id: 4, name: 'Bengal Cat' },
  { id: 5, name: 'British Shorthair' },
  { id: 6, name: 'Himalayan Cat' },
  { id: 7, name: 'Exotic Short Hair' },
  { id: 8, name: 'Traditional Long Hair' },
];

export const INITIAL_CATS = [
  {
    id: 'c101a892-234b-4f8a-9e12-34567890abcd',
    category_id: 1,
    title: 'Snow Princess — White Persian Doll Face',
    age: '54 days',
    color: 'Pure Pure White',
    eye_color: 'Emerald Blue',
    gender: 'Female',
    is_vaccinated: true,
    status: 'Available',
    price: 28000.00,
    description: 'Breathtaking pure white Persian female kitten with fluffy coat, exceptionally sweet temperament, parent pedigree lines certified, litter trained.',
    main_image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-fluffy-cat-resting-on-a-couch-4091-large.mp4',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'c202b983-345c-5a9b-0f23-45678901bcde',
    category_id: 3,
    title: 'Thor — Giant Silver Tabby Maine Coon',
    age: '2 months',
    color: 'Silver Black Tabby',
    eye_color: 'Golden Amber',
    gender: 'Male',
    is_vaccinated: true,
    status: 'Available',
    price: 45000.00,
    description: 'Majestic Maine Coon male kitten with impressive lynx tips, thick coat, gentle giant personality. Super playful and affectionate.',
    main_image_url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-funny-cat-licking-its-paw-4094-large.mp4',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'c303c094-456d-6b0c-1a34-56789012cdef',
    category_id: 5,
    title: 'Barnaby — Plush Blue British Shorthair',
    age: '3 months',
    color: 'Classic Blue Gray',
    eye_color: 'Copper Orange',
    gender: 'Male',
    is_vaccinated: true,
    status: 'Sold Out',
    price: 32000.00,
    description: 'Chubby cheeks, dense teddy bear plush coat. Intelligent and relaxed nature. Currently sold out to a loving home.',
    main_image_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1000&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  },
  {
    id: 'c404d105-567e-7c1d-2b45-67890123defa',
    category_id: 4,
    title: 'Simba — Leopard Spotted Rosetted Bengal',
    age: '5 months',
    color: 'Brown Spotted Tabby',
    eye_color: 'Emerald Green',
    gender: 'Male',
    is_vaccinated: true,
    status: 'Available',
    price: 52000.00,
    description: 'High contrast rosette markings with wild leopard look, energetic, highly communicative and loves interactive fetch play.',
    main_image_url: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?auto=format&fit=crop&w=1000&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-cat-looking-intently-at-something-4092-large.mp4',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    id: 'c505e216-678f-8d2e-3c56-78901234efab',
    category_id: 2,
    title: 'Luna — Seal Point Blue-Eyed Siamese',
    age: '2 months',
    color: 'Seal Point',
    eye_color: 'Deep Sapphire Blue',
    gender: 'Female',
    is_vaccinated: false,
    status: 'Available',
    price: 22000.00,
    description: 'Slender elegant body structure with dark contrast mask, ears, and tail. Highly social, vocals are gentle and loving.',
    main_image_url: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1000&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    id: 'c606f327-789a-9e3f-4d67-89012345fabc',
    category_id: 6,
    title: 'Milo — Chocolate Point Himalayan Kitten',
    age: '60 days',
    color: 'Chocolate Point',
    eye_color: 'Vivid Cyan',
    gender: 'Male',
    is_vaccinated: true,
    status: 'Booked',
    price: 30000.00,
    description: 'Fluffy Himalayan kitten combining Persian fur coat with Siamese color points. Reserved by customer, inquiries open for next litter.',
    main_image_url: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=1000&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString()
  },
  {
    id: 'c707g438-890b-0f4a-5e78-90123456abcd',
    category_id: 7,
    title: 'Oliver — Plush Silver Exotic Short Hair',
    age: '50 days',
    color: 'Silver Shaded',
    eye_color: 'Vivid Green',
    gender: 'Male',
    is_vaccinated: true,
    status: 'Available',
    price: 38000.00,
    description: 'Chubby doll-face Exotic Short Hair kitten with teddy bear plush coat. Friendly, cuddly, litter trained.',
    main_image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: 'c808h549-901c-1a5b-6f89-01234567bcde',
    category_id: 8,
    title: 'Bella — Golden Doll Face Traditional Long Hair',
    age: '2 months',
    color: 'Golden Cream',
    eye_color: 'Deep Amber',
    gender: 'Female',
    is_vaccinated: true,
    status: 'Available',
    price: 32000.00,
    description: 'Classic Traditional Long Hair (Doll Face) female kitten with luxurious long coat, sweet expression, very affectionate.',
    main_image_url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1000&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString()
  }
];
