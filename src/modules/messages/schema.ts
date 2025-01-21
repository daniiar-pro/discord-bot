import { z } from 'zod'
import type { Users } from '../../database'

// export interface Users {
//   congratsMessage: string
//   id: Generated<number | null>
//   sprintCode: string
//   sprintTitle: string | null
//   userName: string
// }

type Record = Users

const schema = z.object({
  congratsMessage: z.string().min(5).max(100),
  id: z.coerce.number().int().positive(),
  sprintCode: z.string(),
  sprintTitle: z.string(),
  userName: z.string(),
})

// schema version for inserting new records
const insertable = schema.omit({
  id:true
})

export const parseInsertable = (record: unknown) => insertable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
