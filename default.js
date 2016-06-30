var azul = -1; // Computadora IA
var rojo = 1; // Usuario
var ficha_act = false; //Activar Ficha
var jugar = false; // Iniciar juego
var doble_salto = false; // Valida Doble Salto
var comp_move = false;
var juego_terminado = false; // Juego Terminado
var salvar_de = salvar_en = null;
var toggler = null;
var togglers = 0;
var momento = false; // En Espera
//Tablero de juego 
//Los 1 representan al usuario, los -1 representan a la ia
var tablero;
Tablero(1,0,1,0,1,0,1,0,
      0,1,0,1,0,1,0,1,
      1,0,1,0,1,0,1,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,-1,0,-1,0,-1,0,-1,
      -1,0,-1,0,-1,0,-1,0,
      0,-1,0,-1,0,-1,0,-1);

// the higher the jump_priority, the more often the computer will take the jump over the safe move
var jump_priority = 10;


function Iniciar() {
    message("Seleccione una pieza roja para mover.");
    jugar = true;    
}

function Tablero() {
    tablero = new Array();
    for (var i=0;i<8; i++) {
        tablero[i] = new Array();
        for (var j=0;j<8;j++){
            tablero[i][j] = Tablero.arguments[8*j+i];
        }
    }
    tablero[-2] = new Array(); // prevents errors
    tablero[-1] = new Array();
    tablero[8] = new Array();
    tablero[9] = new Array();
}

function message(s) {
    if (!juego_terminado) {
        var elm = document.getElementById("message");
        elm.innerHTML = s;
    }
}

function espacio_libre(i, j) {
    // Calculates whether it is a gray (moveable) or black (non-moveable) space
    return ( ((i%2)+j)%2 == 0 );
}

function Coord(x, y) {
    this.x = x;
    this.y = y;
}

function coord(x, y) {
    c = new Coord(x,y);
    return c;
}

function didClick(i, j) {
    if (!momento) {
        if (jugar) {
            if ( integ(tablero[i][j]) == 1 ) {
                toggle(i,j);
            }
            else if (ficha_act) {
                momento = true;
                movimiento( selected,coord(i,j) );
                setTimeout("UnMomento()", 2000);
            }
            else {
                message("Click en la pieza roja, haga click donde quiere mover");
            }
        }
        else {
             message("Espere un momento.");
        }
    }
    else {
        message("Espere un momento.");
    }
}

function UnMomento() {
    momento = false;
}

function toggle(x, y) {
    if (jugar) {
         if (ficha_act)
            draw(selected.x,selected.y,"user1"+((tablero[selected.x][selected.y]==1.1)?"k":"")+".gif");
         if (ficha_act && (selected.x == x) && (selected.y == y)) {
            ficha_act = false;
            if (doble_salto) { 
                jugar = doble_salto = false; computer(); 
            }
         } else {
            ficha_act = true;
            draw(x,y,"user2"+((tablero[x][y]==1.1)?"k":"")+".gif");
         }
         selected = coord(x,y);
    } else {
         if ((ficha_act) && (integ(tablero[selected_c.x][selected_c.y])==-1))
            draw(selected_c.x,selected_c.y,"ia1"+((tablero[selected_c.x][selected_c.y]==-1.1)?"k":"")+".gif");
         if (ficha_act && (selected_c.x == x) && (selected_c.y == y)) {
            ficha_act = false;
         } else {
            ficha_act = true;
            draw(x,y,"ia2"+((tablero[x][y]==-1.1)?"k":"")+".gif");
         }
         selected_c = coord(x,y);
    }
}

function draw(x, y, name) {
    document.images["space"+x+""+y].src = name;
}

function integ(num) {
    if (num != null)
         return Math.round(num);
    else
         return null;
}

function abs(num) {
    return Math.abs(num);
}

function sign(num) {
    if (num < 0) return -1;
    else return 1;
}

function concatenate(arr1, arr2) {
    // function tacks the second array onto the end of the first and returns result
    for(var i=0;i<arr2.length;i++)
         arr1[arr1.length+i] = arr2[i];
    return arr1;
}

