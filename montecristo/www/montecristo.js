// Montecristo (c) 2013, 2020 Baltasar MIT License <baltasarq@gmail>

ctrl.ponTitulo( "La isla de Montecristo" );
ctrl.ponIntro( "Despu&eacute;s de huir del castillo de <b>If</b>, \
                    arribas a la <i>Isla \
                    de Montecristo</i>, para tratar de encontrar el tesoro del que \
                    el abate te confes&oacute; su existencia y paradero."
);
ctrl.ponImg( "res/islaMontecristo.jpg" );
ctrl.ponAutor( "baltasarq@gmail.com" );
ctrl.ponVersion( "2 202001" );


// === Playa ---------------------------------------------------------
var locPlaya = ctrl.lugares.creaLoc( "Costa de Montecristo",
                    [ "playa", "cala", "caleta" ],
                    "En la costa, el mar lame los ${guijarros, ex guijarros}. \
                    ${Escarpados peñascos,ex rocas} escalan las cimas con desniveles \
                    imposibles, y contin&uacute;an \
                    al ${este,este} en forma de ${cantiles, ex cantiles}. \
                    Puedes ver tambi&eacute;n el ${bote, ex bote} en el \
                    que llegaste."
);

locPlaya.modificaDesc = function() {
	locPlaya.desc += " Al ${sur,sur}, la entrada de la ${cueva, ex cueva} se \
                    encuentra excavada en la roca.";
}

locPlaya.pic = "res/playaGuijarros.jpg";

locPlaya.preEnter = function() {
	ctrl.goto( locAntesala );
	return "";
}

locPlaya.preSwim = function() {
	return "Acabas de llegar, para buscar el tesoro de Montecristo. \
		    No es el momento de nadar.";
}

const objGuijarros = ctrl.creaObj( "guijarros",
     [ "guijarro", "piedras", "piedra" ],
     "Pequeños guijarros se ven arrastrados por la fuerza del agua.",
     locPlaya, Ent.Escenario
);

const objMar = ctrl.creaObj( "mar",
     [ "agua" ],
     "El mar bate la costa con fuerza.",
     locPlaya, Ent.Escenario
);

const objCueva = ctrl.creaObj( "cueva",
     [ "gruta", "caverna" ],
     "Parece una invitación a adentrarse en la oscuridad.",
     locPlaya, Ent.Escenario
);

objCueva.preEnter = function() {
     ctrl.goto( locAntesala );
     return "Te has adentrado en la cueva...";
}

const objRocas = ctrl.creaObj( "roca",
     [ "rocas", "peñascos", "peñasco", "cantiles",
          "acantilados", "cantil", "acantilado", "cima", "cimas" ],
     "Las rocas alcanzan alturas imposibles.",
     locPlaya, Ent.Escenario
);

objRocas.ponAlcanzable( false );

const objBote = ctrl.creaObj( "bote",
     [ "barca", "esquife" ],
     "La embarcación en la que arribaste a Montecristo, varada en \
      la playa. En su interior hay multitud de objetos de distinto tipo, \
      especialmente material de marinería.",
     locPlaya, Ent.Escenario
);
objBote.ponContenedor();

const objBotella = ctrl.creaObj( "botella",
     [ "agua", "recipiente" ],
     "Una botella llena de agua.",
     ctrl.lugares.limbo, Ent.Portable
);

objBotella.preExamine = function() {
    var toret = this.desc;
    
    if ( ctrl.places.getCurrentLoc().has( pnjNaufrago ) ) {
        toret += " El náufrago la \
                   ${necesita más que tú, dar botella a naufrago}.";
    }
    
    return toret;
};

const objBotellaVacia = ctrl.creaObj( "botella",
     [ "recipiente" ],
     "Una botella vacía.",
     ctrl.lugares.limbo, Ent.Portable
);

