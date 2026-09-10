import { defineField, defineType } from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Müşteri Yorumları',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Ad Soyad',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      title: 'Unvan / Şirket',
      type: 'string',
      description: 'Örn: "Tasarım Direktörü, ACME" veya "Bağımsız Kullanıcı"',
    }),
    defineField({
      name: 'comment',
      title: 'Yorum',
      type: 'text',
      rows: 4,
      validation: (r) =>
        r
          .required()
          .min(6).error('Yorum en az 6 karakter olmalıdır.')
          .max(250).warning('Yorumların 250 karakterden uzun olmaması önerilir.'),
    }),
    defineField({
      name: 'rating',
      title: 'Puan (1–5)',
      type: 'number',
      initialValue: 5,
      validation: (r) => r.required().min(1).max(5).integer(),
      options: {
        list: [
          { title: '⭐ 1', value: 1 },
          { title: '⭐⭐ 2', value: 2 },
          { title: '⭐⭐⭐ 3', value: 3 },
          { title: '⭐⭐⭐⭐ 4', value: 4 },
          { title: '⭐⭐⭐⭐⭐ 5', value: 5 },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'avatar',
      title: 'Profil Fotoğrafı',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Sıra',
      type: 'number',
      description: 'Küçük sayı önce gösterilir.',
      initialValue: 99,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
      rating: 'rating',
    },
    prepare({ title, subtitle, media, rating }) {
      const stars = '★'.repeat(rating ?? 5)
      return {
        title: `${stars}  ${title}`,
        subtitle,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Sıraya göre',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