function movimiento_permitido(from, to) {
    if ((to.x < 0) || (to.y < 0) || (to.x > 7) || (to.y > 7)) return false;
    ficha = tablero[from.x][from.y];
    distancia = coord(to.x-from.x,to.y-from.y);
    if ((distancia.x == 0) || (distancia.y == 0)) {
         message("Solo se puede hacer movimiento en diagonal.");
         return false;
    }
    if (abs(distancia.x) != abs(distancia.y)) {
         message("Este movimiento no es valido.");
         return false;
    }
    if (abs(distancia.x) > 2) {
         message("Este movimiento no es valido.");
         return false;
    }
    if ((abs(distancia.x) == 1) && doble_salto) {
         return false;
    }
    if ((tablero[to.x][to.y] != 0) || (ficha == 0)) {
         return false;
    }
    if ((abs(distancia.x) == 2)
    && (integ(ficha) != -integ(tablero[from.x+sign(distancia.x)][from.y+sign(distancia.y)]))) {
         return false;
    }
    if ((integ(ficha) == ficha) && (sign(ficha) != sign(distancia.y))) {
         return false;
    }    
    return true;
}

function movimiento(from, to) {
    jugar = true;
    if (movimiento_permitido(from,to)) {
         ficha = tablero[from.x][from.y];
         distancia = coord(to.x-from.x,to.y-from.y);
         if ((abs(distancia.x) == 1) && (tablero[to.x][to.y] == 0)) {
            swap(from,to);
         } else if ((abs(distancia.x) == 2)
         && (integ(ficha) != integ(tablero[from.x+sign(distancia.x)][from.y+sign(distancia.y)]))) {
            doble_salto = false;
            swap(from,to);
            comer(from.x+sign(distancia.x),from.y+sign(distancia.y));
            if ((movimiento_permitido(to,coord(to.x+2,to.y+2)))
            || (movimiento_permitido(to,coord(to.x+2,to.y-2)))
            || (movimiento_permitido(to,coord(to.x-2,to.y-2)))
            || (movimiento_permitido(to,coord(to.x-2,to.y+2)))) {
             doble_salto = true;
             message("Complete el doble salto, click en la pieza y mover nuevamente.");
            }
         }
         if ((tablero[to.x][to.y] == 1) && (to.y == 7)) Coronar(to.x,to.y);
         selected = to;
         if (fin_juego() && !doble_salto) {
            setTimeout("toggle("+to.x+","+to.y+");jugar = doble_salto = false;computer();",1000);
         }
    }
    return true;
}

function Coronar(x, y) {
    if (tablero[x][y] == 1) {
         tablero[x][y] = 1.1; // king you
         draw(x,y,"user2k.gif");
    } else if (tablero[x][y] == -1) {
         tablero[x][y] = -1.1; // king me
         draw(x,y,"ia2k.gif");
    }
}

function swap(from, to) {
    if (jugar || comp_move) {
         dummy_src = document.images["space"+to.x+""+to.y].src;
         document.images["space"+to.x+""+to.y].src = document.images["space"+from.x+""+from.y].src;
         document.images["space"+from.x+""+from.y].src = dummy_src;
    }
    dummy_num = tablero[from.x][from.y];
    tablero[from.x][from.y] = tablero[to.x][to.y];
    tablero[to.x][to.y] = dummy_num;
}

function comer(x, y) {
    if (jugar || comp_move)
         draw(x,y,"claro.gif");
    tablero[x][y] = 0;
}

function Result(val) {
    this.high = val;
    this.dir = new Array();
}

function move_comp(from, to) {
    toggle(from.x,from.y);
    comp_move = true;
    swap(from,to);
    if (abs(from.x-to.x) == 2) {
         comer(from.x+sign(to.x-from.x),from.y+sign(to.y-from.y));
    }
    if ((tablero[to.x][to.y] == -1) && (to.y == 0)) Coronar(to.x,to.y);
    setTimeout("selected_c = coord("+to.x+","+to.y+");ficha_act = true;",900);
    setTimeout("bak=jugar;jugar=false;toggle("+to.x+","+to.y+");jugar=bak;",1000);
    if (fin_juego()) {
         setTimeout("comp_move = false;jugar = true;togglers=0;",600);
         message("Mover Ahora.");
    }
    return true;
}

