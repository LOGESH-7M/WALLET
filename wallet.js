document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. DOM ELEMENTS
    // ==========================================
    // -- Modals & Triggers --
    const settingsTrigger = document.getElementById('settings-trigger');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const settingsForm = document.getElementById('settings-form');

    // -- Display Elements (Wallet Card) --
    const displayBalance = document.getElementById('display-balance');
    const displayHolder = document.getElementById('display-holder');
    const displayNumber = document.getElementById('display-number');
    const displayExpiry = document.getElementById('display-expiry');

    // -- Input Elements (Modal) --
    const editBalance = document.getElementById('edit-balance');
    const editHolder = document.getElementById('edit-holder');
    const editNumber = document.getElementById('edit-number');
    const editExpiry = document.getElementById('edit-expiry');

    // -- Transaction Sections --
    const addExpenseForm = document.querySelector('.add-expense-card form');
    const transactionList = document.querySelector('.transaction-list');
    const clearBtn = document.querySelector('.panel-header .btn-text');

    // ==========================================
    // 2. STATE MANAGEMENT & PERSISTENCE
    // ==========================================
    const DEFAULT_STATE = {
        wallet: {
            balance: 5000,
            holder: 'LOGESH M',
            number: '•••• •••• •••• 4970',
            expiry: '12/30'
        },
        transactions: []
    };

    let appState = loadState();

    function loadState() {
        try {
            const stored = localStorage.getItem('walletApp_data');
            return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULT_STATE));
        } catch (e) {
            console.error('Failed to load state', e);
            return DEFAULT_STATE;
        }
    }

    function saveState() {
        try {
            localStorage.setItem('walletApp_data', JSON.stringify(appState));
        } catch (e) {
            console.error('Failed to save state', e);
            showToast('Failed to save data', 'error');
        }
    }

    // Helper: Format Currency
    function formatCurrency(amount) {
        return '₹' + parseFloat(amount).toLocaleString('en-IN');
    }

    // ==========================================
    // 3. UI RENDERING
    // ==========================================
    function renderWallet() {
        if (!appState.wallet) return;

        if (displayBalance) displayBalance.textContent = formatCurrency(appState.wallet.balance);
        if (displayHolder) displayHolder.textContent = appState.wallet.holder;
        if (displayNumber) displayNumber.textContent = appState.wallet.number;
        if (displayExpiry) displayExpiry.textContent = appState.wallet.expiry;
    }

    function renderTransactions() {
        if (!transactionList) return;

        transactionList.innerHTML = '';

        if (appState.transactions.length === 0) {
            transactionList.innerHTML = `
                <div class="empty-icon">💸</div>
                <p>No transactions yet</p>
                <span>Start spending to see your history</span>
            `;
            transactionList.classList.add('empty-state');
            return;
        }

        transactionList.classList.remove('empty-state');

        // Render each transaction
        appState.transactions.forEach(tx => {
            const item = document.createElement('div');
            item.className = 'transaction-item';

            // Icon Mapping
            const icons = {
                food: '🍔', transport: '🚗', shopping: '🛍️',
                entertainment: '🎬', bills: '💳', other: '📦'
            };
            const icon = icons[tx.category] || '📦';

            // Format Category Title
            const categoryTitle = tx.category.charAt(0).toUpperCase() + tx.category.slice(1);

            item.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <div class="t-icon-box">${icon}</div>
                    <div class="t-details">
                        <div class="t-title">${categoryTitle}</div>
                        <div class="t-subtitle">${tx.note || 'No note'} • ${tx.date}</div>
                    </div>
                </div>
                <div class="t-amount expense">-${formatCurrency(tx.amount)}</div>
            `;

            transactionList.appendChild(item);
        });
    }

    // ==========================================
    // 4. ACTION LOGIC
    // ==========================================

    // --- Add Transaction ---
    function handleAddTransaction(amount, category, note) {
        const numAmount = parseFloat(amount);

        // 1. Update State: Transactions
        const newTx = {
            id: Date.now(), // simple unique id
            amount: numAmount,
            category: category,
            note: note,
            date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
        };

        // Add to beginning of array
        appState.transactions.unshift(newTx);

        // 2. Update State: Balance
        appState.wallet.balance = parseFloat(appState.wallet.balance) - numAmount;

        // 3. Persist & Render
        saveState();
        renderTransactions();
        renderWallet();
    }

    // --- Update Wallet Settings ---
    function handleUpdateSettings(newBalance, newHolder, newNumber, newExpiry) {
        // Clean balance string (remove ₹ if present)
        const cleanBalance = parseFloat(newBalance.toString().replace(/[₹,]/g, ''));

        appState.wallet.balance = isNaN(cleanBalance) ? 0 : cleanBalance;
        appState.wallet.holder = newHolder.toUpperCase();
        appState.wallet.number = newNumber;
        appState.wallet.expiry = newExpiry;

        saveState();
        renderWallet();
    }

    // --- Clear History ---
    function handleClearHistory() {
        appState.transactions = [];
        saveState();
        renderTransactions();
    }


    // ==========================================
    // 5. EVENT LISTENERS
    // ==========================================

    // --- Modal Open/Close ---
    function openModal() {
        if (!modalOverlay) return;
        // Pre-fill inputs from state
        if (editBalance) editBalance.value = appState.wallet.balance;
        if (editHolder) editHolder.value = appState.wallet.holder;
        if (editNumber) editNumber.value = appState.wallet.number;
        if (editExpiry) editExpiry.value = appState.wallet.expiry;

        modalOverlay.style.display = 'flex';
        setTimeout(() => modalOverlay.classList.add('active'), 10);
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        setTimeout(() => modalOverlay.style.display = 'none', 300);
    }

    if (settingsTrigger) settingsTrigger.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (modalClose) modalClose.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) closeModal(); });

    // --- Settings Form Submit ---
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleUpdateSettings(
                editBalance.value,
                editHolder.value,
                editNumber.value,
                editExpiry.value
            );
            closeModal();
            showToast('Wallet updated successfully', 'success');
        });
    }

    // --- Add Expense Submit ---
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const amountInput = document.getElementById('amount');
            const categoryInput = document.getElementById('category');
            const noteInput = document.getElementById('note');

            const amount = amountInput.value.trim();
            const category = categoryInput.value;
            const note = noteInput.value.trim();

            if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
                showToast('Please enter a valid amount', 'error');
                return;
            }

            handleAddTransaction(amount, category, note);
            showToast('Transaction added', 'success');

            // Reset Form
            amountInput.value = '';
            noteInput.value = '';
        });
    }

    // --- Clear History ---
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all transactions?')) {
                handleClearHistory();
                showToast('History cleared', 'success');
            }
        });
    }

    // ==========================================
    // 6. TOAST SYSTEM
    // ==========================================
    function showToast(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? '✅' : '⚠️';

        toast.innerHTML = `<span>${icon}</span><span class="toast-message">${message}</span>`;
        container.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
                if (container.children.length === 0) container.remove();
            });
        }, 3000);
    }

    // ==========================================
    // 7. INITIAL RENDER
    // ==========================================
    renderWallet();
    renderTransactions();
});
