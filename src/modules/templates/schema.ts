import { z } from 'zod'

// import type { Templates } from '../../database'

// export interface Templates {
//   id: Generated<number | null>
//   template: string
// }

// type Record = Templates

const insertable = z.object({ template: z.string() })

const updateable = insertable.partial()

export const parseInsertable = (record: unknown) => insertable.parse(record)

export const parseUpdateable = (record: unknown) => updateable.parse(record)
