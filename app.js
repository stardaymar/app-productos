
let productosExistentes = [];
class Product {
    constructor(name, price, year) {
        this.name = name;
        this.price = price;
        this.year = year;
    }
}

class UI {
    addProduct(product, isFirstRender) {
        const productList = document.getElementById('product-list');
        const element = document.createElement('div');
        //Agregar un ID al producto para identificar
        product.id = Date.now()
        element.innerHTML = `
          <div class= "card text-center mb-4">
              <div class="card-body" id="${product.id}">
                  <strong>Product Name</strong>: ${product.name}
                  <strong>Product Price</strong>: ${product.price}
                  <strong>Product Year</strong>: ${product.year}
                  <a href="#" class="btn btn-info" name="delete">Eliminar</a>

              </div>
        
          </div>
        `;
        productList.appendChild(element);

        //Se agrega para evitar guardar en LS cuando es la primera vez que se carguen los datos
        if(!isFirstRender){
            this.saveInLocalStorage(product)
        }
    }
    
    resetForm(){
        document.getElementById('product-form').reset();
    }

    saveInLocalStorage(product){


      productosExistentes.push(product);

      //Guardar en LS

      localStorage.setItem("productos-ls", JSON.stringify(productosExistentes))
    }

    getFromLocalStorage(){
        //Obteniendo los datos del LS
       return  localStorage.getItem("productos-ls") || []
    }

    deleteProduct(element) {
        if(element.name === 'delete'){
            element.parentElement.parentElement.parentElement.remove();
            
            this.showMessage('Producto eliminado satisfactoriamente', 'info');
            //Accedamos al id del elmento a eliminar
            let idAEliminar = element.parentElement.getAttribute('id');
            idAEliminar = parseInt(idAEliminar);
           const productosRestante =  productosExistentes.filter(producto=>producto.id!==idAEliminar);
           localStorage.setItem("productos-ls", JSON.stringify(productosRestante))

        }

    }
    showMessage(message, cssClass) {
        const div = document.createElement('div');
        div.className = `alert alert-${cssClass}  mt-4`;
        div.appendChild(document.createTextNode(message));
        //Mostrando en el DOM
        const container = document.querySelector('.container');
        const app = document.querySelector('#App');
        container.insertBefore(div, app);
        setTimeout(function(){
            document.querySelector('.alert').remove();
        },3000);




    }
}

//DOM Events
document.getElementById('product-form')
 .addEventListener('submit', function (e) {
    e.preventDefault()
      const name = document.getElementById('name').value;
      const price = document.getElementById('price').value;
      const year = document.getElementById('year').value;



      const product = new Product(name, price, year);

      const ui = new UI();

      if(name === '' || price === '' || year === ''){
          return ui.showMessage('Completa todos los datos, por favor!', 'danger');
      }

       ui.addProduct(product, false);
       ui.resetForm();
       ui.showMessage('Producto agregado satisfactoriamente', 'success');

});

document.getElementById('product-list').addEventListener('click', function(e){
    const ui= new UI();
    ui.deleteProduct(e.target);
})

window.addEventListener("load", ()=>{
    const ui = new UI();
    const result = ui.getFromLocalStorage();
   const productosObtenidos = JSON.parse(result);
   productosExistentes = productosObtenidos;

   //Condicionar para que solo se llame si existen productos

   if(productosExistentes.length > 0){
    for (let index = 0; index < productosExistentes.length; index++) {
    ui.addProduct(productosExistentes[index], true)
    }
   }
 
})