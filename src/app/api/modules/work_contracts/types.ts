import { z } from 'zod'

export const createWorkContractSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  salary: z.number().positive(),
  type: z.string().min(1),
  requirements: z.string().min(1),
})

export const updateWorkContractSchema = createWorkContractSchema.partial()

export type CreateWorkContractInput = z.infer<typeof createWorkContractSchema>
export type UpdateWorkContractInput = z.infer<typeof updateWorkContractSchema>