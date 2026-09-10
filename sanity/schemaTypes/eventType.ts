import { defineField, defineType } from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Etkinlik',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Etkinlik Adı',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Etkinlik Tarihi ve Saati',
      type: 'datetime',
      options: {
        dateFormat: 'DD.MM.YYYY',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Konum',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'mainImage',
      title: 'Görsel',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatif metin',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Workshop', value: 'Workshop' },
          { title: 'Konferans', value: 'Konferans' },
          { title: 'Buluşma', value: 'Buluşma' },
          { title: 'Sunum', value: 'Sunum' },
          { title: 'Webinar', value: 'Webinar' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      date: 'eventDate',
    },
    prepare({ title, media, date }) {
      return {
        title,
        media,
        subtitle: date
          ? new Date(date).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Tarih belirtilmemiş',
      }
    },
  },
})
