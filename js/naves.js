var canvas, ctx;
var imgObjM, imgObjE, imgObjP, imgObjQ;
const FPS=50;
const sizeSection=90;
var sizeBG=5, maxW_H_C=sizeBG*sizeSection;
const largeShoot = parseInt(sizeSection/2), shortShoot = parseInt(sizeSection*.4);
var maxEnemies = parseInt(sizeBG/2)+1;
var objM, listener, listenerShoots;
const waitingTimeShoot = 100;
var keywordEvent = new window.keypress.Listener(this);
var keys;
var isGameEnded = false, hasWon = false, hasStarted = false;
var nivelActual = 1, nivelesSuperados = 0;

imgObjM = new Image();
imgObjM.src = "../images/charizard.png";

imgObjE = new Image();
imgObjE.src = "../images/blastoise.png";

imgObjP = new Image();
imgObjP.src = "../images/venasaur.png";

imgObjQ = new Image();
imgObjQ.src = "../images/pikachu.png";

function createTableGame(){
    let a = [];

    for (let iy = 0; iy < sizeBG; iy++) {
        let b = [];
        for (let ix = 0; ix < sizeBG; ix++) {
            if(iy==0 || iy%2==0){
                b[ix]=0;
            }else{
                if(ix%2!=0){
                    b[ix]=1 ;
                } else{
                    b[ix]=0;
                }
            }
        }
        a[iy] = b;
    }
    return a;
}

function endGame(statusWinner){
    isGameEnded = true;
    hasWon = statusWinner;

    if(statusWinner){
        nivelActual++;
        nivelesSuperados++;
        sizeBG += 2;
    }else{
        nivelActual = 1;
        sizeBG = 5;
    }
    maxEnemies = parseInt(sizeBG/2)+1;
    maxW_H_C=sizeBG*sizeSection;
}

var tableG = createTableGame();
/*
const tableG = [ //9x9, en caso de aumentar cambiar la variable de sizeBG, solo numeros impares
    [0,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,0]
];*/

/* Objetos*/
const objListener = function(){
    this.objList = [];

    this.addEnemie = function(enemie){
        this.objList.push({
            "itself" : enemie,
            "p1" : [enemie.x,enemie.y],                           //SupIzq
            "p2" : [enemie.x,enemie.y+sizeSection],               //InfIzq
            "p3" : [enemie.x+sizeSection,enemie.y],               //SupDer
            "p4" : [enemie.x+sizeSection,enemie.y+sizeSection]    //InfDer
        });

        return this.objList.length;
    }

    this.updatePositions = function(index, x, y){
        let enemie = this.objList[index-1];
        enemie.p1 = [x,y];
        enemie.p2 = [x,y+sizeSection];
        enemie.p3 = [x+sizeSection,y];
        enemie.p4 = [x+sizeSection,y+sizeSection];
        this.objList[index-1] = enemie;
    }

    this.friendlyColision = function(index, orientation){
        let copyEnemiesWithoutIndex = this.objList.slice();
        let enemieFocused = copyEnemiesWithoutIndex[index-1];
        let colision = false;

        copyEnemiesWithoutIndex.splice(index-1,1);

        copyEnemiesWithoutIndex.forEach(function(nearlyEnemie){
            if(!nearlyEnemie.itself.isDead){
                switch (orientation) {
                    case "U":
                        if((enemieFocused.p1[0]>=nearlyEnemie.p2[0] && enemieFocused.p1[1]<=nearlyEnemie.p2[1]
                            && enemieFocused.p1[0]<=nearlyEnemie.p4[0] && enemieFocused.p1[1]<=nearlyEnemie.p4[1]
                            && enemieFocused.p1[0]>=nearlyEnemie.p1[0] && enemieFocused.p1[1]>=nearlyEnemie.p1[1]
                            && enemieFocused.p1[0]<=nearlyEnemie.p3[0] && enemieFocused.p1[1]>=nearlyEnemie.p3[1])
                            || (enemieFocused.p3[0]>=nearlyEnemie.p2[0] && enemieFocused.p1[1]<=nearlyEnemie.p2[1]
                                && enemieFocused.p3[0]<=nearlyEnemie.p4[0] && enemieFocused.p1[1]<=nearlyEnemie.p4[1]
                                && enemieFocused.p3[0]>=nearlyEnemie.p1[0] && enemieFocused.p1[1]>=nearlyEnemie.p1[1]
                                && enemieFocused.p3[0]<=nearlyEnemie.p3[0] && enemieFocused.p1[1]>=nearlyEnemie.p3[1]))
                            colision = true;
                        break;
                    case "R":
                        if((enemieFocused.p3[0]>=nearlyEnemie.p1[0] && enemieFocused.p3[1]>=nearlyEnemie.p1[1]
                            && enemieFocused.p3[0]>=nearlyEnemie.p2[0] && enemieFocused.p3[1]<=nearlyEnemie.p2[1]
                            && enemieFocused.p3[0]<=nearlyEnemie.p3[0] && enemieFocused.p3[1]>=nearlyEnemie.p3[1]
                            && enemieFocused.p3[0]<=nearlyEnemie.p4[0] && enemieFocused.p3[1]<=nearlyEnemie.p4[1])
                            || (enemieFocused.p4[0]>=nearlyEnemie.p1[0] && enemieFocused.p4[1]>=nearlyEnemie.p1[1]
                                && enemieFocused.p4[0]>=nearlyEnemie.p2[0] && enemieFocused.p4[1]<=nearlyEnemie.p2[1]
                                && enemieFocused.p4[0]<=nearlyEnemie.p3[0] && enemieFocused.p4[1]>=nearlyEnemie.p3[1]
                                && enemieFocused.p4[0]<=nearlyEnemie.p4[0] && enemieFocused.p4[1]<=nearlyEnemie.p4[1]))
                            colision = true;
                        break;
                    case "D":
                        if((enemieFocused.p2[0]>=nearlyEnemie.p1[0] && enemieFocused.p2[1]>=nearlyEnemie.p1[1]
                            && enemieFocused.p2[0]<=nearlyEnemie.p3[0] && enemieFocused.p2[1]>=nearlyEnemie.p3[1]
                            && enemieFocused.p2[0]>=nearlyEnemie.p2[0] && enemieFocused.p2[1]<=nearlyEnemie.p2[1]
                            && enemieFocused.p2[0]<=nearlyEnemie.p4[0] && enemieFocused.p2[1]<=nearlyEnemie.p4[1])
                            || (enemieFocused.p4[0]>=nearlyEnemie.p1[0] && enemieFocused.p4[1]>=nearlyEnemie.p1[1]
                                && enemieFocused.p4[0]<=nearlyEnemie.p3[0] && enemieFocused.p4[1]>=nearlyEnemie.p3[1]
                                && enemieFocused.p4[0]>=nearlyEnemie.p2[0] && enemieFocused.p4[1]<=nearlyEnemie.p2[1]
                                && enemieFocused.p4[0]<=nearlyEnemie.p4[0] && enemieFocused.p4[1]<=nearlyEnemie.p4[1]))
                            colision = true;
                        break;
                    case "L":
                        if((enemieFocused.p1[0]<=nearlyEnemie.p3[0] && enemieFocused.p1[1]>=nearlyEnemie.p3[1]
                            && enemieFocused.p1[0]<=nearlyEnemie.p4[0] && enemieFocused.p1[1]<=nearlyEnemie.p4[1]
                            && enemieFocused.p1[0]>=nearlyEnemie.p1[0] && enemieFocused.p1[1]>=nearlyEnemie.p1[1]
                            && enemieFocused.p1[0]>=nearlyEnemie.p2[0] && enemieFocused.p1[1]<=nearlyEnemie.p2[1])
                            || (enemieFocused.p2[0]<=nearlyEnemie.p3[0] && enemieFocused.p2[1]>=nearlyEnemie.p3[1]
                                && enemieFocused.p2[0]<=nearlyEnemie.p4[0] && enemieFocused.p2[1]<=nearlyEnemie.p4[1]
                                && enemieFocused.p2[0]>=nearlyEnemie.p1[0] && enemieFocused.p2[1]>=nearlyEnemie.p1[1]
                                && enemieFocused.p2[0]>=nearlyEnemie.p2[0] && enemieFocused.p2[1]<=nearlyEnemie.p2[1]))
                            colision = true;
                        break;
                    default:
                        break;
                }
            }
        });
        return colision;
    }
}

