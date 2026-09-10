/**
 * Yalnızca sunucu tarafında kullanılacak Sanity write client.
 * SANITY_API_WRITE_TOKEN değişkeni gereklidir.
 * ⚠️  Bu dosyayı asla 'use client' bileşenlerinden import etme.
 */
import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Yazma işlemlerinde CDN devre dışı
  token: process.env.SANITY_API_WRITE_TOKEN,
})