function fin_juego() {
    // make sure game is not over (return false if game is over)
    computador = jugador = false;
    for(var i=0;i<8;i++) {
         for(var j=0;j<8;j++) {
            if(integ(tablero[i][j]) == -1) computador = true;
            if(integ(tablero[i][j]) == 1) jugador = true;
         }
    }
    if (!computador) message("Felicitaciones has ganado el juego ;) !");
    if (!jugador) message("Perdiste. Juego Terminado.");
    juego_terminado = (!computador || !jugador)
    return (!juego_terminado);
}

function computer() {
    // step one - prevent any jumps
    for (var j=0;j<8;j++) {
         for(var i=0;i<8;i++) {
            if (integ(tablero[i][j]) == 1) {
                if ((movimiento_permitido(coord(i,j),coord(i+2,j+2))) && (prevent(coord(i+2,j+2),coord(i+1,j+1)))) {
                    return true;
                } 
                if ((movimiento_permitido(coord(i,j),coord(i-2,j+2))) && (prevent(coord(i-2,j+2),coord(i-1,j+1)))) {
                    return true;
                }
            } 
            if (tablero[i][j] == 1.1) {
                if ((movimiento_permitido(coord(i,j),coord(i-2,j-2))) && (prevent(coord(i-2,j-2),coord(i-1,j-1)))) {
                    return true;
                }   
                if ((movimiento_permitido(coord(i,j),coord(i+2,j-2))) && (prevent(coord(i+2,j-2),coord(i+1,j-1)))) {
                    return true;
                }
            }
         }
    }

    // step two - if step one not taken, look for jumps
    for (var j=7;j>=0;j--) {
        for(var i=0;i<8;i++) {
            if (jump(i,j))
                return true;
        }
    }
    salvar_de = null;

    // step three - if step two not taken, look for safe single space moves
    for (var j=0;j<8;j++) {
        for(var i=0;i<8;i++) {
            if (single(i,j))
                return true;
        }
    }

    // if no safe moves, just take whatever you can get
    if (salvar_de != null) {
        move_comp(salvar_de,salvar_en);
    } else {
        message("Has ganado!");
        juego_terminado = true;
    }
    salvar_de = salvar_en = null;
    return false;
}

function jump(i, j) {
    if (tablero[i][j] == -1.1) {  
         if (movimiento_permitido(coord(i,j),coord(i+2,j+2))) {
            move_comp(coord(i,j),coord(i+2,j+2));
            setTimeout("jump("+(i+2)+","+(j+2)+");",500);
            return true;
         } if (movimiento_permitido(coord(i,j),coord(i-2,j+2))) {
            move_comp(coord(i,j),coord(i-2,j+2));
            setTimeout("jump("+(i-2)+","+(j+2)+");",500);
            return true;
         }
    } if (integ(tablero[i][j]) == -1) {
         if (movimiento_permitido(coord(i,j),coord(i-2,j-2))) {
            move_comp(coord(i,j),coord(i-2,j-2));
            setTimeout("jump("+(i-2)+","+(j-2)+");",500);
            return true;
         } if (movimiento_permitido(coord(i,j),coord(i+2,j-2))) {
            move_comp(coord(i,j),coord(i+2,j-2));
            setTimeout("jump("+(i+2)+","+(j-2)+");",500);
            return true;
         }
    }
    return false;
}

