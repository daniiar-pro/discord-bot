import { z } from 'zod'
// import type { Sprint } from '../../database'

// type Record = Sprint

const insertable = z.object({
  sprintCode: z.string().min(1).max(20),
  sprintTitle: z.string().min(1).max(100),
})

const updateable = insertable.partial()

export const parseInsertable = (record: unknown) => insertable.parse(record)

export const parseUpdateable = (record: unknown) => updateable.parse(record)