objBotella.preDrop = function() {
     var dropAction = acciones.devAccion( "drop" );
     var toret = "";

     if ( parser.sentencia.obj2 == pnjNaufrago ) {
		ctrl.print( "Le das la botella al n&aacute;ufrago, quien la apura \
				 de un solo trago." );

          this.moveTo( ctrl.lugares.limbo );
          objBotellaVacia.moveTo( pnjNaufrago );
		pnjNaufrago.status = 2;

		pnjNaufrago.di( "Gracias... gracias, mi buen amigo." );
		ctrl.print( "Goterones de agua resbalan por sus lenguas barbas..." );

		pnjNaufrago.di( "Mi nombre es Valerio. Naufragué aquí hace un mes, \
					  y ya había perdido toda esperanza." );
		pnjNaufrago.desc = "Agarra la botella con las dos manos, y hay \
							una expresión de alivio en sus ojos...";
		pnjNaufrago.syn.push( "valerio" );
          toret = "Quiz&aacute;s ahora, que ya est&aacute; tranquilo, \
                   sea un buen momento para hacerle unas preguntas.";
	} else {
          toret = dropAction.exe( parser.sentencia );
     }

	return toret;
}

objBote.vecesExaminado = 0;
objBote.preExamine = function() {
     var toret = objBote.desc;

     ++objBote.vecesExaminado;
     if ( objBote.vecesExaminado > 2 ) {
          toret = actions.execute( "search", "bote" );
     } else {
          toret += " Vas encontrando cosas nuevas, que descartas por in&uacute;tiles.";
     }

     return toret;
}

objBote.preSearch = function() {
     if ( objBotella.owner === ctrl.lugares.limbo ) {
          objBotella.mueveA( ctrl.personas.devJugador() );
          return "Del ${bote,ex bote}, has recogido una \
                  ${botella con agua,ex botella}.";
     }

     return "No encuentras nada m&aacute;s.";
}


// === Cantiles ------------------------------------------------------
const locCantiles = ctrl.lugares.creaLoc( "Cantiles",
                    [ "cantiles", "acantilados" ],
                    "Los cantiles de grandes ${rocas, ex rocas} \
                     terminan en este punto con la breve \
                     ${playa, ex playa} a la que arribaste, al \
                     ${oeste, oeste} de aquí."
);

locCantiles.pic = "res/acantilados.jpg";

locCantiles.objs.push( objRocas );
locCantiles.objs.push( objMar );

const objPlaya = ctrl.creaObj( "playa", [ "playa", "cala", "caleta" ],
                    "La playa se encuentra el ${oeste, oeste} de aquí.",
                    locCantiles, Ent.Escenario
);

locCantiles.ponSalidaBi( "oeste", locPlaya );

const pnjNaufrago = ctrl.personas.creaPersona( "naufrago",
                    [ "hombre", "persona", "marino" ],
                    "Tiene pinta de llevar mucho tiempo aqu&iacute;.",
                    locCantiles
);

pnjNaufrago.status = 0;
pnjNaufrago.preTalk = function() {
     var toret = "";
     var jugador = ctrl.personas.devJugador();

     if ( this.status == 0 ) {
          this.di( "Oh..." );
          ctrl.print( "Parece débil, y está claramente deshidratado." );
          jugador.di( "Oiga, oiga... me llamo Edmundo..." );
          this.di( "Agua..." );
          toret = "El hombre se desvanece.";
          ++this.status;
     }
     else
     if ( this.status == 1 ) {
          ctrl.print( "Espabilas al hombre, con unas palmadas en la cara." );
          this.di( "Agua..." );
          toret = "No parece haber mucho más que hacer...";
     }
     else
     if ( this.status == 2 ) {
          this.di( "Necesito un bote para volver a la civilización." );
          jugador.di( "Valerio, puedes tomar el mío, en la playa cerca \
                       de aquí. Por todo pago, sólo te pido que me ayudes \
                       a encontrar la cueva en las entrañas de esta isla. \
                       Y también... que vuelvas a buscarme dentro de dos \
                       días." );
          this.di( "Oh, s&iacute;... Está al sur de la playa... no tiene pérdida." );
          ctrl.print( "Valerio corre hacia el bote, y lo empuja en el agua." );
          this.di( "¡Volveré!" );
          toret = "El hombre rema mar adentro...";
          locPlaya.modificaDesc();
          locAntesala.ponSalidaBi( "norte", locPlaya );
          objBote.moveTo( ctrl.lugares.limbo );
          this.moveTo( ctrl.lugares.limbo );
          ctrl.lugares.updateDesc();
     }

     return toret;
}