function single(i, j)
{
    if (tablero[i][j] == -1.1) {
         if (movimiento_permitido(coord(i,j),coord(i+1,j+1))) {
            salvar_de = coord(i,j);
            salvar_en = coord(i+1,j+1);
            if (wise(coord(i,j),coord(i+1,j+1))) {
             move_comp(coord(i,j),coord(i+1,j+1));
             return true;
            }
         } if (movimiento_permitido(coord(i,j),coord(i-1,j+1))) {
            salvar_de = coord(i,j);
            salvar_en = coord(i-1,j+1);
            if (wise(coord(i,j),coord(i-1,j+1))) {
             move_comp(coord(i,j),coord(i-1,j+1));
             return true;
            }
         }
    } if (integ(tablero[i][j]) == -1) {
         if (movimiento_permitido(coord(i,j),coord(i+1,j-1))) {
            salvar_de = coord(i,j);
            salvar_en = coord(i+1,j-1);
            if (wise(coord(i,j),coord(i+1,j-1))) {
             move_comp(coord(i,j),coord(i+1,j-1));
             return true;
            }
         } if (movimiento_permitido(coord(i,j),coord(i-1,j-1))) {
            salvar_de = coord(i,j);
            salvar_en = coord(i-1,j-1);
            if (wise(coord(i,j),coord(i-1,j-1))) {
             move_comp(coord(i,j),coord(i-1,j-1));
             return true;
            }
         }
    }
    return false;
}

function possibilities(x, y)
{
    if (!jump(x,y))
         if (!single(x,y))
            return true;
         else
            return false;
    else
         return false;
}

function prevent(end, s)
{
    i = end.x;
    j = end.y;
    if (!possibilities(s.x,s.y))
         return true;
    else if ((integ(tablero[i-1][j+1])==-1) && (movimiento_permitido(coord(i-1,j+1),coord(i,j)))) {
            return move_comp(coord(i-1,j+1),coord(i,j));
    } else if ((integ(tablero[i+1][j+1])==-1) && (movimiento_permitido(coord(i+1,j+1),coord(i,j)))) {
            return move_comp(coord(i+1,j+1),coord(i,j));
    } else if ((tablero[i-1][j-1]==-1.1) && (movimiento_permitido(coord(i-1,j-1),coord(i,j)))) {
            return move_comp(coord(i-1,j-1),coord(i,j));
    } else if ((tablero[i+1][j-1]==-1.1) && (movimiento_permitido(coord(i+1,j-1),coord(i,j)))) {
            return move_comp(coord(i+1,j-1),coord(i,j));
    } else {
         return false;
    }
}

function wise(from, to)
{
    i = to.x;
    j = to.y;
    n = (j>0);
    s = (j<7);
    e = (i<7);
    w = (i>0);
    if (n&&e) ne = tablero[i+1][j-1]; else ne = null;
    if (n&&w) nw = tablero[i-1][j-1]; else nw = null;
    if (s&&e) se = tablero[i+1][j+1]; else se = null;
    if (s&&w) sw = tablero[i-1][j+1]; else sw = null;
    eval(((j-from.y != 1)?"s":"n")+((i-from.x != 1)?"e":"w")+"=0;");
    if ((sw==0) && (integ(ne)==1)) return false;
    if ((se==0) && (integ(nw)==1)) return false;
    if ((nw==0) && (se==1.1)) return false;
    if ((ne==0) && (sw==1.1)) return false;
    return true;
}







var inicio=0;
var timeout=0;
function empezarDetener(elemento)
    {
        if(timeout==0)
        {
            // empezar el cronometro
 
            elemento.value="Detener";
 
            // Obtenemos el valor actual
            inicio=vuelta=new Date().getTime();
 
            // iniciamos el proceso
            funcionando();
        }else{
            // detemer el cronometro
 
            elemento.value="Empezar";
            clearTimeout(timeout);
            timeout=0;
        }
    }
 
    function funcionando()
    {
        // obteneos la fecha actual
        var actual = new Date().getTime();
 
        // obtenemos la diferencia entre la fecha actual y la de inicio
        var diff=new Date(actual-inicio);
 
        // mostramos la diferencia entre la fecha actual y la inicial
        var result=LeadingZero(diff.getUTCHours())+":"+LeadingZero(diff.getUTCMinutes())+":"+LeadingZero(diff.getUTCSeconds());
        document.getElementById('crono').innerHTML = result;
 
        // Indicamos que se ejecute esta función nuevamente dentro de 1 segundo
        timeout=setTimeout("funcionando()",1000);
    }
 
    /* Funcion que pone un 0 delante de un valor si es necesario */
    function LeadingZero(Time) {
        return (Time < 10) ? "0" + Time : + Time;
    }