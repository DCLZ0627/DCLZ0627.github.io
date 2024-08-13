const GIST_ID = 'https://gist.github.com/DCLZ0627/2f5ee73bc778898f16e89463f555d726.js';
const GIST_FILENAME = 'transactions.json';
const GITHUB_TOKEN = 'Y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'; // 为了读写 Gist 需要 GitHub Token

// 读取 Gist 内容
async function loadTransactions() {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    const data = await response.json();
    const files = data.files;
    
    if (files && files[GIST_FILENAME]) {
        const content = atob(files[GIST_FILENAME].content); // 解码 base64
        const transactions = JSON.parse(content);
        const list = document.getElementById('transaction-list');
        list.innerHTML = '';

        transactions.forEach(transaction => {
            const item = document.createElement('li');
            item.textContent = `${transaction.date} - ${transaction.description} - ${transaction.amount}元`;
            list.appendChild(item);
        });
    }
}

// 更新 Gist 内容
async function updateGist(transactions) {
    const gistContent = JSON.stringify(transactions);
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${GITHUB_TOKEN}`
        },
        body: JSON.stringify({
            files: {
                [GIST_FILENAME]: {
                    content: gistContent
                }
            }
        })
    });
    await response.json();
}

// 添加交易
async function addTransaction() {
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!isNaN(amount)) {
        let transactions = [];
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
        const data = await response.json();
        const files = data.files;

        if (files && files[GIST_FILENAME]) {
            const content = atob(files[GIST_FILENAME].content); // 解码 base64
            transactions = JSON.parse(content);
        }

        transactions.push({ date, description, amount });
        await updateGist(transactions); // 更新 Gist
        loadTransactions(); // 重新加载交易列表
        document.getElementById('transaction-form').reset();
    } else {
        alert('金额必须是一个有效的数字！');
    }
}

// 页面加载时加载交易
window.onload = loadTransactions;
