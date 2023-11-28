import * as utils from 'node:util'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import { browserConfig } from './config.mjs'
import { getResumes, getResumeDetails } from './selectors.mjs'


const delay = utils.promisify(setTimeout)

async function getPage(url, page, evaluateFn, timeout = 30000) {
    let retryNumber = 3
    let retryDelay = 5000

    while (retryNumber > 0) {
        try {
            console.log(url)

            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: timeout
            })

            const results = await page.evaluate(evaluateFn)

            if (!results?.length) {
                throw new Error('no results')
            }

            return results

        } catch (e) {
            console.log(e)
            retryNumber--
            await delay(retryDelay)
        }
    }

    return []
}

export default async function parse(position) {
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch(browserConfig)

    console.log(browserConfig, browser)

    const resumes = []
    const baseUrl = `https://spb.hh.ru/resumes/${position}`

    const page = await browser.newPage()

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    console.log(`parsing ${baseUrl}:`)

    for (let pageNumber = 0; pageNumber < 8; pageNumber++) {
        console.log(`  - page ${pageNumber}`)
        const url = `${baseUrl}?page=${pageNumber}`
        const pageResumes = await getPage(url, page, getResumes)
        console.log(`    found ${pageResumes.length} resumes`)
        resumes.push(...pageResumes)
    }

    console.log(`\nparsing ${baseUrl} resumes`)

    for (let resumeIndex = 0; resumeIndex < resumes.length; resumeIndex++) {
        const url = `${resumes[resumeIndex].url}`
        console.log(`  - resume ${resumeIndex}/${resumes.length} `)
        const details = await getPage(url, page, getResumeDetails)
        console.log(details)
        resumes[resumeIndex] = { ...resumes[resumeIndex], ...details }
    }

    await browser.close()
    return resumes
}


