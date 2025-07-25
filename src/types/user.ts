/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';

const LoggedUserSchema = z.object({
        id: z.number(),
        username: z.string(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        gender: z.string(),
        image: z.string(),
        accessToken: z.string(),
        refreshToken: z.string()    
});

const CurrentUserSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(), 
    maidenName: z.string(),
    age: z.number(),
    gender: z.string(),
    email: z.string(),
    phone: z.string(),
    username: z.string(),
    password: z.string(),
    birthDate: z.string(),
    image: z.string(),
    bloodGroup: z.string(),
    height: z.number(),
    weight: z.number(),
    eyeColor: z.string(),
    hair: z.object({
      color: z.string(),
      type: z.string()
    }),
    ip: z.string(),
    address: z.object({
      address: z.string(),
      city: z.string(),
      state: z.string(), 
      stateCode: z.string(),
      postalCode: z.string(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number()
      }),
      country: z.string()
    }),
    macAddress: z.string(),
    university: z.string(),
    bank: z.object({
      cardExpire: z.string(),
      cardNumber: z.string(),
      cardType: z.string(),
      currency: z.string(),
      iban: z.string()
    }),
    company: z.object({
      department: z.string(),
      name: z.string(),
      title: z.string(),
      address: z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        stateCode: z.string(),
        postalCode: z.string(),
        coordinates: z.object({
          lat: z.number(),
          lng: z.number()
        }),
        country: z.string()
      })
    }),
    ein: z.string(),
    ssn: z.string(),
    userAgent: z.string(),
    crypto: z.object({
      coin: z.string(),
      wallet: z.string(),
      network: z.string()
    }),
    role: z.string()
});

export type LoggedUser = z.infer<typeof LoggedUserSchema>;
export type CurrentUser = z.infer<typeof CurrentUserSchema>;
