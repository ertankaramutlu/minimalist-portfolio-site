import { defineField, defineType } from 'sanity'

export const reservationType = defineType({
  name: 'reservation',
  title: 'Rezervasyonlar',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Ad Soyad',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-posta',
      type: 'string',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'guests',
      title: 'Kişi Sayısı',
      type: 'number',
      validation: (r) => r.required().min(1).max(10),
    }),
    defineField({
      name: 'date',
      title: 'Tarih',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'time',
      title: 'Saat',
      type: 'string',
      options: {
        list: ['12:00', '14:00', '16:00', '18:00', '20:00'],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Özel Notlar',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'status',
      title: 'Durum',
      type: 'string',
      initialValue: 'beklemede',
      options: {
        list: [
          { title: '⏳ Beklemede', value: 'beklemede' },
          { title: '✅ Onaylandı', value: 'onaylandi' },
          { title: '❌ Reddedildi', value: 'reddedildi' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'createdAt',
      title: 'Kayıt Tarihi',
      type: 'datetime',
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      date: 'date',
      time: 'time',
      guests: 'guests',
      status: 'status',
    },
    prepare({ title, date, time, guests, status }) {
      const statusEmoji =
        status === 'onaylandi' ? '✅' : status === 'iptal' ? '❌' : '⏳'
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${date ?? '?'} · ${time ?? '?'} · ${guests ?? '?'} kişi`,
      }
    },
  },

  // Sanity Studio'da sadece başlık+tarih göster, listede yeni ilk sırala
  orderings: [
    {
      title: 'Kayıt Tarihi (yeni → eski)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Etkinlik Tarihi (yakın → uzak)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
})
