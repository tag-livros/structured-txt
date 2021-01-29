const { jsonToStructuredTxt } = require('../index.js')

describe('jsonToStructuredTxt', () => {
    test('check with only init block', () => {
        const blueprintInicio = {
            blueprints: [
                {
                    content: () => 'INI',
                    length: 3,
                },
            ]
        }

        const blocks = [blueprintInicio]
        const mockData = {}

        const response = jsonToStructuredTxt(blocks, mockData)
        expect(Buffer.isBuffer(response)).toBeTruthy()
        expect(response.toString()).toBe('INI')
    })

    test('data longer than length should be cropped', () => {
        const blueprintInfo = {
            content: (data) => data.clientName,
            length: 10,
        }
        const blueprints = {
            blueprints: [blueprintInfo]
        }

        const blocks = [blueprints]
        const mockData = {
            clientName: 'Client Name Longer Than Expected',
        }

        const response = jsonToStructuredTxt(blocks, mockData)

        expect(response.toString()).toBe(mockData.clientName.slice(0, blueprintInfo.length))
    })

    test('data shorter than length should be completed with space', () => {
        const blueprintInfo = {
            content: (data) => data.clientName,
            length: 5,
        }
        const blueprints = {
            blueprints: [blueprintInfo]
        }

        const blocks = [blueprints]
        const mockData = {
            clientName: 'c',
        }

        const response = jsonToStructuredTxt(blocks, mockData)

        expect(response.toString()).toBe('c    ')
    })

    test('fillStart put the caracter between the inicial position and the data', () => {
        const blueprintInfo = {
            content: (data) => data.clientId,
            fillStart: '0',
            length: 5,
        }
        const blueprints = {
            blueprints: [blueprintInfo]
        }

        const blocks = [blueprints, blueprints]
        const mockData = {
            clientId: '1',
        }

        const response = jsonToStructuredTxt(blocks, mockData)

        expect(response.toString()).toBe('00001\n00001')
    })

    test('fillEnd put the caracter between the last position and total length', () => {
        const blueprintInfo = {
            content: (data) => data.clientId,
            fillEnd: '0',
            length: 5,
        }
        const blueprints = {
            blueprints: [blueprintInfo]
        }

        const blocks = [blueprints, blueprints]
        const mockData = {
            clientId: '1',
        }

        const response = jsonToStructuredTxt(blocks, mockData)

        expect(response.toString()).toBe('10000\n10000')
    })

    test('Given both fillStart and fillEnd, it should apply only fillStart', () => {
        const blueprintInfo = {
            content: (data) => data.clientId,
            fillEnd: '0',
            fillStart: '*',
            length: 5,
        }
        const blueprints = {
            blueprints: [blueprintInfo]
        }

        const blocks = [blueprints]
        const mockData = {
            clientId: '1',
        }

        const response = jsonToStructuredTxt(blocks, mockData)

        expect(response.toString()).toBe('****1')
    })

    test('More than one data per line is supported', () => {
        const blueprintInfo = {
            content: (data) => data.client.id,
            fillStart: '0',
            length: 4,
        }
        const secondInfo = {
            content: (data) => data.client.name,
            length: 15,
        }

        const blueprints = {
            blueprints: [blueprintInfo, secondInfo]
        }

        const blocks = [blueprints]
        const mockData = {
            client: {
                id: '35',
                name: 'Best Client',
            },
        }

        const response = jsonToStructuredTxt(blocks, mockData)

        expect(response.toString()).toBe('0035Best Client    ')
    })


    test('Stringfy data when not string', () => {
        const blueprintInfo = {
            content: (data) => data.client.id,
            fillStart: '0',
            length: 4,
        }
        const secondInfo = {
            content: (data) => data.client.name,
            length: 15,
        }
        const blueprints = {
            blueprints: [blueprintInfo, secondInfo]
        }

        const blocks = [blueprints]
        const mockData = {
            client: {
                id: 35,
                name: 'Best Client',
            },
        }

        const response = jsonToStructuredTxt(blocks, mockData)

        expect(response.toString()).toBe('0035Best Client    ')
    })

    test('multiple lines of information is supported', () => {
        const blueprintInfo = {
            content: (line, index) => `${index}${line.id}`,
            fillStart: '0',
            length: 4,
        }
        const secondInfo = {
            content: (line) => line.name,
            length: 17,
        }

        const blueprints = {
            itemsBuilder: (json) => json.lines,
            blueprints: [blueprintInfo, secondInfo]
        }

        const blocks = [blueprints]
        const mockData = {
            lines: [
                {
                    id: 15,
                    name: 'Best Client'
                },
                {
                    id: 25,
                    name: 'Not so bad Client'
                },
                {
                    id: 35,
                    name: 'Awful Client'
                }
            ]
        }

        const response = jsonToStructuredTxt(blocks, mockData)

        expect(response.toString()).toMatchSnapshot()
    })
})
