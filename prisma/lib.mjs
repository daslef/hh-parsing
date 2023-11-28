import { PrismaClient } from '@prisma/client'

function formatAge(age) {
    if (!age) {
        return null
    }
    return Number(age.split(' ')[0])
}


export async function updateDatabase(data) {
    const prisma = new PrismaClient()

    try {
        for (const resume of data) {
            await prisma.resume.create({
                data: {
                    ...resume,
                    age: formatAge(resume.age)
                }
            })
        }
        await prisma.$disconnect()
    } catch (e) {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    }
}

async function main() {
    const prisma = new PrismaClient()

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