const validSuffixes = [
    "k",
    "m",
    "b",
    "t",
    "qa",
    "qi",
    "sx",
    "sp",
    "oc",
    "no",
    "dc",
    "ud",
    "dd",
    "td",
    "qad",
    "qid",
    "sxd",
    "spd"
]

module.exports = (input) => {
    input = input.toLowerCase()

    const match = input.match(/^(\d+(\.\d+)?)([a-zA-Z]*)$/)

    if (!match) {
        return false
    }

    const numberPart = match[1]
    const suffixPart = match[3]

    return suffixPart === '' || validSuffixes.includes(suffixPart);
}