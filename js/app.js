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

	function limpiarLS(){
		if(localStorage.length > 0){
			var cantidadLS = localStorage.length;
			for(var ls = cantidadLS; ls > 0; ls--){
				localStorage.removeItem(ls);
			};
			console.log("ya limpie el LS");
		}
		console.log(localStorage);
	};
//Inicio del código jQuery
$(document).ready(function(){
/*
Declaramos el JSON Estudiantes para nuestra tabla
*/
var estudiantes = [];
		notificaciones = $("#mensajeProceso");
		nuevo = 0;
		camposVacios = 0;

/**
 vamor a revisar si en el local estorage hay alguna
 información de los estudiantes y si la hay pues la
 listamos para que quede visible para el usuario
**/
function verificarLocalStorage(){
	if(localStorage.length > 0){
		console.log("hay información para monstrar");
	}else{
		console.log("no hay datos");
	}
};
verificarLocalStorage();

/**
Vamos a declarar el siguiente proceso
1. Verificar que la info que se ingresa ya no este en otro estudiante
2. Si el estudiante ya existe, pedir confirmación para cambiar las notas
3. Si el estudiante no esta, ingresarlo en el JSON
4. Imprimir en la tabla los estudiantes ingresados en el JSON

Formato para ingresar los datos al JSON:
{"codigo":10, "nombre":"Esmeralda", "nota1":4.5, "nota2":3.9, "promedio":0}
**/
$(document).keyup(function(et){
	//document.addEventListener("keyup", lectorTeclas);
	var teclas = et.key;
	if(teclas=="Enter"){
		manejoDatos();
	}
});


$("#ingresarDatos").click(manejoDatos);
//document.getElementById("ingresarDatos").addEventListener("click", manejoDatos);
function manejoDatos(){
	var elCodigo = $("#codigoEst").val();
		  elNombre = $("#nombreEst").val();
	elNombre = elNombre.charAt(0).toUpperCase() + elNombre.slice(1).toLowerCase();
		  laNota1 = $("#nota1Est").val();
			laNota2 = $("#nota2Est").val();
			conIgual = 0; //esta variable nos ayuda a controlar el flujo por el for que evalua si el dato ya existe
			formulario = $("#formDatos");
			losInputs = $("formulario:input");
			//vamor a crear un arreglo donde podamos guardar la info del estudiante a guardar en el LocalStorage
			elEstudiante = {
				elCodigo:elCodigo,
				elNombre:elNombre,
				laNota1:laNota1,
				laNota2:laNota2
			}

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
			localStorage.setItem(elCodigo, JSON.stringify(elEstudiante));
		}else{
			for(var exp=0; exp < estudiantes.length; exp++){
				if(estudiantes[exp].codigo == elCodigo){
					if(estudiantes[exp].nombre == elNombre){
						if(confirm("¿desea modificar las notas del estudiante?")){
							estudiantes[exp].nota1 = Number(laNota1);
							estudiantes[exp].nota2 = Number(laNota2);
							nuevo = 0;
							limpiarInputs();
							//modificamos los datos del localStorage
							localStorage.key(elCodigo).localStorage.setItem("laNota1","laNota1");
							localStorage.key(elCodigo).localStorage.setItem("laNota2","laNota2");
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
				localStorage.setItem(elCodigo, JSON.stringify(elEstudiante));
			}
		}
		promedioIndividual();
	}
	mostrar_Lista(estudiantes);
	$("#codigoEst").focus();
}


	//Codigo para mostrar los mensajes del estado del proceso.
	function elMensaje(elmensaje){
		setTimeout(function(){
			mostrarMensaje(elmensaje);
		},0);
		setTimeout(ocultarMensaje, 5000);
	}

	function mostrarMensaje(elmensaje){
		notificaciones.css("display","block");
		notificaciones.css("animation" , "entradacaja 1s linear");
		notificaciones.html(elmensaje);
	}

	function ocultarMensaje(){
		notificaciones.html("");
		notificaciones.css("display","none");
	}

	//Limpiar inputs luego del proceso
	function limpiarInputs(){
		$("#codigoEst").val("");
		$("#nombreEst").val("");
		$("#nota1Est").val("");
		$("#nota2Est").val("");
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
			$("#content_mlest").html(imprLista);
		}
	}

//Declaramos la función para mostrar el promedio de las personas
$("#btnCalcularP").on("click", activarPromedio);
	function activarPromedio(){
		mostrar_promedio(estudiantes);
	}
	function mostrar_promedio(json) {
		console.log(json.length);
		if(json.length > 1){
			var e;
				suma = 0;

			$.each(json, function(e, value){
				suma += json[e].nota1 + json[e].nota2;
			})
			/*
			for (e = 0; e < json.length; e++) {
				suma += json[e].nota1 + json[e].nota2;
			}
			*/
			promedio = suma/(json.length*2);
			alert("El promedio de nota entre los estudiantes es de: " + promedio.toFixed(2));
		}else{
			alert("No hay estudiantes suficientes aun para sacar un promedio")
		}
	}

//Declaramos la función para hallar al mejor estudiante y felicitarlo
$("#elMejorE").click(elmejor);
 function elmejor(){
	console.log(estudiantes);
		if(estudiantes.length > 1){
			mejornota = 0;
			index = 0;

			for (var c = 0; c < estudiantes.length; c++) {
				if (mejornota < estudiantes[c].promedio) {
					mejornota = estudiantes[c].promedio;

					index=c;

				}
				$("#nombre_mejor").html(estudiantes[index].nombre+" que logro una nota promedio de "+mejornota);
				$("#nohayDatos").html("");
				$("#elmejorestudiante").css("display" , "block");
				$("#masesfuerzo").css("display" , "none");

			}
		}else {
			$("#nohayDatos").html("No hay estudiantes suficientes aun");
		}
	};

//Declaramos la función para hallar al que necesita de más esfuerzo.
$("#necesitaMasE").click(masesfuerzo);
	function masesfuerzo() {
		if(estudiantes.length > 1){
			peornota = estudiantes[0].promedio;
			elpeorest = 0;

			for (var b = 0; b < estudiantes.length; b++) {
				if (peornota > estudiantes[b].promedio) {
					peornota = estudiantes[b].promedio;

					elpeorest=b;

				}
				$("#nombre_malo").html(estudiantes[elpeorest].nombre);
				$("#nohayDatos").html("");
				$("#elmejorestudiante").css("display" , "none");
				$("#masesfuerzo").css("display" , "block");

			}
		}else{
			$("#nohayDatos").html("No hay estudiantes suficientes aun");
		}
	}

//Declaramos la función para ver quienes van ganando la certificación.
$("#vanGanando").click(lavanGanando);
	function lavanGanando() {
		if(estudiantes.length > 0){
			var g;
				vanganando = "";
			$("#nohayDatosGP").html("");

			for (g = 0; g < estudiantes.length; g++) {
				if (estudiantes[g].promedio >= 3.5) {
					vanganando += "<li>"+estudiantes[g].nombre+"</li>";
					$("#losganadores").html(vanganando);
				} else {
					if(vanganando==""){
						$("#losganadores").html("Nadie va ganando"+"<br>"+"¡ojo!");
					}else{
						$("#losganadores").html(vanganando);
					}

				}

			}
		}else{
			$("#nohayDatosGP").html("No hay estudiantes aun");
		}
	}

//Declaramos la función para mostrar los que van perdiendo la certificación
$("#vanPerdiendo").click(lavanPerdiendo);
	function lavanPerdiendo() {
		if(estudiantes.length > 0){
			var p;
				vanperdiendo = "";
			$("#nohayDatosGP").html("");

			for (p = 0; p < estudiantes.length; p++) {
				if (estudiantes[p].promedio <= 3.4) {
					vanperdiendo += "<li>"+estudiantes[p].nombre+"</li>";
					$("#losperdedores").html(vanperdiendo);
				}
			}
		}else{
			$("#nohayDatosGP").html("No hay estudiantes aun");
		}
	}

//Fin del jQuery
});
