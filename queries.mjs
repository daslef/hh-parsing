import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.resume.create({
        data: {
            title: 'Uborshitsa',
            age: 54,
            url: 'khdfkjdshfk.www.com'
        }
    })
    const resumes = await prisma.resume.findMany()
    console.log(resumes)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })