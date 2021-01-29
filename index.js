function parseBlueprint(blueprint, data, index) {
    const output = `${blueprint.content(data, index)}`

    if (output.length > blueprint.length) {
        return output.substr(0, blueprint.length)
    }

    if (blueprint.fillStart) {
        return output.padStart(blueprint.length, blueprint.fillStart)
    }

    return output.padEnd(blueprint.length, blueprint.fillEnd || ' ')
}

function parseBlock(block, data) {
    const { blueprints, itemsBuilder } = block
    const parsedData = itemsBuilder ? itemsBuilder(data) : data
    const process = (lineInfo, index = 0) => blueprints.reduce((output, blueprint) => `${output}${parseBlueprint(blueprint, lineInfo, index)}`, '')

    if (Array.isArray(parsedData)) {
        const lines = parsedData.map((line, index) => process(line, index))
        return lines.join('\n')
    }

    return process(parsedData)
}

/**
 * Method to transform a structure and the data in a structured textfile
 *
 * Each block is an array with n instructions
 * Each instruction is an object with the following structure:
 *
 * {
 *  content: json => string, // given the entire data, what should be written in this position
 *  length: number, // characters this field must contain
 *  fillStart: string, // what to fill in the start of the string, if size(content) < length
 *  fillEnd: string, // what to fill in the end of the string, if size(content) < length
 * }
 *
 *
 * @param {array[blueprint] | blueprint} blocks each block is a line in the textfile
 * @param {json} data the data that it will be used to build the file
 *
 * @returns string  the file content in string format
 *
 * @example
 *
 * const blockLine = {
 *  itemsBuilder: (json) => json.list,
 *  blueprints: [
 *    { content: () => {}, length: 100, fillStart: '0' },
 *    { content: () => {}, length: 10, fillEnd: '0' },
 *  ]
 * }
 *
 * const blocks = [ blockLine ]
 *
 * return jsonToStructuredTxt( blocks, json )
 *
 */
function jsonToStructuredTxt(blocks, data) {
    const lines = blocks.map((block) => parseBlock(block, data))
    return Buffer.from(lines.join('\n'), 'utf-8')
}

module.exports = {
    jsonToStructuredTxt,
}
