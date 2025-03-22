import z from 'zod'

const signupSchema = z.object({
    email: z.string().email(),
    name: z.string().min(3).max(26),
    password: z.string().min(6).max(26)
})

const signinSchema = z.object({
    
})

export { signupSchema, signinSchema }