// === Oscura cueva --------------------------------------------------
const locCueva = ctrl.lugares.creaLoc( "Cueva oscura",
                    [ "cueva", "gruta" ],
                    "Una oscura cueva, totalmente desnuda, forma una \
                    reducida circunferencia en derredor de un paso \
                    al ${sur,sur}. Es muy baja, así que es necesario \
                    agacharse para estar aquí."
);

locCueva.pic = "res/cuevaOscura.jpg";


// === Antesala ------------------------------------------------------
const locAntesala = ctrl.lugares.creaLoc( "Antesala",
                    [ "cueva", "gruta", "antesala" ],
                    "La cueva empieza al ${norte, norte} para adentrarse \
                     hacia el ${este,este}. \
                     Grande, enorme, de sus ${altos techos, ex techos} \
                     cuelgan numerosas ${estalactitas, ex estalactitas}."
);

locAntesala.pic = "res/entradaCueva.jpg";

locAntesala.preExit = function() {
	ctrl.goto( locPlaya );
	return "";
}

const objEstalactitas = ctrl.creaObj( "estalactitas",
     [ "techo", "techos", "estalactita", "alto", "alturas", "altos" ],
     "Docenas de estalactitas cuelgan del techo, puntiagudas.",
     locAntesala, Ent.Escenario
);


// === Pasaje --------------------------------------------------------
const locPasaje = ctrl.lugares.creaLoc( "Pasaje",
                    [ "cueva", "gruta", "pasaje", "pasillo", "camino" ],
                    "Un estrecho pasillo recorre un camino de unos cincuenta \
                     metros, de ${este,este} a ${oeste,oeste}."
);

locPasaje.preLook = function() {
     var toret = locPasaje.desc;

     if ( !objRocaPlana.abierta ) {
          toret += " En la \
                     pared sur, se apoya una ${roca plana, ex roca}, \
                     del tamaño de una persona, como tapando algo.";
     } else {
          toret += " La ${roca plana, ex roca} \
                     aparece ahora desgajada, \
                     abriendo un pasaje al ${sur,sur}.";
     }


     return toret;
};

locPasaje.pic = "res/pasaje.jpg";
locPasaje.ponSalidaBi( "oeste", locAntesala );

const objRocaPlana = ctrl.creaObj(
    "roca plana",
    [ "roca", "puerta", "ojo", "cerradura" ],
    "Descansa contra la pared sur. \
    Te das cuenta de que tiene un ojo de \
    cerradura, parece como una puerta a la \
    que le falta la llave...",
    locPasaje,
    Ent.Escenario
);
objRocaPlana.abierta = false;

objRocaPlana.preExamine = function() {
    var toret = this.desc;
    
    if ( ctrl.personas.getPlayer().has( objLlave ) ) {
        toret += " Por cierto, ahora tienes una llave \
                   que podrías ${probar, abre roca}.";
    }
    
    return toret;
};

objRocaPlana.preOpen = function() {
     var toret = "";
     var player = ctrl.personas.devJugador();
     var llave = ctrl.lookUpObj( player, "llave" );

     if ( llave === null ) {
          toret = "No se puede abrir sin una llave...";
     } else {
			if ( locPasaje.devSalida( "sur" ) === null ) {
			  locPasaje.ponSalidaBi( "sur", locSalaTesoro );
			  objRocaPlana.desc = "Descansa, desplazada, contra la pared sur.";
			  objRocaPlana.abierta = true;
			  toret = "Con mano temblorosa, abres la puerta \
					   introduciendo la llave en la abertura.";
			  acciones.ejecuta( "look" );
			} else {
				toret = "La puerta descansa desplazada. \
						 Un pasaje se vislumbra al ${sur, sur}";
			}

     }

     return toret;
};

const objLlave = ctrl.creaObj( "llave", [ "llave" ],
                             "Ligeramente oxidada.",
                             locCueva, Obj.Portable
);

objLlave.preDrop = function() {
     var toret = "";

     if ( parser.sentencia.obj2 === objRocaPlana ) {
          toret = acciones.ejecuta( "open", "roca" )
     } else {
          toret = acciones.devAccion( "drop" ).exe( parser.sentencia );
          ctrl.lugares.actualizaDesc();
     }

     return toret;
}


