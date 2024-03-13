document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const formData = new FormData(this);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    fetch('/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include' 
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = 'Transaction added successfully!';
        window.location.href = '/dashboard';
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'Error adding transaction.';
    });
});
