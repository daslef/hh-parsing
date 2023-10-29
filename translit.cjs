const symbolsTableRus = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'e',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'y',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'kh',
    'ц': 'c',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sh',
    'ъ': '',
    'ы': 'y',
    'ь': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya'
};

function translitRusEng(value = '') {
    return value.toLowerCase()
        .split('')
        .map((letter) => {
            const loweredLetter = letter.toLowerCase();

            if (symbolsTableRus[loweredLetter] !== undefined) {
                return symbolsTableRus[loweredLetter]
            }
            else if (loweredLetter === ' ') {
                return '_'
            }

            return letter
        })
        .join('')
};

module.exports = { translitRusEng }