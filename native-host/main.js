let client = require('./external_code/discord-rich-presence')('1360799649363132528');

let currentWorkTitle = ''
let currentImage = {
    'archiveofourown.org': 'ao3_big_white_background_no_bg',
    'royalroad.com': 'royal_road_big_white_background_no_bg'
}
let currentStartDate = null

function getStartDate(workTitle) {
    if(workTitle == currentWorkTitle) return currentStartDate
    currentStartDate = Date.now()
    currentWorkTitle = workTitle
    return currentStartDate
}

const { stdin } = process;

// Helper to read an unsigned 32-bit int from a buffer (little-endian)
function readMessageLength(buffer) {
    return buffer.readUInt32LE(0);
}

// Buffer management
let inputBuffer = Buffer.alloc(0);

// Read from stdin (binary mode)
stdin.on('readable', () => {
    let chunk;
    while ((chunk = stdin.read()) !== null) {
        inputBuffer = Buffer.concat([inputBuffer, chunk]);

        while (inputBuffer.length >= 4) {
            const msgLength = readMessageLength(inputBuffer);

            if (inputBuffer.length >= 4 + msgLength) {
                const jsonData = inputBuffer.slice(4, 4 + msgLength).toString('utf8');
                inputBuffer = inputBuffer.slice(4 + msgLength); // remove processed message

                try {
                    const message = JSON.parse(jsonData);

                    switch(message.action) {
                        case 'update':
                            client.updatePresence({
                                state: `${message.currentChapterTitle}`,
                                details: `${message.currentWorkTitle}`,
                                startTimestamp: getStartDate(message.currentWorkTitle),
                                largeImageKey: currentImage[message.currentWebsite],
                                instance: true,
                            });
                        break;
                        case 'delete':
                            currentWorkTitle = ''
                            client.clearActivity()
                    }
                } catch (err) {
                    console.error("Failed to parse JSON message:", err);
                }
            } else {
                // Wait for the rest of the message
                break;
            }
        }
    }
});