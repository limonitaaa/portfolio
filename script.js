
// ==========================================
// 1. ANIMACIONES DE APARICIÓN
// ==========================================

const secciones = document.querySelectorAll(".seccion");

secciones.forEach((seccion) => {
    seccion.classList.add("animar-aparicion");
});

if ("IntersectionObserver" in window) {

    const observadorSecciones = new IntersectionObserver(
        (entradas, observador) => {

            entradas.forEach((entrada) => {

                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observador.unobserve(entrada.target);
                }

            });

        },
        { threshold: 0.08 }
    );

    secciones.forEach((seccion) => {
        observadorSecciones.observe(seccion);
    });

} else {

    secciones.forEach((seccion) => {
        seccion.classList.add("visible");
    });

}


// ==========================================
// 2. NAVEGACIÓN DEL MENÚ
// ==========================================

const botonesMenu = document.querySelectorAll(".menu a");
const seccionesConId = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {

    const observadorMenu = new IntersectionObserver(
        (entradas) => {

            entradas.forEach((entrada) => {

                if (!entrada.isIntersecting) return;

                const idSeccion = entrada.target.id;

                botonesMenu.forEach((boton) => {

                    boton.classList.toggle(
                        "activo",
                        boton.getAttribute("href") === `#${idSeccion}`
                    );

                });

            });

        },
        {
            rootMargin: "-30% 0px -55% 0px",
            threshold: 0
        }
    );

    seccionesConId.forEach((seccion) => {
        observadorMenu.observe(seccion);
    });

}


// ==========================================
// 3. BOTÓN FLOTANTE VOLVER ARRIBA
// ==========================================

const botonVolver = document.querySelector(".volver-arriba");

function actualizarBotonVolver() {

    if (!botonVolver) return;

    if (window.scrollY > 300) {
        botonVolver.classList.add("visible");
    } else {
        botonVolver.classList.remove("visible");
    }

}

window.addEventListener("scroll", actualizarBotonVolver);
actualizarBotonVolver();


// ==========================================
// 4. VOLVER AL INICIO
// ==========================================

const enlacesInicio = document.querySelectorAll(
    ".zona-volver, .volver-arriba"
);

enlacesInicio.forEach((enlace) => {

    enlace.addEventListener("click", (evento) => {

        evento.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        history.replaceState(null, "", "#inicio");

    });

});


// ==========================================
// 5. TARJETAS GIRATORIAS DE SERVICIOS
// ==========================================

const tarjetasServicio = document.querySelectorAll(".tarjeta-servicio");

tarjetasServicio.forEach((tarjeta) => {

    function girarTarjeta() {
        tarjeta.classList.toggle("girada");
    }

    tarjeta.addEventListener("click", girarTarjeta);

    tarjeta.addEventListener("keydown", (evento) => {

        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            girarTarjeta();
        }

    });

});


// ==========================================
// 6. CARRUSEL DE PROYECTOS
// ==========================================

const carrusel = document.querySelector(".carousel-bienvenida");

if (carrusel) {

    const track = carrusel.querySelector(".carousel-track");
    const slidesOriginales = Array.from(
        track.querySelectorAll(".carousel-slide")
    );

    const botonAnterior = carrusel.querySelector(".anterior");
    const botonSiguiente = carrusel.querySelector(".siguiente");

    let indiceActual = 0;
    let cantidadVisibles = 3;
    let intervaloCarrusel;
    let anchoSlide = 0;
    let reiniciando = false;

    // Clonar los primeros tres proyectos para
    // conseguir un desplazamiento continuo.

    slidesOriginales.slice(0, 3).forEach((slide) => {
        const clon = slide.cloneNode(true);
        clon.setAttribute("aria-hidden", "true");
        track.appendChild(clon);
    });


    // Calcular cuántos proyectos se ven según
    // el ancho disponible.

    function calcularCarrusel() {

        if (window.innerWidth <= 600) {
            cantidadVisibles = 1;
        } else {
            cantidadVisibles = 3;
        }

        anchoSlide = track.querySelector(".carousel-slide").offsetWidth;

        mostrarSlide(indiceActual, false);

    }


    // Mostrar un proyecto determinado.

    function mostrarSlide(indice, animar = true) {

        indiceActual = indice;

        track.style.transition = animar ? "transform 0.55s ease" : "none";

        track.style.transform =
            `translateX(-${indiceActual * anchoSlide}px)`;

    }


    // Avanzar automáticamente.

    function avanzarCarrusel() {

        if (reiniciando) return;

        indiceActual++;
        mostrarSlide(indiceActual);

    }


    // Si llegamos a los proyectos clonados,
    // volver al comienzo sin que se note el salto.

    track.addEventListener("transitionend", () => {

        if (indiceActual >= slidesOriginales.length) {

            reiniciando = true;

            mostrarSlide(0, false);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    reiniciando = false;
                });
            });

        }

    });


    function iniciarCarrusel() {

        clearInterval(intervaloCarrusel);

        intervaloCarrusel = setInterval(avanzarCarrusel, 3500);

    }


    function detenerCarrusel() {
        clearInterval(intervaloCarrusel);
    }


    // Flecha anterior.

    botonAnterior.addEventListener("click", () => {

        detenerCarrusel();

        if (indiceActual <= 0) {
            indiceActual = slidesOriginales.length;
            mostrarSlide(indiceActual, false);
        }

        indiceActual--;
        mostrarSlide(indiceActual);

        iniciarCarrusel();

    });


    // Flecha siguiente.

    botonSiguiente.addEventListener("click", () => {

        detenerCarrusel();

        avanzarCarrusel();

        iniciarCarrusel();

    });


    // Pausar mientras el usuario tiene el cursor
    // sobre el carrusel.

    carrusel.addEventListener("mouseenter", detenerCarrusel);
    carrusel.addEventListener("mouseleave", iniciarCarrusel);

    carrusel.addEventListener("focusin", detenerCarrusel);
    carrusel.addEventListener("focusout", iniciarCarrusel);


    // Recalcular cuando cambia el tamaño de pantalla.

    window.addEventListener("resize", calcularCarrusel);

    calcularCarrusel();
    iniciarCarrusel();

}


