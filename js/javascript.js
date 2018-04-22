// JavaScript Document
/*
Primero que todo declaramos las funciones y eventos de simple funcionamiento
del sitio web, como por ejemplo los clics para mostrar menu y el efecto de onload
*/

	//Declaración de la funcción onLoad para animar la entrada de la plataforma.
	function pageload() {
		document.getElementById("caja_sitio").style.display = "block";
		document.getElementById("caja_sitio").style.animation = "entradacaja 1.5s linear";
	}

/*
Declaramos el JSON Estudiantes para nuestra tabla
*/
var estudiantes = [];
var notificaciones = document.getElementById("mensajeProceso");
var nuevo = 0;
var camposVacios = 0;
/**
Vamos a declarar el siguiente proceso
1. Verificar que la info que se ingresa ya no este en otro estudiante
2. Si el estudiante ya existe, pedir confirmación para cambiar las notas
3. Si el estudiante no esta, ingresarlo en el JSON
4. Imprimir en la tabla los estudiantes ingresados en el JSON

Formato para ingresar los datos al JSON:
{"codigo":10, "nombre":"Esmeralda", "nota1":4.5, "nota2":3.9, "promedio":0}
**/
document.addEventListener("keyup", lectorTeclas);
function lectorTeclas(et){
	var teclas = et.key;
	if(teclas=="Enter"){
		manejoDatos();
	}
}

document.getElementById("ingresarDatos").addEventListener("click", manejoDatos);
function manejoDatos(){
	var elCodigo = document.getElementById("codigoEst").value;
	var elNombre = document.getElementById("nombreEst").value;
	elNombre = elNombre.charAt(0).toUpperCase() + elNombre.slice(1).toLowerCase();
	var laNota1 = document.getElementById("nota1Est").value;
	var laNota2 = document.getElementById("nota2Est").value;
	var conIgual = 0; //esta variable nos ayuda a controlar el flujo por el for que evalua si el dato ya existe


	var formulario = document.getElementById("formDatos");
	var losInputs = formulario.getElementsByTagName("input");

	//vamos a recorrer los input para ver que la persona si haya llenado todos los datos
	//la variable para recorrer el array se llamara va, de VAcios
	for(var va=0; va < losInputs.length; va++){
		if(losInputs[va].value == ""){
			camposVacios = camposVacios + 1;
		}else{
			camposVacios = camposVacios + 0;
		}
	}

	if(camposVacios > 0){
		elMensaje("todos los datos deben ser llenados");
	}else{
		if(estudiantes.length == 0){
			estudiantes.push({"codigo":Number(elCodigo), "nombre":elNombre, "nota1":Number(laNota1), "nota2":Number(laNota2), "promedio":0});
			elMensaje("Estudiante ingresado exitosamente");
			limpiarInputs();
		}else{
			for(var exp=0; exp < estudiantes.length; exp++){
				if(estudiantes[exp].codigo == elCodigo){
					if(estudiantes[exp].nombre == elNombre){
						if(confirm("¿desea modificar las notas del estudiante?")){
							estudiantes[exp].nota1 = Number(laNota1);
							estudiantes[exp].nota2 = Number(laNota2);
							nuevo = 0;
							limpiarInputs();
						}else{
							nuevo = 0;
						}
					}else{
						elMensaje("Hay otro estudiante con ese mismo codigo, por favor revisar");
						nuevo = 0;
					}
					conIgual = 1;
				}else{
					if(conIgual==0){
						nuevo = 1;
					}
				}
			}
			if(nuevo==1){
				estudiantes.push({"codigo":Number(elCodigo), "nombre":elNombre, "nota1":Number(laNota1), "nota2":Number(laNota2), "promedio":0});
				elMensaje("Estudiante ingresado exitosamente");
				nuevo = 0;
				limpiarInputs();
			}
		}
		promedioIndividual();
	}
	mostrar_Lista(estudiantes);
	document.getElementById("codigoEst").focus();
}

	//Codigo para mostrar los mensajes del estado del proceso.
	function elMensaje(elmensaje){
		setTimeout(function(){
			mostrarMensaje(elmensaje);
		},0);
		setTimeout(ocultarMensaje, 5000);
	}
	function mostrarMensaje(elmensaje){
		notificaciones.style.display = "block";
		notificaciones.style.animation = "entradacaja 1s linear";
		notificaciones.innerHTML = elmensaje;
	}

	function ocultarMensaje(){
		notificaciones.innerHTML = "";
		notificaciones.style.display = "none";
	}

	//Limpiar inputs luego del proceso
	function limpiarInputs(){
		document.getElementById("codigoEst").value = "";
		document.getElementById("nombreEst").value = "";
		document.getElementById("nota1Est").value = "";
		document.getElementById("nota2Est").value = "";
	}


