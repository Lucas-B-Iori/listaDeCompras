let listaDeItens = localStorage.getItem('listaDeItens') ? JSON.parse(localStorage.getItem('listaDeItens')) : [];
let itemAEditar;

const form = document.getElementById("form-itens");
const itensInput = document.getElementById("receber-item");
const listaDeCompras = document.getElementById("lista-de-itens");
const listaComprados = document.getElementById("itens-comprados");

function atualizaLocalStorage() {
	localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens));
}

mostrarItem(); // para inicializar a lista de itens caso ja tenha valores no localStorage

form.addEventListener("submit", (e) => {
  e.preventDefault();
  salvarItem();
  mostrarItem();
	itensInput.focus();
	
});

function salvarItem() {
  const comprasItem = itensInput.value;
  const checarDuplicata = listaDeItens.some(
    (item) => item.valor.toUpperCase() === comprasItem.toUpperCase()
  ); //metodo some verifica se pelo menos um elemento retorna true

  if (!checarDuplicata) {
    listaDeItens.push({
      valor: comprasItem,
      checar: false,
    });
  } else {
    alert("Item já listado");
  }

	itensInput.value = '';
}

function mostrarItem() {
  listaDeCompras.innerHTML = "";
	listaComprados.innerHTML = '';
  listaDeItens.forEach((item, indice) => {
		if(item.checar) {
			listaComprados.innerHTML += `
					<li class="item-compra is-flex is-justify-content-space-between" data-value="${indice}">
						<div>
								<input type="checkbox" checked class="is-clickable" />  
								<span class="itens-comprados is-size-5">${item.valor}</span>
						</div>
						<div>
								<i class="fa-solid fa-trash is-clickable deletar"></i>
						</div>
					</li>
			`
		} else {
			listaDeCompras.innerHTML += `
					<li class="item-compra is-flex is-justify-content-space-between" data-value="${indice}">
						<div>
								<input type="checkbox" class="is-clickable" />
								<input type="text" class="is-size-5" value="${item.valor}" ${indice !== +itemAEditar ? 'disabled' : ''}></input>
						</div>
						<div>
								${indice === +itemAEditar ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>'
								 : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
								<i class="fa-solid fa-trash is-clickable deletar"></i>
						</div>
					</li>
					`;
		}
  });

  const inputsCheck = document.querySelectorAll('input[type="checkbox"]');
  inputsCheck.forEach((input) => {
    input.addEventListener("click", (evento) => {
			const valorDoElemento = evento.target.parentElement.parentElement.getAttribute("data-value");
      listaDeItens[valorDoElemento].checar = evento.target.checked;
			mostrarItem();
    });
  });

	const deletarObj = document.querySelectorAll('.deletar');
	deletarObj.forEach(botaoDeleta => {
		botaoDeleta.addEventListener('click', evento => {
			const valorDoElemento = evento.target.parentElement.parentElement.getAttribute("data-value");
			listaDeItens.splice(valorDoElemento, 1);
			mostrarItem()
		})
	})

	const editarItens = document.querySelectorAll('.editar');
	editarItens.forEach(editor => {
		editor.addEventListener('click', evento => {
			itemAEditar = evento.target.parentElement.parentElement.getAttribute("data-value");
			mostrarItem();
		})
	})

	atualizaLocalStorage();
}

function salvarEdicao() {
	const itemEditado = document.querySelector( `[data-value="${itemAEditar}"] input[type="text"]`);
	listaDeItens[itemAEditar].valor = itemEditado.value;
	itemAEditar = -1;
	mostrarItem();
}