// === Fondo de saco ---------------------------------------------------
const locFondo = ctrl.lugares.creaLoc( "Fondo de saco",
                    [ "cueva", "gruta", "fondo", "saco" ],
                    "La cueva termina en este punto, pareciendo \
                     estirarse docenas de metros antes de cerrarse en \
                     todas direcciones. Al ${oeste,oeste} comienza un \
                     estrecho pasaje."
);

locFondo.pic = "res/cuevaInundada.jpg";
locFondo.inundada = true;

const objAgua = ctrl.creaObj(
    "agua",
    [ "agua", "inundación", "inundacion" ],
    "Todo está lleno de agua.",
    locFondo,
    Ent.Escenario
);

const objRocaRedonda = ctrl.creaObj(
    "roca redonda",
    [ "roca", "piedra", "redonda" ],
    "Descansa contra la pared norte. \
    Es una roca relativamente pequeña, \
    y no parece que esté muy fijada al suelo o la pared. \
    ${Podrías tratar de moverla, empuja roca}.",
    locFondo,
    Ent.Escenario
);

objRocaRedonda.prePush = function() {
     var toret = "Ya no se mueve m&aacute;s.";

     if ( locFondo.inundada ) {
          locFondo.inundada = false;
          toret = "Al mover la roca, es como si hubieras liberado \
                   el tap&oacute;n de un gran inodoro. El nivel del \
                   agua baja bruscamente, con un sonido gutural, \
                   hasta sólo cubrir tus pies.";
          locFondo.ponSalidaBi( "norte", locCueva );
          acciones.ejecuta( "look" );
     }

     return toret;
};

locFondo.preLook = function() {
     var toret = locFondo.desc;

     if ( locFondo.inundada ) {
          toret += " Está toda inundada por el ${agua, ex agua}. \
                     En la \
                     pared norte, se apoya una ${roca redonda, ex roca}, \
                     de pequeño tamaño. \
                     Está medio ${sumergida, ex agua}.";
     } else {
          toret += " La roca redonda aparece ahora fuera de su sitio, \
                     dejando el paso expedito al ${norte,norte}.";
     }

     return toret;
};

locFondo.ponSalidaBi( "oeste", locPasaje );


// === Sala del tesoro -----------------------------------------------
const locSalaTesoro = ctrl.lugares.creaLoc( "Sala del tesoro",
                    [ "cueva", "gruta", "salida" ],
                    "Una gran sala, bastante limpia y desnuda, \
                     y cortada en apariencia a la medida \
                     de una estancia normal, se extiende hacia el norte, \
                     ahora bloquedado, y hacia el ${oeste, oeste}."
);

locSalaTesoro.pic = "res/salaTesoro.jpg";

locSalaTesoro.preLook = function() {
     var toret = locSalaTesoro.desc;

     if ( locSalaTesoro.devSalida( "norte" ) != null ) {
          locSalaTesoro.ponSalida( "norte", null );

          toret +=
               "<p>La puerta se desliza de nuevo con un quejumbroso sonido, \
                al atravesar su umbral. Ya no se puede pasar por ahí...";
     }

     return toret;
}

const objCofrecillo = ctrl.creaObj(
    "cofrecillo",
    [ "cofre", "tesoro" ],
    "¡Es el cofre del tesoro del que te habló el abate! \
     Rebosa de piedras preciosas.",
    locSalaTesoro,
    Obj.Portable
);


// === Salida ---------------------------------------------------------
const locSalida = ctrl.lugares.creaLoc( "Salida de la cueva",
                    [ "cueva", "gruta", "salida" ],
                    "La cueva se estrecha a la altura de una persona \
                     agachado a medida que baja hacia una playa al \
                     ${oeste, oeste}. El ${agua del mar, ex agua} \
                     entra y sale por ${el hueco, ex hueco}.  \
                     Al ${este,este} se aprecia un tenue resplandor." );

locSalida.ponSalidaBi( "este", locSalaTesoro );

const objHueco = ctrl.creaObj(
    "hueco",
    [ "entrada" ],
    "El hueco que deja la roca prácticamente está a la altura del \
     ${agua, ex agua}.",
    locSalida,
    Ent.Scenery );

objHueco.canSwim = false;