// ==========================================
// 7. DETECTAR FOTOS HORIZONTALES Y VERTICALES
// ==========================================

const fotosGaleria = document.querySelectorAll(".foto img");

fotosGaleria.forEach((imagen) => {

    function clasificarFoto() {

        const marco = imagen.closest(".foto");

        if (!marco || !imagen.naturalWidth || !imagen.naturalHeight) {
            return;
        }

        if (imagen.naturalWidth > imagen.naturalHeight) {
            marco.classList.add("horizontal");
            marco.classList.remove("vertical");
        } else {
            marco.classList.add("vertical");
            marco.classList.remove("horizontal");
        }

    }

    if (imagen.complete) {
        clasificarFoto();
    } else {
        imagen.addEventListener("load", clasificarFoto);
    }

});


// ==========================================
// 8. ABRIR Y CERRAR EL CORTOMETRAJE
// ==========================================

const modalVideo = document.getElementById("modal-video");
const botonAbrirVideo = document.querySelector(".abrir-video");
const botonCerrarVideo = document.querySelector(".cerrar-video");
const reproductorVideo = document.getElementById("reproductor-video");


function abrirVideo() {

    if (!modalVideo || !reproductorVideo) return;

    modalVideo.classList.add("abierto");
    modalVideo.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    reproductorVideo.currentTime = 0;

    reproductorVideo.play().catch(() => {
        // El usuario puede iniciar la reproducción
        // manualmente desde los controles del video.
    });

}


function cerrarVideo() {

    if (!modalVideo || !reproductorVideo) return;

    modalVideo.classList.remove("abierto");
    modalVideo.setAttribute("aria-hidden", "true");

    reproductorVideo.pause();
    reproductorVideo.currentTime = 0;

    document.body.style.overflow = "";

}


if (botonAbrirVideo) {
    botonAbrirVideo.addEventListener("click", abrirVideo);
}

if (botonCerrarVideo) {
    botonCerrarVideo.addEventListener("click", cerrarVideo);
}


// Cerrar al hacer clic fuera del reproductor.

if (modalVideo) {

    modalVideo.addEventListener("click", (evento) => {

        if (evento.target === modalVideo) {
            cerrarVideo();
        }

    });

}


// Cerrar con Escape.

document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape" && modalVideo?.classList.contains("abierto")) {
        cerrarVideo();
    }

});


// ==========================================
// 9. FORMULARIO DE CONTACTO
// ==========================================

const formulario = document.getElementById("formulario-contacto");
const estadoFormulario = document.getElementById("estado-formulario");

if (formulario && estadoFormulario) {

    formulario.addEventListener("submit", (evento) => {

        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const asunto = document.getElementById("asunto").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        if (!nombre || !email || !asunto || !mensaje) {

            estadoFormulario.textContent =
                "Completá todos los campos.";

            return;

        }

        // Reemplazá esta dirección por tu correo real.

        const destinatario = "tuemail@gmail.com";

        const cuerpo =
            `Nombre: ${nombre}\n` +
            `Correo: ${email}\n\n` +
            `Mensaje:\n${mensaje}`;

        const enlaceCorreo =
            `mailto:${destinatario}` +
            `?subject=${encodeURIComponent(asunto)}` +
            `&body=${encodeURIComponent(cuerpo)}`;

        estadoFormulario.textContent =
            "Se abrirá tu aplicación de correo para enviar el mensaje.";

        window.location.href = enlaceCorreo;

    });

}


// ==========================================
// 10. ANIMACIÓN INICIAL DE LA PORTADA
// ==========================================

const portada = document.querySelector(".portada");

if (
    portada &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {

    portada.animate(
        [
            {
                opacity: 0,
                transform: "translateY(-15px)"
            },
            {
                opacity: 1,
                transform: "translateY(0)"
            }
        ],
        {
            duration: 1000,
            easing: "ease-out"
        }
    );

}
