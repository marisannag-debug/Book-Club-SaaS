import { z } from 'zod'

export const ClubCreateSchema = z.object({
  name: z.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki').max(100),
  description: z.string().max(1000).optional(),
})

export type ClubCreateInput = z.infer<typeof ClubCreateSchema>

export default ClubCreateSchema
