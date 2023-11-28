function getResumes() {
    const resumeSelector = '.serp-item'
    const resumeAgeSelector = '[data-qa="resume-serp__resume-age"] span'
    const resumeTitleSelector = '.serp-item__title'
    const resumeSalarySelector = '.bloko-text_large'

    console.log(document.querySelectorAll(resumeSelector))

    return [...document.querySelectorAll(resumeSelector)]
        .map(element => ({
            title: element.querySelector(resumeTitleSelector).innerText,
            age: element.querySelector(resumeAgeSelector)?.innerText || null,
            salary: element.querySelector(resumeSalarySelector)?.innerText || null,
            url: `https://spb.hh.ru${element.querySelector(resumeTitleSelector).getAttribute('href')}`
        }))
}

function getResumeDetails() {

    console.log(document.querySelectorAll('[data-qa]'))

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

    console.log({ ...details, specialization, educationCourses })

    return { ...details, specialization, educationCourses }
}

export { getResumes, getResumeDetails }