const objListenerShoots = function(){
    this.objList = [];

    this.addShoot = function(shoot, index){
        let p2,p3,p4;

        if(shoot.orientation=="D" || shoot.orientation=="U"){
            p2=[shoot.x,shoot.y+largeShoot];
            p3=[shoot.x+(sizeSection-(2*shortShoot)),shoot.y];
            p4=[shoot.x+(sizeSection-(2*shortShoot)),shoot.y+largeShoot];
        } else if(shoot.orientation=="L" || shoot.orientation=="R"){
            p2=[shoot.x,shoot.y+(sizeSection-(2*shortShoot))];
            p3=[shoot.x+largeShoot,shoot.y];
            p4=[shoot.x+largeShoot,shoot.y+(sizeSection-(2*shortShoot))];
        }

        this.objList[index-1] = {
            "itself" : shoot,
            "direction" : shoot.orientation,
            "p1" : [shoot.x,shoot.y],            //SupIzq
            "p2" : p2,               //InfIzq
            "p3" : p3,               //SupDer
            "p4" : p4                //InfDer
        };

        return index;
    }

    this.updatePositions = function(index, x, y, direction){
        let shoot = this.objList[index-1];
        shoot.direction = direction;
        shoot.p1 = [x,y];

        if(shoot.direction=="D" || shoot.direction=="U"){
            shoot.p2 = [x,y+largeShoot];
            shoot.p3 = [x+(sizeSection-(2*shortShoot)),y];
            shoot.p4 = [x+(sizeSection-(2*shortShoot)),y+largeShoot];
        } else if(shoot.direction=="R" || shoot.direction=="L"){
            shoot.p2 = [x,y+(sizeSection-(2*shortShoot))];
            shoot.p3 = [x+largeShoot,y];
            shoot.p4 = [x+largeShoot,y+(sizeSection-(2*shortShoot))];
        }
        this.objList[index-1] = shoot;
    }
    
    this.resetOtherShoot = function(otherShoot){
        listener.objList[(otherShoot.itself.indexFather)-1].itself.ownShoot = null;
        listener.objList[(otherShoot.itself.indexFather)-1].itself.existingShoot = false;
        listenerShoots.objList[(otherShoot.itself.indexFather)-1].itself.crashed = true;
    }
    
    this.resetOwnShoot = function(ownShoot){
        listener.objList[(ownShoot.itself.indexFather)-1].itself.ownShoot.crashed = true;
        listener.objList[(ownShoot.itself.indexFather)-1].itself.existingShoot = false;
    }

    this.friendlyShootColision = function(index, orientation){
        let copyShootsWithoutIndex = this.objList.slice();
        let shootFocused = copyShootsWithoutIndex[index-1];
        let colision = false;

        copyShootsWithoutIndex.splice(index-1,1);

        copyShootsWithoutIndex.forEach(function(nearlyShoot){//Cambiar los condicionales cuando se intersectan 2 disparos
            if(!nearlyShoot.itself.crashed){
                switch (orientation) {
                    case "U":
                        if((shootFocused.p1[0]>=nearlyShoot.p2[0] && shootFocused.p1[1]<=nearlyShoot.p2[1]
                            && shootFocused.p1[0]<=nearlyShoot.p4[0] && shootFocused.p1[1]<=nearlyShoot.p4[1]
                            && shootFocused.p1[0]>=nearlyShoot.p1[0] && shootFocused.p1[1]>=nearlyShoot.p1[1]
                            && shootFocused.p1[0]<=nearlyShoot.p3[0] && shootFocused.p1[1]>=nearlyShoot.p3[1])
                            || (shootFocused.p3[0]>=nearlyShoot.p2[0] && shootFocused.p3[1]<=nearlyShoot.p2[1]
                                && shootFocused.p3[0]<=nearlyShoot.p4[0] && shootFocused.p3[1]<=nearlyShoot.p4[1]
                                && shootFocused.p3[0]>=nearlyShoot.p1[0] && shootFocused.p3[1]>=nearlyShoot.p1[1]
                                && shootFocused.p3[0]<=nearlyShoot.p3[0] && shootFocused.p3[1]>=nearlyShoot.p3[1])){
                                    colision = true;
                                    listenerShoots.resetOtherShoot(nearlyShoot);
                                    console.log("Fuego Enemigo aliado: "+ shootFocused.itself.indexFather+ " a fuego enemigo aliado: "+nearlyShoot.itself.indexFather);
                                }
                        break;
                    case "R":
                        if((shootFocused.p3[0]>=nearlyShoot.p1[0] && shootFocused.p3[1]>=nearlyShoot.p1[1]
                            && shootFocused.p3[0]>=nearlyShoot.p2[0] && shootFocused.p3[1]<=nearlyShoot.p2[1]
                            && shootFocused.p3[0]<=nearlyShoot.p3[0] && shootFocused.p3[1]>=nearlyShoot.p3[1]
                            && shootFocused.p3[0]<=nearlyShoot.p4[0] && shootFocused.p3[1]<=nearlyShoot.p4[1])
                            || (shootFocused.p4[0]>=nearlyShoot.p1[0] && shootFocused.p4[1]>=nearlyShoot.p1[1]
                                && shootFocused.p4[0]>=nearlyShoot.p2[0] && shootFocused.p4[1]<=nearlyShoot.p2[1]
                                && shootFocused.p4[0]<=nearlyShoot.p3[0] && shootFocused.p4[1]>=nearlyShoot.p3[1]
                                && shootFocused.p4[0]<=nearlyShoot.p4[0] && shootFocused.p4[1]<=nearlyShoot.p4[1])){
                                    colision = true;
                                    listenerShoots.resetOtherShoot(nearlyShoot);
                                    console.log("Fuego Enemigo aliado: "+ shootFocused.itself.indexFather+ " a fuego enemigo aliado: "+nearlyShoot.itself.indexFather);
                                }
                        break;
                    case "D":
                        if((shootFocused.p2[0]>=nearlyShoot.p1[0] && shootFocused.p2[1]>=nearlyShoot.p1[1]
                            && shootFocused.p2[0]<=nearlyShoot.p3[0] && shootFocused.p2[1]>=nearlyShoot.p3[1]
                            && shootFocused.p2[0]>=nearlyShoot.p2[0] && shootFocused.p2[1]<=nearlyShoot.p2[1]
                            && shootFocused.p2[0]<=nearlyShoot.p4[0] && shootFocused.p2[1]<=nearlyShoot.p4[1])
                            || (shootFocused.p4[0]>=nearlyShoot.p1[0] && shootFocused.p4[1]>=nearlyShoot.p1[1]
                                && shootFocused.p4[0]<=nearlyShoot.p3[0] && shootFocused.p4[1]>=nearlyShoot.p3[1]
                                && shootFocused.p4[0]>=nearlyShoot.p2[0] && shootFocused.p4[1]<=nearlyShoot.p2[1]
                                && shootFocused.p4[0]<=nearlyShoot.p4[0] && shootFocused.p4[1]<=nearlyShoot.p4[1])){
                                    colision = true;
                                    listenerShoots.resetOtherShoot(nearlyShoot);
                                    console.log("Fuego Enemigo aliado: "+ shootFocused.itself.indexFather+ " a fuego enemigo aliado: "+nearlyShoot.itself.indexFather);
                                }
                        break;
                    case "L":
                        if((shootFocused.p1[0]<=nearlyShoot.p3[0] && shootFocused.p1[1]>=nearlyShoot.p3[1]
                            && shootFocused.p1[0]<=nearlyShoot.p4[0] && shootFocused.p1[1]<=nearlyShoot.p4[1]
                            && shootFocused.p1[0]>=nearlyShoot.p1[0] && shootFocused.p1[1]>=nearlyShoot.p1[1]
                            && shootFocused.p1[0]>=nearlyShoot.p2[0] && shootFocused.p1[1]<=nearlyShoot.p2[1])
                            || (shootFocused.p2[0]<=nearlyShoot.p3[0] && shootFocused.p2[1]>=nearlyShoot.p3[1]
                                && shootFocused.p2[0]<=nearlyShoot.p4[0] && shootFocused.p2[1]<=nearlyShoot.p4[1]
                                && shootFocused.p2[0]>=nearlyShoot.p1[0] && shootFocused.p2[1]>=nearlyShoot.p1[1]
                                && shootFocused.p2[0]>=nearlyShoot.p2[0] && shootFocused.p2[1]<=nearlyShoot.p2[1])){
                                    colision = true;
                                    listenerShoots.resetOtherShoot(nearlyShoot);
                                    console.log("Fuego Enemigo aliado: "+ shootFocused.itself.indexFather+ " a fuego enemigo aliado: "+nearlyShoot.itself.indexFather);
                                }
                        break;
                    default:
                        break;
                }
            }
        });
        return colision;
    }

    this.shootColision = function(shoot, orientation){
        const copyShootsEnemiesIndex = this.objList.slice();
        const shootFocused = shoot;
        let colision = false;
        const shoortSize = (sizeSection-(2*shortShoot));

        copyShootsEnemiesIndex.forEach(function(nearlyShoot){//Cambiar los condicionales cuando se intersectan 2 disparos
            if(!nearlyShoot.itself.crashed){
                switch (orientation) {
                    case "U":
                        if((shootFocused.x>=nearlyShoot.p2[0] && shootFocused.y<=nearlyShoot.p2[1]
                            && shootFocused.x<=nearlyShoot.p4[0] && shootFocused.y<=nearlyShoot.p4[1]
                            && shootFocused.x>=nearlyShoot.p1[0] && shootFocused.y>=nearlyShoot.p1[1]
                            && shootFocused.x<=nearlyShoot.p3[0] && shootFocused.y>=nearlyShoot.p3[1])
                            || (shootFocused.x+shoortSize>=nearlyShoot.p2[0] && shootFocused.y<=nearlyShoot.p2[1]
                            && shootFocused.x+shoortSize<=nearlyShoot.p4[0] && shootFocused.y<=nearlyShoot.p4[1]
                            && shootFocused.x+shoortSize>=nearlyShoot.p1[0] && shootFocused.y>=nearlyShoot.p1[1]
                            && shootFocused.x+shoortSize<=nearlyShoot.p3[0] && shootFocused.y>=nearlyShoot.p3[1])){
                            colision = true;
                            listenerShoots.resetOtherShoot(nearlyShoot);
                            console.log("Fuego Charizard U a fuego enemigo : "+nearlyShoot.itself.indexFather);
                        }
                        break;
                    case "R":
                        if((shootFocused.x+largeShoot>=nearlyShoot.p1[0] && shootFocused.y>=nearlyShoot.p1[1]
                            && shootFocused.x+largeShoot>=nearlyShoot.p2[0] && shootFocused.y<=nearlyShoot.p2[1]
                            && shootFocused.x+largeShoot<=nearlyShoot.p3[0] && shootFocused.y>=nearlyShoot.p3[1]
                            && shootFocused.x+largeShoot<=nearlyShoot.p4[0] && shootFocused.y<=nearlyShoot.p4[1])
                            || (shootFocused.x+largeShoot>=nearlyShoot.p1[0] && shootFocused.y+shoortSize>=nearlyShoot.p1[1]
                            && shootFocused.x+largeShoot>=nearlyShoot.p2[0] && shootFocused.y+shoortSize<=nearlyShoot.p2[1]
                            && shootFocused.x+largeShoot<=nearlyShoot.p3[0] && shootFocused.y+shoortSize>=nearlyShoot.p3[1]
                            && shootFocused.x+largeShoot<=nearlyShoot.p4[0] && shootFocused.y+shoortSize<=nearlyShoot.p4[1])){
                            colision = true;
                            listenerShoots.resetOtherShoot(nearlyShoot);
                            console.log("Fuego Charizard R a fuego enemigo : "+nearlyShoot.itself.indexFather);
                        }
                        break;
                    case "D":
                        if((shootFocused.x>=nearlyShoot.p1[0] && shootFocused.y+largeShoot>=nearlyShoot.p1[1]
                            && shootFocused.x<=nearlyShoot.p3[0] && shootFocused.y+largeShoot>=nearlyShoot.p3[1]
                            && shootFocused.x>=nearlyShoot.p2[0] && shootFocused.y+largeShoot<=nearlyShoot.p2[1]
                            && shootFocused.x<=nearlyShoot.p4[0] && shootFocused.y+largeShoot<=nearlyShoot.p4[1])
                            || (shootFocused.x+shoortSize>=nearlyShoot.p1[0] && shootFocused.y+largeShoot>=nearlyShoot.p1[1]
                            && shootFocused.x+shoortSize<=nearlyShoot.p3[0] && shootFocused.y+largeShoot>=nearlyShoot.p3[1]
                            && shootFocused.x+shoortSize>=nearlyShoot.p2[0] && shootFocused.y+largeShoot<=nearlyShoot.p2[1]
                            && shootFocused.x+shoortSize<=nearlyShoot.p4[0] && shootFocused.y+largeShoot<=nearlyShoot.p4[1])){
                            colision = true;
                            listenerShoots.resetOtherShoot(nearlyShoot);
                            console.log("Fuego Charizard D a fuego enemigo : "+nearlyShoot.itself.indexFather);
                        }
                        break;
                    case "L":
                        if((shootFocused.x<=nearlyShoot.p3[0] && shootFocused.y>=nearlyShoot.p3[1]
                            && shootFocused.x<=nearlyShoot.p4[0] && shootFocused.y<=nearlyShoot.p4[1]
                            && shootFocused.x>=nearlyShoot.p1[0] && shootFocused.y>=nearlyShoot.p1[1]
                            && shootFocused.x>=nearlyShoot.p2[0] && shootFocused.y<=nearlyShoot.p2[1])
                            || (shootFocused.x<=nearlyShoot.p3[0] && shootFocused.y+shoortSize>=nearlyShoot.p3[1]
                            && shootFocused.x<=nearlyShoot.p4[0] && shootFocused.y+shoortSize<=nearlyShoot.p4[1]
                            && shootFocused.x>=nearlyShoot.p1[0] && shootFocused.y+shoortSize>=nearlyShoot.p1[1]
                            && shootFocused.x>=nearlyShoot.p2[0] && shootFocused.y+shoortSize<=nearlyShoot.p2[1])){
                            colision = true;
                            listenerShoots.resetOtherShoot(nearlyShoot);
                            console.log("Fuego Charizard L a fuego enemigo : "+nearlyShoot.itself.indexFather);
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        return colision;
    }

    this.friendlyEnemieColision = function(index, orientation){
        let copyEnemies = listener.objList.slice();
        let shootFocused = this.objList[index-1];
        let colision = false;

        copyEnemies.forEach(function(nearlyEnemie){//Cambiar los condicionales
            if(!nearlyEnemie.itself.isDead){
                switch (orientation) {
                    case "U":
                        if((shootFocused.p1[0]>=nearlyEnemie.p2[0] && shootFocused.p1[1]<=nearlyEnemie.p2[1]
                            && shootFocused.p1[0]<=nearlyEnemie.p4[0] && shootFocused.p1[1]<=nearlyEnemie.p4[1]
                            && shootFocused.p1[0]>=nearlyEnemie.p1[0] && shootFocused.p1[1]>=nearlyEnemie.p1[1]
                            && shootFocused.p1[0]<=nearlyEnemie.p3[0] && shootFocused.p1[1]>=nearlyEnemie.p3[1])
                            || (shootFocused.p3[0]>=nearlyEnemie.p2[0] && shootFocused.p3[1]<=nearlyEnemie.p2[1]
                                && shootFocused.p3[0]<=nearlyEnemie.p4[0] && shootFocused.p3[1]<=nearlyEnemie.p4[1]
                                && shootFocused.p3[0]>=nearlyEnemie.p1[0] && shootFocused.p3[1]>=nearlyEnemie.p1[1]
                                && shootFocused.p3[0]<=nearlyEnemie.p3[0] && shootFocused.p3[1]>=nearlyEnemie.p3[1])){
                            colision = true;
                            console.log("Enemigo aliado: "+ shootFocused.itself.index+ " a enemigo aliado: "+nearlyEnemie.itself.index);
                        }
                        break;
                    case "R":
                        if((shootFocused.p3[0]>=nearlyEnemie.p1[0] && shootFocused.p3[1]>=nearlyEnemie.p1[1]
                            && shootFocused.p3[0]>=nearlyEnemie.p2[0] && shootFocused.p3[1]<=nearlyEnemie.p2[1]
                            && shootFocused.p3[0]<=nearlyEnemie.p3[0] && shootFocused.p3[1]>=nearlyEnemie.p3[1]
                            && shootFocused.p3[0]<=nearlyEnemie.p4[0] && shootFocused.p3[1]<=nearlyEnemie.p4[1])
                            || (shootFocused.p4[0]>=nearlyEnemie.p1[0] && shootFocused.p4[1]>=nearlyEnemie.p1[1]
                                && shootFocused.p4[0]>=nearlyEnemie.p2[0] && shootFocused.p4[1]<=nearlyEnemie.p2[1]
                                && shootFocused.p4[0]<=nearlyEnemie.p3[0] && shootFocused.p4[1]>=nearlyEnemie.p3[1]
                                && shootFocused.p4[0]<=nearlyEnemie.p4[0] && shootFocused.p4[1]<=nearlyEnemie.p4[1])){
                            colision = true;
                            console.log("Enemigo aliado: "+ shootFocused.itself.index+ " a enemigo aliado: "+nearlyEnemie.itself.index);
                        }
                        break;
                    case "D":
                        if((shootFocused.p2[0]>=nearlyEnemie.p1[0] && shootFocused.p2[1]>=nearlyEnemie.p1[1]
                            && shootFocused.p2[0]<=nearlyEnemie.p3[0] && shootFocused.p2[1]>=nearlyEnemie.p3[1]
                            && shootFocused.p2[0]>=nearlyEnemie.p2[0] && shootFocused.p2[1]<=nearlyEnemie.p2[1]
                            && shootFocused.p2[0]<=nearlyEnemie.p4[0] && shootFocused.p2[1]<=nearlyEnemie.p4[1])
                            || (shootFocused.p4[0]>=nearlyEnemie.p1[0] && shootFocused.p4[1]>=nearlyEnemie.p1[1]
                                && shootFocused.p4[0]<=nearlyEnemie.p3[0] && shootFocused.p4[1]>=nearlyEnemie.p3[1]
                                && shootFocused.p4[0]>=nearlyEnemie.p2[0] && shootFocused.p4[1]<=nearlyEnemie.p2[1]
                                && shootFocused.p4[0]<=nearlyEnemie.p4[0] && shootFocused.p4[1]<=nearlyEnemie.p4[1])){
                            colision = true;
                            console.log("Enemigo aliado: "+ shootFocused.itself.index+ " a enemigo aliado: "+nearlyEnemie.itself.index);
                        }
                        break;
                    case "L":
                        if((shootFocused.p1[0]<=nearlyEnemie.p3[0] && shootFocused.p1[1]>=nearlyEnemie.p3[1]
                            && shootFocused.p1[0]<=nearlyEnemie.p4[0] && shootFocused.p1[1]<=nearlyEnemie.p4[1]
                            && shootFocused.p1[0]>=nearlyEnemie.p1[0] && shootFocused.p1[1]>=nearlyEnemie.p1[1]
                            && shootFocused.p1[0]>=nearlyEnemie.p2[0] && shootFocused.p1[1]<=nearlyEnemie.p2[1])
                            || (shootFocused.p2[0]<=nearlyEnemie.p3[0] && shootFocused.p2[1]>=nearlyEnemie.p3[1]
                                && shootFocused.p2[0]<=nearlyEnemie.p4[0] && shootFocused.p2[1]<=nearlyEnemie.p4[1]
                                && shootFocused.p2[0]>=nearlyEnemie.p1[0] && shootFocused.p2[1]>=nearlyEnemie.p1[1]
                                && shootFocused.p2[0]>=nearlyEnemie.p2[0] && shootFocused.p2[1]<=nearlyEnemie.p2[1])){
                            colision = true;
                            console.log("Enemigo aliado: "+ shootFocused.itself.index+ " a enemigo aliado: "+nearlyEnemie.itself.index);
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        return colision;
    }

    this.enemieColision = function(shoot, orientation){
        const copyEnemies = listener.objList.slice();
        const shootFocused = shoot;
        let colision = false;
        const shoortSize = (sizeSection-(2*shortShoot));

        copyEnemies.forEach(function(nearlyEnemie){//Cambiar los condicionales
            if(!nearlyEnemie.itself.isDead){
                switch (orientation) {
                    case "U":
                        if((shootFocused.x>=nearlyEnemie.p2[0] && shootFocused.y<=nearlyEnemie.p2[1]
                            && shootFocused.x<=nearlyEnemie.p4[0] && shootFocused.y<=nearlyEnemie.p4[1]
                            && shootFocused.x>=nearlyEnemie.p1[0] && shootFocused.y>=nearlyEnemie.p1[1]
                            && shootFocused.x<=nearlyEnemie.p3[0] && shootFocused.y>=nearlyEnemie.p3[1])
                            || (shootFocused.x+shoortSize>=nearlyEnemie.p2[0] && shootFocused.y<=nearlyEnemie.p2[1]
                            && shootFocused.x+shoortSize<=nearlyEnemie.p4[0] && shootFocused.y<=nearlyEnemie.p4[1]
                            && shootFocused.x+shoortSize>=nearlyEnemie.p1[0] && shootFocused.y>=nearlyEnemie.p1[1]
                            && shootFocused.x+shoortSize<=nearlyEnemie.p3[0] && shootFocused.y>=nearlyEnemie.p3[1])){
                            colision = true;
                            listener.objList[nearlyEnemie.itself.index-1].itself.isDead = true;
                            listenerShoots.objList[nearlyEnemie.itself.index-1].itself.crashed = true;
                            console.log("Charizard a enemigo aliado: "+nearlyEnemie.itself.index);
                        }
                        break;
                    case "R":
                        if((shootFocused.x+largeShoot>=nearlyEnemie.p1[0] && shootFocused.y>=nearlyEnemie.p1[1]
                            && shootFocused.x+largeShoot>=nearlyEnemie.p2[0] && shootFocused.y<=nearlyEnemie.p2[1]
                            && shootFocused.x+largeShoot<=nearlyEnemie.p3[0] && shootFocused.y>=nearlyEnemie.p3[1]
                            && shootFocused.x+largeShoot<=nearlyEnemie.p4[0] && shootFocused.y<=nearlyEnemie.p4[1])
                            || (shootFocused.x+largeShoot>=nearlyEnemie.p1[0] && shootFocused.y+shoortSize>=nearlyEnemie.p1[1]
                            && shootFocused.x+largeShoot>=nearlyEnemie.p2[0] && shootFocused.y+shoortSize<=nearlyEnemie.p2[1]
                            && shootFocused.x+largeShoot<=nearlyEnemie.p3[0] && shootFocused.y+shoortSize>=nearlyEnemie.p3[1]
                            && shootFocused.x+largeShoot<=nearlyEnemie.p4[0] && shootFocused.y+shoortSize<=nearlyEnemie.p4[1])){
                            colision = true;
                            listener.objList[nearlyEnemie.itself.index-1].itself.isDead = true;
                            listenerShoots.objList[nearlyEnemie.itself.index-1].itself.crashed = true;
                            console.log("Charizard a enemigo aliado: "+nearlyEnemie.itself.index);
                        }
                        break;
                    case "D":
                        if((shootFocused.x>=nearlyEnemie.p1[0] && shootFocused.y+largeShoot>=nearlyEnemie.p1[1]
                            && shootFocused.x<=nearlyEnemie.p3[0] && shootFocused.y+largeShoot>=nearlyEnemie.p3[1]
                            && shootFocused.x>=nearlyEnemie.p2[0] && shootFocused.y+largeShoot<=nearlyEnemie.p2[1]
                            && shootFocused.x<=nearlyEnemie.p4[0] && shootFocused.y+largeShoot<=nearlyEnemie.p4[1])
                            || (shootFocused.x+shoortSize>=nearlyEnemie.p1[0] && shootFocused.y+largeShoot>=nearlyEnemie.p1[1]
                            && shootFocused.x+shoortSize<=nearlyEnemie.p3[0] && shootFocused.y+largeShoot>=nearlyEnemie.p3[1]
                            && shootFocused.x+shoortSize>=nearlyEnemie.p2[0] && shootFocused.y+largeShoot<=nearlyEnemie.p2[1]
                            && shootFocused.x+shoortSize<=nearlyEnemie.p4[0] && shootFocused.y+largeShoot<=nearlyEnemie.p4[1])){
                            colision = true;
                            listener.objList[nearlyEnemie.itself.index-1].itself.isDead = true;
                            listenerShoots.objList[nearlyEnemie.itself.index-1].itself.crashed = true;
                            console.log("Charizard a enemigo aliado: "+nearlyEnemie.itself.index);
                        }
                        break;
                    case "L":
                        if((shootFocused.x<=nearlyEnemie.p3[0] && shootFocused.y>=nearlyEnemie.p3[1]
                            && shootFocused.x<=nearlyEnemie.p4[0] && shootFocused.y<=nearlyEnemie.p4[1]
                            && shootFocused.x>=nearlyEnemie.p1[0] && shootFocused.y>=nearlyEnemie.p1[1]
                            && shootFocused.x>=nearlyEnemie.p2[0] && shootFocused.y<=nearlyEnemie.p2[1])
                            || (shootFocused.x<=nearlyEnemie.p3[0] && shootFocused.y+shoortSize>=nearlyEnemie.p3[1]
                            && shootFocused.x<=nearlyEnemie.p4[0] && shootFocused.y+shoortSize<=nearlyEnemie.p4[1]
                            && shootFocused.x>=nearlyEnemie.p1[0] && shootFocused.y+shoortSize>=nearlyEnemie.p1[1]
                            && shootFocused.x>=nearlyEnemie.p2[0] && shootFocused.y+shoortSize<=nearlyEnemie.p2[1])){
                            colision = true;
                            listener.objList[nearlyEnemie.itself.index-1].itself.isDead = true;
                            listenerShoots.objList[nearlyEnemie.itself.index-1].itself.crashed = true;
                            console.log("Charizard a enemigo aliado: "+nearlyEnemie.itself.index);
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        return colision;
    }
}

const shoot = function(){
    this.x;
    this.y;
    this.orientation;
    this.indexFather;
    this.velocity;
    this.crashed = false;
    this.isMain = false;
    this.color;

    this.createForEnemie = function(x,y,index, velocity, orientation){
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.indexFather = listenerShoots.addShoot(this,index);
        this.velocity = velocity;
        this.color = "#19A6C7";

        return this
    }

    this.createForMain = function(x,y, velocity, orientation){
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.velocity = velocity;
        this.isMain = true;
        this.color = "#FF0000";

        return this
    }

    this.colision = function(x,y){
        let colision = false;
        let idX, idY;
        
        idX = parseInt(x/sizeSection);
        idY = parseInt(y/sizeSection);

        if(idX<0 || idX>=sizeBG || idY<0 || idY>=sizeBG || tableG[idY][idX]==1) colision = true;

        return colision;
    }

    this.colisionObject = function(orientation){
        if(!this.isMain){
            return (listenerShoots.friendlyShootColision(this.indexFather, orientation) 
            || listenerShoots.friendlyEnemieColision(this.indexFather, orientation));
        } else{
            return (listenerShoots.shootColision(this, orientation) 
            || listenerShoots.enemieColision(this, orientation));
        }
    }

    this.up = function(){
        if(this.y>0 && !this.colision(this.x,this.y-1) && !this.colision(this.x+(sizeSection-(2*shortShoot))-1,this.y-1) 
            && !this.colisionObject("U")){
            this.y -= this.velocity;
        } else{
            this.crashed = true;
        }
    }

    this.down = function(){
        if(this.y+largeShoot<maxW_H_C && !this.colision(this.x,this.y+largeShoot+1) && !this.colision(this.x+(sizeSection-(2*shortShoot))-1,this.y+largeShoot+1)
        && !this.colisionObject("D")){
            this.y += this.velocity;
        } else{
            this.crashed = true;
        }
    }

    this.left = function(){
        if(this.x>0 && !this.colision(this.x-1,this.y) && !this.colision(this.x-1,this.y+(sizeSection-(2*shortShoot))-1)
        && !this.colisionObject("L")){
            this.x -= this.velocity;
        } else{
            this.crashed = true;
        }
    }

    this.right = function(){
        if(this.x+largeShoot<maxW_H_C && !this.colision(this.x+largeShoot,this.y) && !this.colision(this.x+largeShoot,this.y+(sizeSection-(2*shortShoot))-1)
        && !this.colisionObject("R")){
            this.x += this.velocity;
        } else{
            this.crashed = true;
        }
    }

    this.mainTouched = function(){
        let shootFocused = listenerShoots.objList[this.indexFather-1];

        switch (this.orientation) {
            case "U":
                if((shootFocused.p1[0]>=(objM.x) && shootFocused.p1[1]<=(objM.y+sizeSection)
                    && shootFocused.p1[0]<=(objM.x+sizeSection) && shootFocused.p1[1]<=(objM.y+sizeSection)
                    && shootFocused.p1[0]>=(objM.x) && shootFocused.p1[1]>=(objM.y)
                    && shootFocused.p1[0]<=(objM.x+sizeSection) && shootFocused.p1[1]>=(objM.y))
                    || (shootFocused.p3[0]>=(objM.x) && shootFocused.p1[1]<=(objM.y+sizeSection)
                    && shootFocused.p3[0]<=(objM.x+sizeSection) && shootFocused.p1[1]<=(objM.y+sizeSection)
                    && shootFocused.p3[0]>=(objM.x) && shootFocused.p1[1]>=(objM.y)
                    && shootFocused.p3[0]<=(objM.x+sizeSection) && shootFocused.p1[1]>=(objM.y))){
                    objM.resetMain();
                    listenerShoots.resetOwnShoot(shootFocused);
                    endGame(false);
                }
                break;
            case "R":
                if((shootFocused.p3[0]>=(objM.x) && shootFocused.p3[1]>=(objM.y)
                    && shootFocused.p3[0]>=(objM.x) && shootFocused.p3[1]<=(objM.y+sizeSection)
                    && shootFocused.p3[0]<=(objM.x+sizeSection) && shootFocused.p3[1]>=(objM.y)
                    && shootFocused.p3[0]<=(objM.x+sizeSection) && shootFocused.p3[1]<=(objM.y+sizeSection))
                    || (shootFocused.p4[0]>=(objM.x) && shootFocused.p4[1]>=(objM.y)
                    && shootFocused.p4[0]>=(objM.x) && shootFocused.p4[1]<=(objM.y+sizeSection)
                    && shootFocused.p4[0]<=(objM.x+sizeSection) && shootFocused.p4[1]>=(objM.y)
                    && shootFocused.p4[0]<=(objM.x+sizeSection) && shootFocused.p4[1]<=(objM.y+sizeSection))){
                    objM.resetMain();
                    listenerShoots.resetOwnShoot(shootFocused);
                    endGame(false);
                }
                break;
            case "D":
                if((shootFocused.p2[0]>=(objM.x) && shootFocused.p2[1]>=(objM.y)
                    && shootFocused.p2[0]<=(objM.x+sizeSection) && shootFocused.p2[1]>=(objM.y)
                    && shootFocused.p2[0]>=(objM.x) && shootFocused.p2[1]<=(objM.y+sizeSection)
                    && shootFocused.p2[0]<=(objM.x+sizeSection) && shootFocused.p2[1]<=(objM.y+sizeSection))
                    || (shootFocused.p4[0]>=(objM.x) && shootFocused.p4[1]>=(objM.y)
                    && shootFocused.p4[0]<=(objM.x+sizeSection) && shootFocused.p4[1]>=(objM.y)
                    && shootFocused.p4[0]>=(objM.x) && shootFocused.p4[1]<=(objM.y+sizeSection)
                    && shootFocused.p4[0]<=(objM.x+sizeSection) && shootFocused.p4[1]<=(objM.y+sizeSection))){
                    objM.resetMain();
                    listenerShoots.resetOwnShoot(shootFocused);
                    endGame(false);
                }
                break;
            case "L":
                if((shootFocused.p1[0]<=(objM.x+sizeSection) && shootFocused.p1[1]>=(objM.y)
                    && shootFocused.p1[0]<=(objM.x+sizeSection) && shootFocused.p1[1]<=(objM.y+sizeSection)
                    && shootFocused.p1[0]>=(objM.x) && shootFocused.p1[1]>=(objM.y)
                    && shootFocused.p1[0]>=(objM.x) && shootFocused.p1[1]<=(objM.y+sizeSection))
                    || (shootFocused.p2[0]<=(objM.x+sizeSection) && shootFocused.p2[1]>=(objM.y)
                    && shootFocused.p2[0]<=(objM.x+sizeSection) && shootFocused.p2[1]<=(objM.y+sizeSection)
                    && shootFocused.p2[0]>=(objM.x) && shootFocused.p2[1]>=(objM.y)
                    && shootFocused.p2[0]>=(objM.x) && shootFocused.p2[1]<=(objM.y+sizeSection))){
                    objM.resetMain();
                    listenerShoots.resetOwnShoot(shootFocused);
                    endGame(false);
                }
                break;
            default:
                break;
        }
    }

    this.move = function(){
        switch (this.orientation) {
            case "U":
                this.up();
                break;
            case "D":
                this.down();   
                break;
            case "L":
                this.left();
                break;
            case "R":
                this.right();
                break;
            default:
                break;
        }
        if(!this.isMain){
            listenerShoots.updatePositions(this.indexFather,this.x,this.y,this.orientation);
            this.mainTouched();
        }
    }

    this.draw = function(){
        ctx.fillStyle = this.color;
        switch (this.orientation) {
            case "U":
                ctx.fillRect((this.x),this.y,(sizeSection-(2*shortShoot)),largeShoot);
                break;
            case "D":
                ctx.fillRect((this.x),this.y,(sizeSection-(2*shortShoot)),largeShoot);
                break;
            case "L":
                ctx.fillRect((this.x),(this.y),largeShoot,(sizeSection-(2*shortShoot)));
                break;
            case "R":
                ctx.fillRect((this.x),(this.y),largeShoot,(sizeSection-(2*shortShoot)));
                break;
        }
        
    }
}

const enemieObj = function(x,y,img){
    this.x = x;
    this.y = y;
    this.img = img;
    this.index = listener.addEnemie(this);
    this.space = 4;
    this.orientation = "D";
    this.ownShoot = new shoot().createForEnemie(this.x+shortShoot,this.y+sizeSection,this.index,this.space+2,this.orientation);
    this.existingShoot = true;
    this.count = waitingTimeShoot;
    this.isDead = false;

    this.colision = function(x,y){
        let colision = false;
        let idX, idY;
        
        idX = parseInt(x/sizeSection);
        idY = parseInt(y/sizeSection);

        if(idX<0 || idX>=sizeBG || idY<0 || idY>=sizeBG || tableG[idY][idX]==1) colision = true;

        return colision;
    }

    this.removeDataFromArray = function(value, arrayList){
        let idx = arrayList.indexOf(value);
        arrayList.splice(idx,1);
    }

    this.up = function(){
        let orientations = ["U","R","L"];
        let colisionU = false, colisionR = false, colisionL = false;

        if(this.y>0 && !this.colision(this.x,this.y-1) && !this.colision(this.x+sizeSection-1,this.y-1) 
            && !listener.friendlyColision(this.index, "U")){
            this.y -= this.space;
        } else{
            colisionU = true;
        }

        colisionR = (this.x+sizeSection>=maxW_H_C || this.colision(this.x+sizeSection,this.y) || this.colision(this.x+sizeSection,this.y+sizeSection-1) || listener.friendlyColision(this.index, "R"));
        colisionL = (this.x<=0 || this.colision(this.x-1,this.y) || this.colision(this.x-1,this.y+sizeSection-1) || listener.friendlyColision(this.index, "L"));

        if(colisionU){
            this.removeDataFromArray("U", orientations);
        }
        if(colisionR){
            this.removeDataFromArray("R", orientations);
        }
        if(colisionL){
            this.removeDataFromArray("L", orientations);
        }
        if(listener.friendlyColision(this.index, "U"))
            orientations.push("D");
        
        if(orientations.length<=0)
            orientations.push("D");

        this.orientation = orientations[Math.floor(Math.random()*orientations.length)];
    }

    this.down = function(){
        let orientations = ["D","R","L"];
        let colisionD = false, colisionR = false, colisionL = false;

        if(this.y+sizeSection<maxW_H_C && !this.colision(this.x,this.y+sizeSection+1) && !this.colision(this.x+sizeSection-1,this.y+sizeSection+1)
            && !listener.friendlyColision(this.index, "D")){
            this.y += this.space;
        } else{
            colisionD = true;
        }

        colisionR = (this.x+sizeSection>=maxW_H_C || this.colision(this.x+sizeSection,this.y) || this.colision(this.x+sizeSection,this.y+sizeSection-1) || listener.friendlyColision(this.index, "R"));
        colisionL = (this.x<=0 || this.colision(this.x-1,this.y) || this.colision(this.x-1,this.y+sizeSection-1) || listener.friendlyColision(this.index, "L"));

        if(colisionD){
            this.removeDataFromArray("D", orientations);
        }
        if(colisionR){
            this.removeDataFromArray("R", orientations);
        }
        if(colisionL){
            this.removeDataFromArray("L", orientations);
        }
        if(listener.friendlyColision(this.index, "D"))
            orientations.push("U");

        if(orientations.length<=0)
            orientations.push("U");

        this.orientation = orientations[Math.floor(Math.random()*orientations.length)];
    }

    this.left = function(){
        let orientations = ["L","U","D"];
        let colisionL = false, colisionU = false, colisionD = false;
        
        if(this.x>0 && !this.colision(this.x-1,this.y) && !this.colision(this.x-1,this.y+sizeSection-1)
            && !listener.friendlyColision(this.index, "L")){
            this.x -= this.space;
        } else{
            colisionL = true;
        }

        colisionU = (this.y<=0 || this.colision(this.x,this.y-1) || this.colision(this.x+sizeSection-1,this.y-1) || listener.friendlyColision(this.index, "U"));
        colisionD = (this.y+sizeSection>=maxW_H_C || this.colision(this.x,this.y+sizeSection+1) || this.colision(this.x+sizeSection-1,this.y+sizeSection+1) || listener.friendlyColision(this.index, "D"));

        if(colisionL){
            this.removeDataFromArray("L", orientations);
        }
        if(colisionU){
            this.removeDataFromArray("U", orientations);
        }
        if(colisionD){
            this.removeDataFromArray("D", orientations);
        }
        if(listener.friendlyColision(this.index, "L"))
            orientations.push("R");

        if(orientations.length<=0)
            orientations.push("R");

        this.orientation = orientations[Math.floor(Math.random()*orientations.length)];
    }

    this.right = function(){
        let orientations = ["R","U","D"];
        let colisionR = false, colisionU = false, colisionD = false;
        
        if(this.x+sizeSection<maxW_H_C && !this.colision(this.x+sizeSection,this.y) && !this.colision(this.x+sizeSection,this.y+sizeSection-1)
            && !listener.friendlyColision(this.index, "R")){
            this.x += this.space;
        } else{
            colisionR = true;
        }

        colisionU = (this.y<=0 || this.colision(this.x,this.y-1) || this.colision(this.x+sizeSection-1,this.y-1) || listener.friendlyColision(this.index, "U"));
        colisionD = (this.y+sizeSection>=maxW_H_C || this.colision(this.x,this.y+sizeSection+1) || this.colision(this.x+sizeSection-1,this.y+sizeSection+1) || listener.friendlyColision(this.index, "D"));

        if(colisionR){
            this.removeDataFromArray("R", orientations);
        }
        if(colisionU){
            this.removeDataFromArray("U", orientations);
        }
        if(colisionD){
            this.removeDataFromArray("D", orientations);
        }
        if(listener.friendlyColision(this.index, "R"))
            orientations.push("L");

        if(orientations.length<=0)
            orientations.push("L");

        this.orientation = orientations[Math.floor(Math.random()*orientations.length)];
    }

    this.mainTouched = function(){
        let enemieFocused = listener.objList[this.index-1];

        switch (this.orientation) {
            case "U":
                if((enemieFocused.p1[0]>=(objM.x) && enemieFocused.p1[1]<=(objM.y+sizeSection)
                    && enemieFocused.p1[0]<=(objM.x+sizeSection) && enemieFocused.p1[1]<=(objM.y+sizeSection)
                    && enemieFocused.p1[0]>=(objM.x) && enemieFocused.p1[1]>=(objM.y)
                    && enemieFocused.p1[0]<=(objM.x+sizeSection) && enemieFocused.p1[1]>=(objM.y))
                    || (enemieFocused.p3[0]>=(objM.x) && enemieFocused.p1[1]<=(objM.y+sizeSection)
                    && enemieFocused.p3[0]<=(objM.x+sizeSection) && enemieFocused.p1[1]<=(objM.y+sizeSection)
                    && enemieFocused.p3[0]>=(objM.x) && enemieFocused.p1[1]>=(objM.y)
                    && enemieFocused.p3[0]<=(objM.x+sizeSection) && enemieFocused.p1[1]>=(objM.y))){
                    objM.resetMain();
                    endGame(false);
                    //listenerShoots.resetOwnShoot(shootFocused);
                }
                break;
            case "R":
                if((enemieFocused.p3[0]>=(objM.x) && enemieFocused.p3[1]>=(objM.y)
                    && enemieFocused.p3[0]>=(objM.x) && enemieFocused.p3[1]<=(objM.y+sizeSection)
                    && enemieFocused.p3[0]<=(objM.x+sizeSection) && enemieFocused.p3[1]>=(objM.y)
                    && enemieFocused.p3[0]<=(objM.x+sizeSection) && enemieFocused.p3[1]<=(objM.y+sizeSection))
                    || (enemieFocused.p4[0]>=(objM.x) && enemieFocused.p4[1]>=(objM.y)
                    && enemieFocused.p4[0]>=(objM.x) && enemieFocused.p4[1]<=(objM.y+sizeSection)
                    && enemieFocused.p4[0]<=(objM.x+sizeSection) && enemieFocused.p4[1]>=(objM.y)
                    && enemieFocused.p4[0]<=(objM.x+sizeSection) && enemieFocused.p4[1]<=(objM.y+sizeSection))){
                    objM.resetMain();
                    endGame(false);
                    //listenerShoots.resetOwnShoot(shootFocused);
                }
                break;
            case "D":
                if((enemieFocused.p2[0]>=(objM.x) && enemieFocused.p2[1]>=(objM.y)
                    && enemieFocused.p2[0]<=(objM.x+sizeSection) && enemieFocused.p2[1]>=(objM.y)
                    && enemieFocused.p2[0]>=(objM.x) && enemieFocused.p2[1]<=(objM.y+sizeSection)
                    && enemieFocused.p2[0]<=(objM.x+sizeSection) && enemieFocused.p2[1]<=(objM.y+sizeSection))
                    || (enemieFocused.p4[0]>=(objM.x) && enemieFocused.p4[1]>=(objM.y)
                    && enemieFocused.p4[0]<=(objM.x+sizeSection) && enemieFocused.p4[1]>=(objM.y)
                    && enemieFocused.p4[0]>=(objM.x) && enemieFocused.p4[1]<=(objM.y+sizeSection)
                    && enemieFocused.p4[0]<=(objM.x+sizeSection) && enemieFocused.p4[1]<=(objM.y+sizeSection))){
                    objM.resetMain();
                    endGame(false);
                    //listenerShoots.resetOwnShoot(shootFocused);
                }
                break;
            case "L":
                if((enemieFocused.p1[0]<=(objM.x+sizeSection) && enemieFocused.p1[1]>=(objM.y)
                    && enemieFocused.p1[0]<=(objM.x+sizeSection) && enemieFocused.p1[1]<=(objM.y+sizeSection)
                    && enemieFocused.p1[0]>=(objM.x) && enemieFocused.p1[1]>=(objM.y)
                    && enemieFocused.p1[0]>=(objM.x) && enemieFocused.p1[1]<=(objM.y+sizeSection))
                    || (enemieFocused.p2[0]<=(objM.x+sizeSection) && enemieFocused.p2[1]>=(objM.y)
                    && enemieFocused.p2[0]<=(objM.x+sizeSection) && enemieFocused.p2[1]<=(objM.y+sizeSection)
                    && enemieFocused.p2[0]>=(objM.x) && enemieFocused.p2[1]>=(objM.y)
                    && enemieFocused.p2[0]>=(objM.x) && enemieFocused.p2[1]<=(objM.y+sizeSection))){
                    objM.resetMain();
                    endGame(false);
                    //listenerShoots.resetOwnShoot(shootFocused);
                }
                break;
            default:
                break;
        }
    }

    this.move = function(){
        switch (this.orientation) {
            case "U":
                this.up();
                break;
            case "R":
                this.right();
                break;
            case "D":
                this.down();
                break;
            case "L":
                this.left();
                break;
            default:
                break;
        }
        listener.updatePositions(this.index,this.x,this.y);
        this.mainTouched();
    }

    this.resetShoot = function(){
        if(this.count==0){
            switch (this.orientation) {
                case "U":
                    this.ownShoot = new shoot().createForEnemie(this.x+shortShoot,this.y-largeShoot,this.index,this.space+2,this.orientation);
                    break;
                case "R":
                    this.ownShoot = new shoot().createForEnemie(this.x+sizeSection,this.y+shortShoot,this.index,this.space+2,this.orientation);
                    break;
                case "D":
                    this.ownShoot = new shoot().createForEnemie(this.x+shortShoot,this.y+sizeSection,this.index,this.space+2,this.orientation);
                    break;
                case "L":
                    this.ownShoot = new shoot().createForEnemie(this.x-largeShoot,this.y+shortShoot,this.index,this.space+2,this.orientation);
                    break;
                default:
                    break;
            }
            this.existingShoot = true;
            this.count = waitingTimeShoot;
        } else this.count--;
    }
    
    this.draw = function(){
        ctx.drawImage(this.img,(this.x+(parseInt(sizeSection*.1))),(this.y+(parseInt(sizeSection*.1))),
            (sizeSection-(2*(parseInt(sizeSection*.1)))),(sizeSection-(2*(parseInt(sizeSection*.1)))));
        
        if(this.existingShoot){
            this.ownShoot.draw();
            this.ownShoot.move();
            if(this.ownShoot.crashed){
                this.ownShoot = null;
                this.existingShoot =false;
            }
        } else this.resetShoot();
        this.move();
    }
}

var mainObj = function(){
    this.x = 0;
    this.y = sizeSection*(sizeBG-1);
    this.space = 4;
    this.orientation;
    this.nextOrientation;
    this.posibleOrientation;
    this.isAchieveReorientation = false;
    this.isKeepGoing = false;
    this.ownShoot;
    this.existingShoot = false;

    this.resetMain = function(){
        this.x = 0;
        this.y = sizeSection*(sizeBG-1);
        this.space = 4;
    }

    this.createShoot = function(){
        if(this.orientation && !this.existingShoot){
            switch (this.orientation) {
                case "U":
                    this.ownShoot = new shoot().createForMain(this.x+shortShoot,this.y-largeShoot,6,this.orientation);
                    break;
                case "R":
                    this.ownShoot = new shoot().createForMain(this.x+sizeSection,this.y+shortShoot,6,this.orientation);
                    break;
                case "D":
                    this.ownShoot = new shoot().createForMain(this.x+shortShoot,this.y+sizeSection,6,this.orientation);
                    break;
                case "L":
                    this.ownShoot = new shoot().createForMain(this.x-largeShoot,this.y+shortShoot,6,this.orientation);
                    break;
                default:
                    break;
            }
            this.existingShoot = true;
        }
    }

    this.colision = function(x,y){
        let colision = false;

        if(tableG[parseInt(y/sizeSection)][parseInt(x/sizeSection)]==1) colision = true;

        return colision;
    }

    this.proceedToMove = function(orientation){
        //if(this.isKeepGoing){
            switch (orientation) {
                case "U":
                    this.y -= this.space;                    
                    break;
                case "D":
                    this.y += this.space;
                    break;
                case "L":
                    this.x -= this.space;
                    break;
                case "R":
                    this.x += this.space;
                    break;
                default:
                    break;
            }
            this.orientation = orientation;
            /*this.nextOrientation = orientation;*/
        //}
/*
        if(this.posibleOrientation==this.orientation && !this.isAchieveReorientation){
            this.isAchieveReorientation = true;
            this.isKeepGoing = true;
        }
        if(this.posibleOrientation && this.posibleOrientation!=this.orientation && this.isKeepGoing){
            this.isKeepGoing = false;
        }*/
    }

    this.up = function(){
        if(this.y>0 && !this.colision(this.x,this.y-1) && !this.colision(this.x+sizeSection-1,this.y-1)){
            this.proceedToMove("U");
        } else{/*
            this.nextOrientation = this.orientation;

            if(this.posibleOrientation && this.posibleOrientation!=this.orientation && !this.isKeepGoing){
                this.isKeepGoing = true;
            }*/
        }
    }

    this.down = function(){
        if(this.y+sizeSection<maxW_H_C && !this.colision(this.x,this.y+sizeSection+1) && !this.colision(this.x+sizeSection-1,this.y+sizeSection+1)){
            this.proceedToMove("D");
        } else{/*
            this.nextOrientation = this.orientation;

            if(this.posibleOrientation && this.posibleOrientation!=this.orientation && !this.isKeepGoing){
                this.isKeepGoing = true;
            }*/
        }
    }

    this.left = function(){
        if(this.x>0 && !this.colision(this.x-1,this.y) && !this.colision(this.x-1,this.y+sizeSection-1)){
            this.proceedToMove("L");
        } else{/*
            this.nextOrientation = this.orientation;

            if(this.posibleOrientation && this.posibleOrientation!=this.orientation && !this.isKeepGoing){
                this.isKeepGoing = true;
            }*/
        }
    }

    this.right = function(){
        if(this.x+sizeSection<maxW_H_C && !this.colision(this.x+sizeSection,this.y) && !this.colision(this.x+sizeSection,this.y+sizeSection-1)){
            this.proceedToMove("R");
        } else{/*
            this.nextOrientation = this.orientation;

            if(this.posibleOrientation && this.posibleOrientation!=this.orientation && !this.isKeepGoing){
                this.isKeepGoing = true;
            }*/
        }
    }

    this.move = function(){
        let direction;
/*
        if(this.orientation && (!this.posibleOrientation || this.isKeepGoing)){
            direction = this.nextOrientation;
        } else if((this.posibleOrientation */
            //&& (!this.orientation || (this.posibleOrientation!=this.orientation && !this.isKeepGoing)))){
            direction = this.posibleOrientation;/*
            this.isKeepGoing = true;
        }*/

        switch (direction) {
            case "U":
                this.up();
                break;
            case "R":
                this.right();
                break;
            case "D":
                this.down();
                break;
            case "L":
                this.left();
                break;
            default:
                break;
        }
/*
        if(this.isAchieveReorientation){
            this.posibleOrientation = null;
        }*/
    }
    
    this.draw = function(){
        ctx.drawImage(imgObjM,this.x,this.y,sizeSection,sizeSection);

        if(this.existingShoot){
            this.ownShoot.draw();
            this.ownShoot.move();
            if(this.ownShoot.crashed){
                this.ownShoot = null;
                this.existingShoot =false;
            }
        }
        //this.move();
    }
}
/* Fin Objetos*/

function drawTable(){
    for (let iy = 0; iy < sizeBG; iy++) {
        for (let ix = 0; ix < sizeBG; ix++) {
            let value = tableG[iy][ix];

            if(value!=0) ctx.fillStyle = "#062D80";
            else ctx.fillStyle = "#5E5897";

            ctx.fillRect(ix*sizeSection,iy*sizeSection,sizeSection,sizeSection);
        }        
    }
};

function createEnemiesG(){
    let imgs = 0;
    for (let index = 0; index < maxEnemies; index++) {
        let a = index*2*sizeSection;
        new enemieObj(a,0,imgObjE);
    }
};

function loadOrientation(orientation){
    let value, objectValue;
    let margin;
    switch (orientation) {
        case "U":
            objectValue = objM.y;
            value = 0;
            margin = objectValue>value;
            break;
        case "R":
            objectValue = objM.x;
            value = maxW_H_C-sizeSection;
            margin = objectValue<value;
            break;
        case "D":
            objectValue = objM.y;
            value = maxW_H_C-sizeSection;
            margin = objectValue<value;
            break;
        case "L":
            objectValue = objM.x;
            value = 0;
            margin = objectValue>value;
            break;
        default:
            break;
    }

    //if((!objM.posibleOrientation && !objM.orientation) || (objM.orientation!=orientation && margin)){
        objM.posibleOrientation = orientation;
        /*objM.isAchieveReorientation = false;
        objM.isKeepGoing = false;
    }*/
}

function up(){
    //loadOrientation("U");
    objM.up();
}

function down(){
    //loadOrientation("D");
    objM.down();
}

function left(){
    //loadOrientation("L");
    objM.left();
}

function right(){
    //loadOrientation("R");
    objM.right();
}

function space(){
    //loadOrientation("R");
    objM.createShoot();
}

function startGame(){
    hasStarted = true;
}

function resetGame(){
    if(isGameEnded){
        isGameEnded = false;
        hasStarted = true;
        hasWon = false;
        tableG = createTableGame();
        
        initiate();
    }
}
/*
keywordEvent.simple_combo("up", up);
keywordEvent.simple_combo("down", down);
keywordEvent.simple_combo("left", left);
keywordEvent.simple_combo("right", right);*/
keywordEvent.simple_combo("enter", startGame);
keywordEvent.simple_combo("space", space);
keywordEvent.simple_combo("r", resetGame);

function resetTable(){
    canvas.width=maxW_H_C;
    canvas.height=maxW_H_C;
}

function main(){
    let allEnemiesDead = true;
    resetTable();
    drawTable();

    if (keys[39]) {
        right();
    }
    if (keys[37]) {
        left();
    }
    if (keys[40]) {     
        down();
    }
    if (keys[38]) {
        up();
    }

    objM.draw();
        
    listener.objList.forEach(function(obj){
        if(!obj.itself.isDead){
            obj.itself.draw();
            allEnemiesDead = false;
        }
    });

    if(allEnemiesDead){
        endGame(true);
    }
}

function initiate(){
    canvas = document.getElementById("contenedor");
    ctx = canvas.getContext("2d");
    canvas.style.width = maxW_H_C;
    canvas.style.height = maxW_H_C;

    /*Instancia de Objetos*/
    listener = new objListener();
    listenerShoots = new objListenerShoots();
    objM = new mainObj();
    keys = {};
    /*
    objE = new enemieObj(0,0,imgObjE);
    objE2 = new enemieObj(180,0,imgObjP);
    objE3 = new enemieObj(360,0,imgObjQ);
    */
    /*Fin Instancia de Objetos*/

    document.addEventListener('keydown', function(event){
        keys[event.which] = true;
    });
    document.addEventListener('keyup', function(event){
        delete keys[event.which];
    });
/*
    $(document).keydown(function(event){
        keys[event.which] = true;
      }).keyup(function(event){
        delete keys[event.which];
      });
*/
    createEnemiesG();
    
            let interval = setInterval(function(){
                if(!isGameEnded && hasStarted){
                    main();
                } else if(isGameEnded){
                    clearInterval(interval);

                    if(hasWon){
                        alert("Has ganado, pasarás al siguiente nivel");
                    } else{
                        alert("Has perdido con "+nivelesSuperados+" juegos ganados");
                        nivelesSuperados=0;
                    }
                    resetGame();
                }
            },1000/FPS);
    console.log("Adios!");
}