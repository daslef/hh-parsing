import puppeteer from 'puppeteer'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

async function updateDatabase(data) {
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

function formatAge(age) {
    if (!age) {
        return null
    }
    return Number(age.split(' ')[0])
}

function getResumes() {
    const resumeSelector = '.serp-item'
    const resumeAgeSelector = '[data-qa="resume-serp__resume-age"] span'
    const resumeTitleSelector = '.serp-item__title'
    const resumeSalarySelector = '.bloko-text_large'

    return [...document.querySelectorAll(resumeSelector)]
        .map(element => ({
            title: element.querySelector(resumeTitleSelector).innerText,
            age: element.querySelector(resumeAgeSelector)?.innerText || null,
            salary: element.querySelector(resumeSalarySelector)?.innerText || null,
            url: `https://spb.hh.ru${element.querySelector(resumeTitleSelector).getAttribute('href')}`
        }))
}

function getResumeDetails() {
    const details = {
        gender: document.querySelector('[data-qa="resume-personal-gender"]')?.innerText || null,
        location: document.querySelector('.bloko-translate-guard')?.innerText || null,
        busyness: document.querySelector('.resume-block-container > p:first-of-type')?.innerText || null,
        graphic: document.querySelector('.resume-block-container > p:nth-of-type(2)')?.innerText || null,
        experience: document.querySelector('[data-qa="bloko-header-2"] > span.resume-block__title-text_sub')?.innerText || null,
        aboutMe: document.querySelector('[data-qa="resume-block-skills-content"]')?.innerText || null,
        education: document.querySelector('[data-qa="resume-block-education"]')?.innerText || null,
        citizenship: document.querySelector('[data-qa="resume-block-additional"] .resume-block-container > p:first-of-type')?.innerText || null,
        workPermit: document.querySelector('[data-qa="resume-block-additional"] .resume-block-container > p:nth-of-type(2)')?.innerText || null
    }

    specialization = [...document.querySelectorAll('[data-qa="resume-block-position-specialization"]')]
        .map(el => el.innerText)

    educationCourses = [...document.querySelectorAll('[data-qa="resume-block-additional-education"] > .resume-block-item-gap')]
        ?.map(el => el.innerText)

    return { ...details, specialization, educationCourses }
}

export default async function parse(position) {
    const url = `https://spb.hh.ru/resumes/${position}`

    const browser = await puppeteer.launch({
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--no-zygote",
            "--disable-features=site-per-process"
        ]
    })

    const page = await browser.newPage()

    await page.setViewport({
        width: 800,
        height: 900,
        deviceScaleFactor: 1
    })

    const resumes = []

    for (let pageNumber = 0; pageNumber < 1; pageNumber++) {
        await page.goto(`${url}?page=${pageNumber}`, {
            waitUntil: 'networkidle0',
            timeout: 0
        })
        const pageResumes = await page.evaluate(getResumes)
        resumes.push(...pageResumes)
    }

    for (let resumeIndex = 0; resumeIndex < 2; resumeIndex++) {
        await page.goto(`${resumes[resumeIndex].url}`, {
            waitUntil: 'networkidle0',
            timeout: 0
        })

        const details = await page.evaluate(getResumeDetails)
        console.log(details)

        resumes[resumeIndex] = { ...resumes[resumeIndex], ...details }
    }

    // console.log(resumes, resumes.length)
    await browser.close()
    return resumes
}

// await updateDatabase(resumes)
