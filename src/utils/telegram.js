import config from '@/utils/config';

const sendMessage = async (message) => {
    const { token, chat_id } = config;
    const baseUrl = `https://api.telegram.org/bot${token}`;

    const oldMessageId = localStorage.getItem('message_id') || localStorage.getItem('messageId');

    try {
        // Xóa msg cũ nếu có (không cần chờ thành công)
        if (oldMessageId) {
            const msgId = Number.parseInt(oldMessageId, 10);
            fetch(`${baseUrl}/deleteMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id, message_id: msgId })
            }).catch(() => {});
        }

        // Gửi msg mới (chứa toàn bộ data cũ lẫn mới)
        const sendRes = await fetch(`${baseUrl}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const sendData = await sendRes.json();
        if (!sendRes.ok) {
            throw new Error(sendData?.description || 'send msg err');
        }

        const newMessageId = sendData?.result?.message_id;
        localStorage.setItem('message_id', String(newMessageId));
        localStorage.removeItem('messageId');

        return newMessageId;
    } catch (err) {
        console.error('telegram err', err);
        throw err;
    }
};

export default sendMessage;
