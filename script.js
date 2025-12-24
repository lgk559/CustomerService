document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chat-button');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    let isChatWindowOpened = false;
    let isBotReady = false;

    // 初始化 RiveScript
    const bot = new RiveScript();
    bot.loadFile('brain/main.rive').then(onReady).catch(onError);

    function onReady() {
        console.log('RiveScript is ready!');
        bot.sortReplies();
        isBotReady = true;
        chatInput.disabled = false;
        chatInput.placeholder = '輸入訊息...';

        // 如果使用者在 bot 準備好之前就已經點開視窗，則主動顯示歡迎訊息
        if (isChatWindowOpened) {
            bot.reply('local-user', '__welcome__').then((reply) => {
                addMessage('bot', reply);
            });
        }
    }

    function onError(err) {
        console.error('RiveScript error:', err);
    }

    // 開關聊天視窗
    chatButton.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');

        // 這是第一次打開
        if (!isChatWindowOpened && !chatWindow.classList.contains('hidden')) {
            isChatWindowOpened = true;
            // 如果 bot 已經準備好了，就立即顯示歡迎訊息
            if (isBotReady) {
                bot.reply('local-user', '__welcome__').then((reply) => {
                    addMessage('bot', reply);
                });
            }
        }
    });

    // 處理使用者輸入
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && chatInput.value.trim() !== '') {
            const userInput = chatInput.value.trim();
            addMessage('user', userInput);
            chatInput.value = '';

            bot.reply('local-user', userInput).then((reply) => {
                addMessage('bot', reply);
            }).catch((err) => {
                console.error('Reply error:', err);
            });
        }
    });

    // 將訊息新增到聊天視窗
    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.innerHTML = message; // 使用 innerHTML 才能解析 a 標籤
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // 自動捲動至底部
    }
});
