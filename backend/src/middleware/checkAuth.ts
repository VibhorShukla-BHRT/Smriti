import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'

const middleware = express()

middleware.use(session({
  secret: 'S&CR&T',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}))

middleware.use(express.json())

middleware.use((req: Request, res: Response, next: NextFunction) => {
  if(!req.session.isLoggedIn) {
    res.status(401).json({ isAuthenticated: false, redirectTo: '/login' })
    return
  }
  return next()
})

export { middleware }