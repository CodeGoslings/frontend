/* eslint-disable no-undef */
const fastify = require('fastify')({ logger: true })
const fastifyCors = require('@fastify/cors')

fastify.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

const mockUser = {
    id: 1,
    uuid: 'aee889f4-ea54-4ca4-a1fc-63580c7d2c3f',
    name: 'John Doe',
    email: 'john.doe@example.com',
    token: 'john-mock-Doe-token-12345',
}

fastify.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body

    if (email === 'john.doe@example.com' && password === 'password') {
        return reply.send({
            user: { id: mockUser.id, name: mockUser.name, email: mockUser.email },
            token: mockUser.token,
        })
    } else {
        return reply.code(401).send({ error: 'Invalid email or password' })
    }
})

fastify.post('/auth/logout', async (request, reply) => {
    return reply.send({ message: 'Logged out successfully' })
})

fastify.get('/user', async (request, reply) => {
    const authHeader = request.headers.authorization

    if (authHeader === `Bearer ${mockUser.token}`) {
        return reply.send({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
        })
    } else {
        return reply.code(403).send({ error: 'Unauthorized' })
    }
})

const startServer = async () => {
    try {
        const port = 3030
        await fastify.listen({ port: port, host: '0.0.0.0' })
        console.log(`Mock API running...`)
    } catch (err) {
        fastify.log.error(err)
    }
}

startServer()
