document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const total = params.get("total") || "0.00";
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    document.getElementById("checkoutTotal").textContent = `Загальна сума: $${total}`;

    // ✅ Відображаємо список замовлених товарів
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = "";
    orders.forEach(order => {
        const listItem = document.createElement("li");
        listItem.textContent = `${order.name} - $${order.price.toFixed(2)}`;
        orderList.appendChild(listItem);
    });

    document.getElementById("checkoutForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!name || !address || !phone || !email) {
            alert("Будь ласка, заповніть усі поля!");
            return;
        }

        window.location.href = "payment.html";
    });
});
