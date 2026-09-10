import type { SchemaTypeDefinition } from 'sanity'
import { postType } from './postType'
import { eventType } from './eventType'
import { reservationType } from './reservationType'
import { testimonialType } from './testimonialType'

export const schemaTypes: SchemaTypeDefinition[] = [postType, eventType, reservationType, testimonialType]
