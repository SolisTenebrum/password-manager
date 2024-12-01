const generatePassword = (options, setInfoMessage) => {
  const alphabetLower = 'abcdefghijklmnopqrstuvwxyz'
  const alphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()-_=+[]{}|;:\'",.<>?/'

  const generateRandomCase = () => {
    const randomNumber = Math.random()
    if (randomNumber < 0.3) {
      return 'uppercase'
    }
    if (randomNumber < 0.6) {
      return 'lowercase'
    }
    return 'both'
  }

  const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)]

  const settings = {
    length: options.length,
    letters: {
      uppercase: options.letters.uppercase,
      lowercase: options.letters.lowercase,
      randomCase: options.letters.randomCase ? generateRandomCase() : options.letters.randomCase,
    },
    numbers: options.numbers,
    symbols: options.symbols,
    ownSet: options.ownSet,
    ownSetInput: options.ownSetInput,
  }

  const noCheckboxSelected =
    !settings.letters.uppercase &&
    !settings.letters.lowercase &&
    !settings.letters.randomCase &&
    !settings.numbers &&
    !settings.symbols &&
    !settings.ownSet

  if (noCheckboxSelected) {
    setInfoMessage('No checkbox selected')
    setTimeout(() => {
      setInfoMessage('')
    }, 2500)
    return
  }

  if (!settings.ownSetInput && settings.ownSet) {
    setInfoMessage('Own set is empty')
    return
  }

  setInfoMessage('')

  let allChars = ''
  if (settings.letters.lowercase) allChars += alphabetLower
  if (settings.letters.uppercase) allChars += alphabetUpper
  if (settings.numbers) allChars += numbers
  if (settings.symbols) allChars += symbols
  if (settings.ownSet && settings.ownSetInput) allChars += settings.ownSetInput

  let password = ''

  if (settings.letters.lowercase) {
    password += getRandomChar(alphabetLower)
  }
  if (settings.letters.uppercase) {
    password += getRandomChar(alphabetUpper)
  }
  if (settings.numbers) {
    password += numbers[Math.floor(Math.random() * numbers.length)]
  }
  if (settings.symbols) {
    password += symbols[Math.floor(Math.random() * symbols.length)]
  }

  switch (settings.letters.randomCase) {
    case 'uppercase':
      password += getRandomChar(alphabetUpper)
      break
    case 'lowercase':
      password += getRandomChar(alphabetLower)
      break
    case 'both':
      password += getRandomChar(alphabetLower)
      password += getRandomChar(alphabetUpper)
      break
    default:
      password += getRandomChar(allChars)
      break
  }

  let remainingLength = settings.length - password.length

  const getRandomCaseChar = (caseType) => {
    switch (caseType) {
      case 'uppercase':
        return getRandomChar(alphabetUpper)
      case 'lowercase':
        return getRandomChar(alphabetLower)
      case 'both':
        return Math.random() < 0.5 ? getRandomChar(alphabetLower) : getRandomChar(alphabetUpper)
      default:
        return allChars[Math.floor(Math.random() * allChars.length)]
    }
  }

  while (remainingLength > 0) {
    password += settings.letters.randomCase
      ? getRandomCaseChar(settings.letters.randomCase)
      : getRandomChar(allChars)
    remainingLength--
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

const generateUniqueId = () => {
  const id = crypto.randomUUID()

  return id
}

const copyToClipboard = async (password) => {
  if (!navigator.clipboard) {
    console.error('Clipboard API is not supported')
    return
  }
  try {
    await navigator.clipboard.writeText(password)
  } catch (err) {
    console.error('Failed to copy password to clipboard:', err)
    throw err
  }
}

const simulateServerRequest = (error) => {
  const randomChanceToConnect = Math.floor(Math.random() * 10)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (randomChanceToConnect > 5) {
          resolve('Success')
        } else {
          reject(error)
        }
      }, 1000)
    })
}

export { generateUniqueId, generatePassword, copyToClipboard, simulateServerRequest }
