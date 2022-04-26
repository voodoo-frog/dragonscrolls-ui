// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import dbConnect from "../../lib/dbConnect";

export default function handler(req, res) {
  try {
    dbConnect()
    res.status(200).json({ message: 'CONNECTION ESTABLISHED' })
  } catch (error) {
    
  }
  res.status(200).json({ message: 'CONNECTION FAILED' })
}
