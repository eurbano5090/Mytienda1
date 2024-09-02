$(() => { //Función ready se ejecuta cuando el HTML es cargado completamente
  
    const carrito = []
    const itemsPorPagina = 4;
    let paginaActual = 1;

    const listarPrendas = (prendas,pagina) => {
        $("#listado-prendas").html("");
        const inicio = (pagina - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const prendasPagina = prendas.slice(inicio, fin);
        for (const item of prendasPagina) {
            $("#listado-prendas").append(`
                <div>
                    <div class="card  mb-5" data-id="${item.id}">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="assets/img/${item.imagen}" class="img-fluid rounded-start" alt="${item.nombre}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${item.nombre}</h5>
                                    <div>
                                        <span class="fw-bold">Precio: </span>
                                        <span> $${item.precio}</span>
                                    </div>
                                    <div class="mt-4 d-flex">
                                        <input class="form-control w-50"  type="number" class="precio" value="0" readonly>
                                        <button class="btn btn-outline-secondary cantidades aumenta btn-s">+</button>
                                        <button class="btn btn-outline-secondary cantidades disminuye">-</button>
                                        <button class="btn btn-primary btn-agregar" data-id="${item.id}"><i class="fa-solid fa-cart-shopping"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        } asignarEventos();
    }
 //   listarPrendas(prendas)

    const generarPaginacion = (totalItems, itemsPorPagina) => {
        $("#paginacion").html(""); // Limpiar antes
        const totalPaginas = Math.ceil(totalItems / itemsPorPagina);
      
        for (let i = 1; i <= totalPaginas; i++) {
          $("#paginacion").append(`
            <button class="btn btn-info btn-pagina" data-pagina="${i}">${i}</button>
          `);
        }
        $(".btn-pagina").click(function () {
            paginaActual = $(this).data("pagina");
            listarPrendas(prendas, paginaActual);  // Mostrar prendas de la página seleccionada
        });
    }

/*    listarPrendas(prendas, paginaActual);
      generarPaginacion(prendas.length, itemsPorPagina);*/

    const mostrarDescripcion = item=>{
        $(".div3").html("");
            $(".div3").append(`
                  <tr>
                    <td>
                        <h2>${item.nombre}</h2>
                        <img src="assets/img/${item.imagen}">
                        <div class="pt-2"><b>Descripción: </b>${item.descripcion}</div>
                        <div class="pt-2"><b>Colores: </b> ${item.colores}</div>
                        <div class="pt-2"><b>Tallas: </b> ${item.tallas}</div>
                        <div class="pt-2"><b>Precio: </b> ${item.precio}</div>
                    </td>
                    
                </tr>
                `)
        }

    const mostrarResumen = carrito => {
        $("#resumen table").html("");
        for (const item of carrito) {
            $("#resumen table").append(`
                <tr>
                    <td>
                        <div class="py-0">${item.nombre}</div><img src="assets/img/${item.imagen}" width="60">
                        <div class="py-0"><b>Cantidad:</b> ${item.cantidad}</div>
                        <div class="py-0"><b>Precio:</b> ${item.precio}</div>
                    </td>
                    
                </tr>
            `)
        }
        $("#paso").removeClass("d-none")
    }

    const calcularTotal = carrito => {
        let total = 0
        for (const item of carrito) {
            total += item.precio * item.cantidad
        }
        return total
    }

     const finalizarCompra = () => {
        const total = calcularTotal(carrito);
        alert(`Gracias por su compra. Total pagado: $${total}`);
        $("#resumen table").html("");
        $("#monto-total").html("")
        $("#paso").addClass("d-none")
      
    };

    const asignarEventos = () => {

    $(".aumenta").click(function() {
        let valor = $(this).siblings("input").val()
        valor++;
        $(this).siblings("input").val(valor)
    });

    $(".disminuye").click(function() {
        let valor = $(this).siblings("input").val()
        if(Number(valor) !== 0) {
            valor--;
            $(this).siblings("input").val(valor)
        }
    });

    $(".btn-agregar").click(function() { 
        const idPrenda = $(this).attr("data-id")
        let cantidad = Number($(this).siblings("input").val())
        const itemCarrito = carrito.find(item => item.id == idPrenda) //Busca si la prenda ya existe en el carrito
        
        if(!itemCarrito) { // Caso donde la prenda NO está en el carrito.
            const prenda = prendas.find(item => item.id == idPrenda)
            carrito.push({
                ...prenda,
                cantidad: cantidad
            })
        } else { // Caso donde la prenda SI está en el carrito.
            itemCarrito.cantidad += cantidad
        }
        $(this).siblings("input").val(0)
        mostrarResumen(carrito)

        const total = calcularTotal(carrito)
        $("#monto-total").html(total)
    });

 

    $("#listado-prendas .card").click(function(){
        const idPrenda = $(this).attr("data-id")
        const prenda= prendas.find(item=>item.id==idPrenda)
       mostrarDescripcion(prenda)
    });
   
    $("#finalizar-compra").off('click').click(function() {
       finalizarCompra();
    });
};
    listarPrendas(prendas, paginaActual);
    generarPaginacion(prendas.length, itemsPorPagina);
})