//Ahora vamos a calcular el promedio para cada estudiante
function promedioIndividual(){
	var j;
	for (j = 0; j < estudiantes.length; j++) {
		estudiantes[j].promedio = (estudiantes[j].nota1 + estudiantes[j].nota2)/2;
	}
}

//Declaramos la función para mostrar el JSON estudiantes
	function mostrar_Lista(json) {
		var i;
			imprLista = "";
		for (i = 0; i < json.length; i++) {
			imprLista += "<tr>"+"<td>"+json[i].codigo+"</td>"+"<td>"+json[i].nombre+"</td>"+"<td>"+json[i].nota1.toFixed(1)+"</td>"+"<td>"+json[i].nota2.toFixed(1)+"</td>"+"<td>"+json[i].promedio.toFixed(1)+"</td>"+"</tr>";
			document.getElementById("content_mlest").innerHTML = imprLista;
		}
	}

//Declaramos la función para mostrar el promedio de las personas
document.getElementById("btnCalcularP").addEventListener("click", activarPromedio);
	function activarPromedio(){
		mostrar_promedio(estudiantes);
	}
	function mostrar_promedio(json) {
		console.log(json.length);
		if(json.length > 1){
			var e;
				suma = 0;

			for (e = 0; e < json.length; e++) {
				suma += json[e].nota1 + json[e].nota2;
			}
			promedio = suma/(json.length*2);
			alert("El promedio de nota entre los estudiantes es de: " + promedio.toFixed(2));
		}else{
			alert("No hay estudiantes suficientes aun para sacar un promedio")
		}
	}

//Declaramos la función para hallar al mejor estudiante y felicitarlo
	function elmejor(json) {
		if(json.length > 1){
			mejornota = 0;
			index = 0;

			for (var c = 0; c < json.length; c++) {
				if (mejornota < json[c].promedio) {
					mejornota = json[c].promedio;

					index=c;

				}
				document.getElementById("nombre_mejor").innerHTML = json[index].nombre+" que logro una nota promedio de "+mejornota;
				document.getElementById("nohayDatos").innerHTML = "";
				document.getElementById("elmejorestudiante").style.display = "block";
				document.getElementById("masesfuerzo").style.display = "none";

			}
		}else {
			document.getElementById("nohayDatos").innerHTML = "No hay estudiantes suficientes aun";
		}
	}

//Declaramos la función para hallar al que necesita de más esfuerzo.
	function masesfuerzo(json) {
		if(json.length > 1){
			peornota = json[0].promedio;
			elpeorest = 0;

			for (var b = 0; b < json.length; b++) {
				if (peornota > json[b].promedio) {
					peornota = json[b].promedio;

					elpeorest=b;

				}
				document.getElementById("nombre_malo").innerHTML = json[elpeorest].nombre;
				document.getElementById("nohayDatos").innerHTML = "";
				document.getElementById("elmejorestudiante").style.display = "none";
				document.getElementById("masesfuerzo").style.display = "block";

			}
		}else{
			document.getElementById("nohayDatos").innerHTML = "No hay estudiantes suficientes aun";
		}
	}

//Declaramos la función para ver quienes van ganando la certificación.
	function lavanGanando(json) {
		if(json.length > 0){
			var g;
				vanganando = "";
			document.getElementById("nohayDatosGP").innerHTML = "";

			for (g = 0; g < json.length; g++) {
				if (json[g].promedio >= 3.5) {
					vanganando += "<li>"+json[g].nombre+"</li>";
					document.getElementById("losganadores").innerHTML = vanganando;
				} else {
					if(vanganando==""){
						document.getElementById("losganadores").innerHTML = "Nadie va ganando"+"<br>"+"¡ojo!";
					}else{
						document.getElementById("losganadores").innerHTML = vanganando;
					}

				}

			}
		}else{
			document.getElementById("nohayDatosGP").innerHTML = "No hay estudiantes aun";
		}
	}

//Declaramos la función para mostrar los que van perdiendo la certificación
	function lavanPerdiendo(json) {
		if(json.length > 0){
			var p;
				vanperdiendo = "";
			document.getElementById("nohayDatosGP").innerHTML = "";

			for (p = 0; p < json.length; p++) {
				if (json[p].promedio <= 3.4) {
					vanperdiendo += "<li>"+json[p].nombre+"</li>";
					document.getElementById("losperdedores").innerHTML = vanperdiendo;
				}
			}
		}else{
			document.getElementById("nohayDatosGP").innerHTML = "No hay estudiantes aun";
		}
	}
