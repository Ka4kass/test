document.addEventListener("DOMContentLoaded", function () {
    const orderList = document.getElementById("orderList");
    const orderCount = document.getElementById("orderCount");
    const orderTotal = document.getElementById("orderTotal");
    const clearOrdersButton = document.getElementById("clearOrders");
    const orderProductButton = document.getElementById("orderProduct");
    const orderModal = document.getElementById("orderModal");
    const closeModalButton = document.getElementById("closeModal");
    const continueOrderButton = document.getElementById("continueOrder"); // Кнопка переходу

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (!Array.isArray(orders)) orders = [];

    function updateOrderList() {
        if (!orderList) return;

        orderList.innerHTML = "";
        let totalAmount = 0;

        orders.forEach((order, index) => {
            if (!order || !order.name || typeof order.price !== "number" || isNaN(order.price)) return;

            const orderItem = document.createElement("div");
            orderItem.classList.add("order-item");
            orderItem.innerHTML = `
                <span>${index + 1}. ${order.name} (${order.city}) - $${order.price.toFixed(2)}</span>
                <button onclick="removeOrder(${index})">Remove</button>
            `;
            orderList.appendChild(orderItem);

            totalAmount += order.price;
        });

        if (orderCount) orderCount.textContent = orders.length;
        if (orderTotal) orderTotal.textContent = `Загальна сума: $${totalAmount.toFixed(2)}`;
    }

    function openModal() {
        if (orderModal) {
            orderModal.classList.add("open");
            orderModal.style.visibility = "visible";
            orderModal.style.opacity = "1";
        }
    }

    function closeModal() {
        if (orderModal) {
            orderModal.classList.remove("open");
            orderModal.style.visibility = "hidden";
            orderModal.style.opacity = "0";
        }
    }

    function addOrder(productName, productCity, productPrice) {
        if (!productName || !productCity || isNaN(productPrice)) return;

        orders.push({ name: productName, city: productCity, price: parseFloat(productPrice) });
        localStorage.setItem("orders", JSON.stringify(orders));
        updateOrderList();

        openModal(); // Відкриваємо модальне вікно після замовлення
    }

    window.removeOrder = function (index) {
        orders.splice(index, 1);
        localStorage.setItem("orders", JSON.stringify(orders));
        updateOrderList();
    };

    if (clearOrdersButton) {
        clearOrdersButton.addEventListener("click", () => {
            orders = [];
            localStorage.removeItem("orders");
            updateOrderList();
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", closeModal);
    }

    // ✅ Натискання на "Continue to Order" відкриває `checkout.html`
    if (continueOrderButton) {
        continueOrderButton.addEventListener("click", () => {
            const totalAmount = orderTotal.textContent.replace("Загальна сума: $", "").trim();
            window.location.href = `checkout.html?total=${encodeURIComponent(totalAmount)}`;
        });
    }

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || "Невідомий товар";
    const city = params.get("city") || "Невідоме місто";
    const price = params.get("price") || "0.00";

    if (document.getElementById("product-name")) {
        document.getElementById("product-name").textContent = name;
        document.getElementById("product-city").textContent = `Місто: ${city}`;
        document.getElementById("product-price").textContent = `Ціна: $${price}`;
    }

    if (orderProductButton) {
        orderProductButton.addEventListener("click", () => {
            addOrder(name, city, price);
        });
    }

    updateOrderList();
});
