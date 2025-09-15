// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seletores do carrinho
    const productList = document.getElementById('product-list');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');

    let cart = []; // Array para armazenar os itens do carrinho

    // Função para renderizar o carrinho na página
    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Limpa o conteúdo atual
        let total = 0;

        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // --- Atividade 1: Eventos Básicos de Clique ---
    // Evento de clique para os botões dentro da lista de produtos (Delegação de Eventos)
    productList.addEventListener('click', (event) => {
        const target = event.target;

        // Botão "Adicionar ao Carrinho"
        if (target.classList.contains('btn-add-to-cart')) {
            const productCard = target.closest('.product-card');
            const productName = productCard.querySelector('h2').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('R$', '').replace(',', '.'));
            const productQuantity = parseInt(productCard.querySelector('.quantity-display').textContent);

            // Adiciona o produto ao array do carrinho
            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += productQuantity;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    quantity: productQuantity
                });
            }

            renderCart(); // Renderiza o carrinho atualizado
            alert(`"${productName}" adicionado ao carrinho!`);
        }

        // Botão "Ver Detalhes"
        if (target.classList.contains('btn-view-details')) {
            const productCard = target.closest('.product-card');
            const detailsSection = productCard.querySelector('.details-section');
            detailsSection.classList.toggle('hidden');
            target.textContent = detailsSection.classList.contains('hidden') ? 'Ver Detalhes' : 'Ocultar Detalhes';
        }

        // Botão de quantidade "+"
        if (target.classList.contains('plus-btn')) {
            const quantityDisplay = target.parentNode.querySelector('.quantity-display');
            let currentQuantity = parseInt(quantityDisplay.textContent);
            quantityDisplay.textContent = currentQuantity + 1;
        }
        
        // Botão de quantidade "-"
        if (target.classList.contains('minus-btn')) {
            const quantityDisplay = target.parentNode.querySelector('.quantity-display');
            let currentQuantity = parseInt(quantityDisplay.textContent);
            if (currentQuantity > 1) {
                quantityDisplay.textContent = currentQuantity - 1;
            }
        }
    });

    // Botão "Limpar Carrinho" com confirmação
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            cart = []; // Esvazia o array do carrinho
            renderCart(); // Renderiza o carrinho vazio
            alert('Carrinho limpo!');
        }
    });

    // --- Atividade 2: Eventos de Mouse e Interação Visual ---
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const imageElement = card.querySelector('img');
        const originalImage = imageElement.src;
        // Imagem para o hover. Mantenha esta URL ou aponte para uma imagem local.
        const hoverImage = 'https://via.placeholder.com/300x200/FF5733?text=Hover';

        // Evento mouseover para mudar a imagem e o estilo
        card.addEventListener('mouseover', () => {
            imageElement.src = hoverImage;
            card.style.backgroundColor = '#e0f7fa';
            card.classList.add('highlight');
        });
        
        // Evento mouseout para restaurar a imagem e o estilo
        card.addEventListener('mouseout', () => {
            imageElement.src = originalImage;
            card.style.backgroundColor = '#fff';
            card.classList.remove('highlight');
        });
    });
    
    // --- Atividade 3: Eventos de Formulário e Validação ---
    const checkoutForm = document.getElementById('checkoutForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.querySelector('.email-error');
    const passwordStrengthMessage = document.querySelector('.password-strength-message');

    // Validação de email em tempo real
    emailInput.addEventListener('change', validateEmail);
    emailInput.addEventListener('keyup', validateEmail);
    
    function validateEmail() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Por favor, insira um email válido.';
        } else {
            emailError.textContent = '';
        }
    }

    // Validação de senha em tempo real
    passwordInput.addEventListener('keyup', () => {
        const password = passwordInput.value;
        let strength = 'Fraca';
        let color = 'red';

        if (password.length >= 8) {
            strength = 'Média';
            color = 'orange';
            if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()]/.test(password)) {
                strength = 'Forte';
                color = 'green';
            }
        }
        passwordStrengthMessage.textContent = `Força da senha: ${strength}`;
        passwordStrengthMessage.style.color = color;
    });

    // Prevenção de envio do formulário se inválido
    checkoutForm.addEventListener('submit', (event) => {
        validateEmail();
        if (emailError.textContent !== '') {
            event.preventDefault();
            alert('Por favor, corrija os erros do formulário.');
        } else {
            alert('Formulário enviado com sucesso!');
        }
    });

    // Contador de caracteres
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('charCounter');
    
    messageInput.addEventListener('keyup', updateCharCounter);
    messageInput.addEventListener('change', updateCharCounter);

    function updateCharCounter() {
        const maxLength = 100;
        const currentLength = messageInput.value.length;
        charCounter.textContent = `${currentLength}/${maxLength}`;
        if (currentLength > maxLength) {
            charCounter.style.color = 'red';
        } else {
            charCounter.style.color = '#999';
        }
    }

    // --- Atividade 4: Eventos de Teclado e Interação Avançada ---
    const searchInput = document.getElementById('searchInput');

    // Filtro de produtos conforme o usuário digita
    searchInput.addEventListener('keyup', () => {
        const filter = searchInput.value.toLowerCase();
        productCards.forEach(card => {
            const productName = card.querySelector('h2').textContent.toLowerCase();
            if (productName.includes(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Atalho de teclado para adicionar ao carrinho (Ctrl + Enter)
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            const firstProductAddBtn = document.querySelector('.btn-add-to-cart');
            if (firstProductAddBtn) {
                firstProductAddBtn.click();
            }
        }
    });
    
    // Navegação por produtos com as setas do teclado
    let selectedIndex = 0;
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            selectedIndex = (selectedIndex + 1) % productCards.length;
            highlightProduct(selectedIndex);
        } else if (event.key === 'ArrowLeft') {
            selectedIndex = (selectedIndex - 1 + productCards.length) % productCards.length;
            highlightProduct(selectedIndex);
        }
    });

    function highlightProduct(index) {
        productCards.forEach(card => card.classList.remove('highlight'));
        productCards[index].classList.add('highlight');
        productCards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }


});