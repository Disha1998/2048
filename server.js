const { Telegraf, Markup } = require('telegraf');
const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your actual bot token
const bot = new Telegraf(TOKEN);

const rows = 4;
const columns = 4;
let boards = {};  // Using an object to maintain state per chat

// Initialize game board
function initializeBoard() {
    return Array.from({ length: rows }, () => Array(columns).fill(0));
}

// Add a new '2' to the board at a random empty position
function addTwo(board) {
    let added = false;
    while (!added) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = 2;
            added = true;
        }
    }
}

// Check if there are empty tiles
function hasEmptyTile(board) {
    return board.some(row => row.includes(0));
}

// Slide and combine tiles in one direction
function slide(board, direction) {
    // Rotate the board to simplify sliding to the left
    let rotated = rotateBoard(board, direction);
    rotated = rotated.map(row => {
        let filteredRow = row.filter(num => num !== 0); // Remove zeros
        for (let i = 0; i < filteredRow.length - 1; i++) {
            if (filteredRow[i] === filteredRow[i + 1]) {
                filteredRow[i] *= 2;
                filteredRow[i + 1] = 0;
            }
        }
        filteredRow = filteredRow.filter(num => num !== 0); // Remove zeros again
        while (filteredRow.length < columns) {
            filteredRow.push(0);
        }
        return filteredRow;
    });
    return rotateBoard(rotated, -direction); // Rotate back
}

// Rotate the board based on direction
function rotateBoard(board, direction) {
    switch (direction) {
        case 'left':
            return board;
        case 'right':
            return board.map(row => row.slice().reverse());
        case 'up':
            return transpose(board);
        case 'down':
            return transpose(board).map(row => row.slice().reverse());
        default:
            return board;
    }
}

// Transpose the board (rows become columns)
function transpose(board) {
    return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
}

// Start or restart the game
bot.start((ctx) => {
    boards[ctx.chat.id] = initializeBoard();
    addTwo(boards[ctx.chat.id]);
    addTwo(boards[ctx.chat.id]);
    ctx.reply('Welcome to 2048! Use /play to start playing.', Markup.inlineKeyboard([
        Markup.button.webApp('Play on Web', 'https://2048-new.vercel.app/')
    ]));
});

// Play the game within Telegram
bot.command('play', (ctx) => {
    if (!boards[ctx.chat.id] || !hasEmptyTile(boards[ctx.chat.id])) {
        boards[ctx.chat.id] = initializeBoard();
        addTwo(boards[ctx.chat.id]);
        addTwo(boards[ctx.chat.id]);
    }
    let boardDisplay = formatBoard(boards[ctx.chat.id]);
    ctx.reply(`Current Board:\n${boardDisplay}\nUse /move <left|right|up|down> to make a move.`);
});

// Handle move commands
bot.command('move', (ctx) => {
    let parts = ctx.message.text.split(' ');
    if (parts.length < 2) {
        ctx.reply('Please specify a direction: /move <left|right|up|down>');
        return;
    }
    let direction = parts[1].toLowerCase();
    if (!['left', 'right', 'up', 'down'].includes(direction)) {
        ctx.reply('Invalid direction. Use one of: left, right, up, down.');
        return;
    }
    if (boards[ctx.chat.id]) {
        boards[ctx.chat.id] = slide(boards[ctx.chat.id], direction);
        if (hasEmptyTile(boards[ctx.chat.id])) {
            addTwo(boards[ctx.chat.id]);
        }
        let boardDisplay = formatBoard(boards[ctx.chat.id]);
        ctx.reply(`Moved ${direction}.\n${boardDisplay}`);
    } else {
        ctx.reply('No game in progress. Use /play to start a new game.');
    }
});

// Format the board as a string
function formatBoard(board) {
    return board.map(row => row.join(' ')).join('\n');
}

// Launch the bot
bot.launch();
console.log('Bot is running. Press CTRL+C to stop.');
