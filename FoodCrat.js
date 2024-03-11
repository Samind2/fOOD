const cart = {};

document.querySelectorAll(".order-button").forEach((button) => {
  button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      const price = parseFloat(button.getAttribute("data-price"));
      // เปลี่ยนการดึงชื่ออาหารจากตัวอักษรที่มีคุณสมบัติเฉพาะ
      const productName = button.parentElement.querySelector(".card-title").textContent;

      if (!cart[productId]) {
          cart[productId] = {
              quantity: 1,
              price: price,
              name: productName,
          };
      } else {
          cart[productId].quantity++;
      }
      updateCartDisplay();
  });
});

function calculateTotalPriceAndQuantity() {
    let totalQuantity = 0;
    let totalPrice = 0;

    for (const productId in cart) {
        const item = cart[productId];
        if (!isNaN(item.price)) {
            totalQuantity += item.quantity;
            totalPrice += item.quantity * item.price;
        }
    }

    return { totalQuantity, totalPrice };
}

function updateCartDisplay() {
    const orderItemsElement = document.querySelector(".order-items");
    const orderTotalElement = document.getElementById("order-total");
    orderItemsElement.innerHTML = "";

    let { totalQuantity, totalPrice } = calculateTotalPriceAndQuantity();

    for (const productId in cart) {
        const item = cart[productId];
        if (!isNaN(item.price)) {
            const orderItemElement = document.createElement("div");
            orderItemElement.classList.add("order-item");
            orderItemElement.innerHTML = `
                <p><span class="item-name">${item.name}</span> - Quantity: <span class="item-quantity">${item.quantity}</span> x $<span class="item-price">${item.price.toFixed(2)}</span> 
                <button class="remove-button" data-product-id="${productId}">Remove</button></p>
            `;
            orderItemsElement.appendChild(orderItemElement);

            // Add event listener to remove button
            const removeButton = orderItemElement.querySelector(".remove-button");
            removeButton.addEventListener("click", () => {
                removeFromCart(productId);
            });
        }
    }

    orderTotalElement.textContent = totalPrice.toFixed(2);
}

function removeFromCart(productId) {
    if (cart[productId]) {
        if (cart[productId].quantity > 1) {
            cart[productId].quantity--;
        } else {
            delete cart[productId];
        }
        updateCartDisplay(); // แก้ไข: ให้เรียก updateCartDisplay เมื่อมีการลบสินค้า
    }
}

document.getElementById("checkout-button").addEventListener("click", function () {
    updateCartDisplay();

    var customerName = document.getElementById("customer-name").value;
    var customerPhone = document.getElementById("customer-phone").value;
    var orderDate = document.getElementById("order-date").value;

    if (customerName && customerPhone && orderDate) {
        // คำนวณ totalQuantity และ totalPrice จาก cart โดยใช้ข้อมูลจากฟังก์ชัน calculateTotalPriceAndQuantity
        var { totalQuantity, totalPrice } = calculateTotalPriceAndQuantity();

        var invoiceContent = `
            <h2>FOOD BILL</h2>
            <p><strong>Restaurant Name:</strong> SE FOOD</p>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Customer Phone:</strong> ${customerPhone}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <h3>Order Items:</h3>
            <ul>
        `;

        // แสดงรายการสินค้าและจำนวนที่ถูกสร้างขึ้นใน updateCartDisplay
        for (const productId in cart) {
            const item = cart[productId];
            if (!isNaN(item.price)) {
                invoiceContent += `<li>${item.name} - Quantity: ${item.quantity} x $${item.price.toFixed(2)}</li>`;
            }
        }

        invoiceContent += `</ul><p><strong>Total Quantity:</strong> ${totalQuantity}</p>`;
        invoiceContent += `<p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>`;

        var printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    } else {
        alert("Please fill in all customer details!");
    }
});