objHueco.preExamine = function() {
    var toret = this.desc;
    
    if ( this.canSwim ) {
        toret += " Te das cuenta ahora de que podrías ${nadar, nada}, \
                   pasando por debajo de la roca \
                   en el hueco de entrada del mar.";
    }
    
    return toret;
};

const objMarSalida = ctrl.creaObj(
    "agua",
    [ "mar" ],
    "Agua salada y cristalina. Puedes ver perfectamente el fondo, \
     apenas cubriendo tus pies en los puntos próximos a ti, mientras \
     va aumentando la profundidad a medida que avanzas la vista \
     hacia la ${entrada del mar, ex hueco}.",
    locSalida,
    Ent.Scenery );

objMarSalida.preExamine = function() {
    var toret = this.desc;
    
    objHueco.canSwim = true;
    
    return toret;
};

objMarSalida.preAttack = function() {
    const player = ctrl.personas.getPlayer();
    var toret = "Pero... ¡si no llevas nada en las manos!";
    
    if ( player.objs.length > 0 ) {
        player.objs.slice().forEach( obj => obj.moveTo( locSalida ) );
        
        toret = "Has dejado todo lo que llevabas en el suelo.";
        ctrl.places.doDesc();
    }
    
    return toret;
};

locSalida.pic = "res/salidaCuevaInundada.jpg";

locSalida.preGo = function() {
     var toret = "";

     if ( parser.sentencia.term1 === "oeste" ) {
          toret = "El techo desciende demasiado como para salir \
                   por ahí.";
     } else {
          toret = actions.devAccion( "go" ).exe( parser.sentencia );
     }

     return toret;
};

locSalida.preSwim = function(s) {
     var player = ctrl.personas.devJugador();
     var toret = "Chapoteas en el agua, mientras te diriges hacia \
                  la angosta salida.<br>";

     if ( player.objs.length > 1 ) {
          toret += "Tratas de introducirte por el agujero, pero por \
                   m&aacute;s que lo intentas, eres incapaz de nadar \
                   con las ${manos llenas de cosas, golpea mar}.";
     } else {
          toret += "Te introduces por el agujero, braceando \
                    desesperadamente, hasta que sales por el otro lado. \
                    Con un eufórico sentimiento de victoria, emerges, y \
                    chapoteas hasta la playa. ¡Has escapado de la isla!<p>";

          if ( player.objs.indexOf( objCofrecillo ) > -1 ) {
               toret += "Aprietas el cofre, y la inmensa fortuna en su \
                         interior, contra tu pecho.<p>Ahora puede \
                         comenzar tu venganza.";
          } else {
               toret += "...es una verdadera lástima que olvidaras \
                        coger el cofre del tesoro en el último momento.";
          }

          toret += "<p align='right'>\
                    <a href='javascript: location.reload();'>\
                    <i>Comenzar de nuevo</i></a>.";
          
          document.getElementById( "dvCmds" ).style.display = "none";
          ctrl.terminaJuego( toret, "res/mar.jpg" );
          toret = "";

     }

     return toret;
};


// === Jugador -------------------------------------------------------
const jugador = ctrl.personas.creaPersona( "Edmundo Dant&eacute;s",
                    [ "jugador" ],
                    "Hu&iacute;do del castillo de If, tienes una pinta \
                    deplorable en este momento.",
                    locPlaya
);

objBufanda = ctrl.creaObj( "bufanda",
                              [ "bufanda", "fular", "foulard" ],
                              "Una gruesa bufanda de marinero.",
                              jugador
);
objBufanda.ponPuesto();


// Nuevas acciones -----------------------------------------------------
const rezaAccion = actions.crea( "reza",
	[ "reza", "rezar", "rezo" ]
);

rezaAccion.doIt = function(s) {
     return "Tal y como te enseñ&oacute; el abate, cierras los ojos \
             visualizando tu interior, y soltando el aire poco a poco. \
             En un proceso &iacute;ntimo, te haces uno con el hacedor, \
             inundando tu ser de paz.<br>Cuando vuelves a abrir los ojos, \
             sabes que ya est&aacute;s listo.";
}


// === Arranque ------------------------------------------------------
ctrl.lugares.ponInicio( locPlaya );
ctrl.personas.cambiaJugador( jugador );
