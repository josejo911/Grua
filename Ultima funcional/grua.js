// Listener de la ventana
window.addEventListener('DOMContentLoaded', function(){
    var canvas = document.getElementById('canvas');    
    //2 puerta = 3

    // 0 tronco, 2 puerta, casa 6 , 11arbol
    //              0      1       2      3       4     5          6       7       8      9     10      11      12     13      14
    //             grua  barco  puerto  reja   cuerda  cont   plataforma  cont   cont   cont   cont   horiz    disco   avion   mastil
    var Objetos = [7,      1,      5,     3,     11 ,      0,       2,       4,     6,     15,    16,    10,     9,      17	 , 13];
    var elementos = [];
    var seleccion = 0;
    var hold_1 = false;
    var hold_2 = false;
    var hold_3 = false;
    var hold_4 = false;
    var hold_5 = false;

    var garra_libre = true;

    // Iniciar babylon engine
    var engine = new BABYLON.Engine(canvas, true);
    engine.enableOfflineSupport = false; // Dont require a manifest file

    // Inicializacion de escena
    var createScene = function(){
        var scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.ArcRotateCamera("arcCam", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(90), 20.0, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas,true);
        var light = new BABYLON.HemisphericLight("ligth1", new BABYLON.Vector3(0,1,0), scene);
        var light = new BABYLON.PointLight("PointLight", new BABYLON.Vector3(0,0,0), scene);        
        light.parent = camera;
        light.intensity = 1;             // cargar modelo babylon
        BABYLON.SceneLoader.ImportMesh("","","boat.babylon", scene, function(newMeshes) { newMeshes.forEach( function(mesh) { elementos.push(mesh); }); } );       


        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

  

        // Water
        var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, scene, false);
    
        var water = new BABYLON.WaterMaterial("water", scene);
        water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);
        
        // Water properties
        water.windForce = -15;
        //alto de las olas
        water.waveHeight = 0.1
        water.windDirection = new BABYLON.Vector2(1, 1);
        water.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
        water.colorBlendFactor = 0.3;
        water.bumpHeight = 0.1;
        water.waveLength = 0.1;
    
        // Add skybox and ground to the reflection and refraction
        water.addToRenderList(skybox);
        
    
        // Assign the water material
        waterMesh.material = water;

        return scene;
    }


    // Crear escena 
    var scene = createScene();

    var camaralibre = new BABYLON.ArcRotateCamera("libre", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(90), 20.0, BABYLON.Vector3.Zero(), scene);

    var camaraB = new BABYLON.FollowCamera("camaraBote", new BABYLON.Vector3(45,45,45),scene);
   
    var camaraG = new BABYLON.FollowCamera("camaraGrua", new BABYLON.Vector3(0,40,-45),scene);
    

    scene.actionManager = new BABYLON.ActionManager(scene);
    var rotate = function (mesh) {
        scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, mesh, "rotation.y", 0.01));
    }

    // Al precionar boton
    var onKeyDown = function(evt) {
    	//BARCO
        //movimientos del barco
    	//a izquierda
        console.log(elementos);
    	if (evt.keyCode == 65)	{
            if (!elementos[Objetos[2]].intersectsMesh(elementos[Objetos[3]])){
                var vector = new BABYLON.Vector3(1, 0, 0);          
                Traslacion(elementos[Objetos[1]], vector);   
            }
    		
    	}
        //d derecha
        else if (evt.keyCode == 68)  {
            var vector = new BABYLON.Vector3(-1, 0, 0);          
            Traslacion(elementos[Objetos[1]], vector);
        }
        //w arriba
        else if (evt.keyCode == 87)  {
            var vector = new BABYLON.Vector3(0, 0, -1);          
            Traslacion(elementos[Objetos[1]], vector);
        }
        //s abajo
        else if (evt.keyCode == 83)  {
            var vector = new BABYLON.Vector3(0, 0, 1);          
            Traslacion(elementos[Objetos[1]], vector);
        }
        //GRUA

        //j
        else if (evt.keyCode == 74)  {
            var vector = new BABYLON.Vector3(1, 0, 0);          
            Traslacion(elementos[Objetos[0]], vector);
        }

        //l derecha
        else if (evt.keyCode == 76)  {
            var vector = new BABYLON.Vector3(-1, 0, 0);          
            Traslacion(elementos[Objetos[0]], vector);
        }
        //i arriba
        else if (evt.keyCode == 73)  {
            var vector = new BABYLON.Vector3(0, 0, -1);          
            Traslacion(elementos[Objetos[0]], vector);
        }
        //ROTAR GRUA 
        else if (evt.keyCode == 86) {
          
            Rotacion(elementos[Objetos[0]], BABYLON.Axis.Y);
            //Rotacion(elementos[Objetos[4]], BABYLON.Axis.X);
                          
                
                
        }
        

        //AGARRAR CONTENEDORES 

        else if (evt.keyCode == 75)  {
            var vector = new BABYLON.Vector3(0, 0, 1);          
            Traslacion(elementos[Objetos[0]], vector);
        } 

        


        //bajar

        else if (evt.keyCode == 78)  {

        	// if (!elementos[Objetos[12]].intersectsMesh(elementos[Objetos[5]])&& !elementos[Objetos[12]].intersectsMesh(elementos[Objetos[7]])&& !elementos[Objetos[12]].intersectsMesh(elementos[Objetos[8]])&&!elementos[Objetos[12]].intersectsMesh(elementos[Objetos[9]])&&!elementos[Objetos[12]].intersectsMesh(elementos[Objetos[10]])){
         //        	var vector = new BABYLON.Vector3(0, -1, 0);          
         //        	Traslacion(elementos[Objetos[4]], vector);
         //        	Traslacion(elementos[Objetos[12]], vector);   
         //    	}
            console.log(elementos[Objetos[12]].position.y);
        	if(elementos[Objetos[12]].position.y>-4.200 && elementos[Objetos[12]].position.y<15.88){
        		
                var vector = new BABYLON.Vector3(0,-1,0);
                Traslacion(elementos[Objetos[4]], vector);
        		Traslacion(elementos[Objetos[12]], vector);

        		if (hold_1){
                	var vector = new BABYLON.Vector3(0, -1, 0);          
    
                	Traslacion(elementos[Objetos[5]],vector);
            	}	

            	if (hold_2){
            		var vector = new BABYLON.Vector3(0,-1,0);
            		Traslacion(elementos[Objetos[7]],vector);
            	}
            	if (hold_3){
            		var vector = new BABYLON.Vector3(0,-1,0);
            		Traslacion(elementos[Objetos[8]],vector);
           		}
            	if (hold_4){
            		var vector = new BABYLON.Vector3(0,-1,0);
            		Traslacion(elementos[Objetos[9]],vector);
            	}
            	if (hold_5){
            		var vector = new BABYLON.Vector3(0,-1,0);
            		Traslacion(elementos[Objetos[10]],vector);
            	}
            	
            	// levantar contenedores
            	if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[5]])){
                	hold_1 = true;
                	hold_2 = false;
                	hold_3 = false;
                	hold_4 = false;
                	hold_5 = false;
                	garra_libre = false;
                	//solo para el if que estoy usando
                	let xtemporal = elementos[Objetos[12]].position.x;
                	let ztemporal = elementos[Objetos[12]].position.z;
                	let ytemporal = elementoa[Objetos[12]].position.y;
                	//setearlo como parent del contenedor la grua
                	elementos[Objetos[5]].parent = elementos[Objetos[0]];
                	//ponerle al contenedor la posicion del temporal de no se que 
                	elementos[Objetos[5]].position.x = xtemporal +1;
                	elementos[Objetos[5]].position.z = ztemporal;
                	elementos[Objetos[5]].position.y = ytemporal+ 1.1;
              
                	console.log("cont1");
            	}
            	if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[7]])){
            		hold_2 = true;
            		hold_1 = false;
            		hold_3 = false;
            		hold_4 = false;
            		hold_5 = false;
            		garra_libre = false;
            		//solo para el if que estoy usando
                	let xtemporal = elementos[Objetos[12]].position.x;
                	let ztemporal = elementos[Objetos[12]].position.z;
                	let ytemporal = elementos[Objetos[12]].position.y;
                	//setearlo como parent del contenedor la grua
                	elementos[Objetos[7]].parent = elementos[Objetos[0]];
                	//ponerle al contenedor la posicion del temporal de no se que 
                	elementos[Objetos[7]].position.x = xtemporal + 1;
                	elementos[Objetos[7]].position.z = ztemporal;
                	elementos[Objetos[7]].position.y = ytemporal + 1.1;
            		
            		console.log("cont2");
            	}

            	// funciona 
           		if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[8]])){
            		hold_3 = true;
            		hold_1 = false;
            		hold_2 = false;
            		hold_4 = false;
            		hold_5 = false;
            		garra_libre = false;

            		//solo para el if que estoy usando
                	let xtemporal = elementos[Objetos[12]].position.x;
                	let ztemporal = elementos[Objetos[12]].position.z;
                	let ytemporal = elementos[Objetos[12]].position.y;
                	//setearlo como parent del contenedor la grua
                	elementos[Objetos[8]].parent = elementos[Objetos[0]];
                	//ponerle al contenedor la posicion del temporal de no se que 
                	elementos[Objetos[8]].position.x = xtemporal + 1;
                	elementos[Objetos[8]].position.z = ztemporal;
                	elementos[Objetos[8]].position.y = ytemporal + 1.1;
            		
            		console.log("cont3");
            	}
            	if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[9]])){
            		hold_4 = true;
            		hold_1 = false;
            		hold_2 = false;
                	hold_3 = false;
                	hold_5 = false;
                	garra_libre = false;

                	//solo para el if que estoy usando
                	let xtemporal = elementos[Objetos[12]].position.x;
                	let ztemporal = elementos[Objetos[12]].position.z;
                	let ytemporal = elementos[Objetos[12]].position.y;
                	//setearlo como parent del contenedor la grua
                	elementos[Objetos[9]].parent = elementos[Objetos[0]];
                	//ponerle al contenedor la posicion del temporal de no se que 
                	elementos[Objetos[9]].position.x = xtemporal + 1;
                	elementos[Objetos[9]].position.z = ztempora;
                	elementos[Objetos[9]].position.y = ytemporal + 1.1;
            		console.log("cont4");
            	}
            	if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[10]])){
            		hold_5 = true;
            		hold_2 = false;
                	hold_3 = false;
                	hold_4 = false;
                	hold_1 = false;
                	garra_libre = false;


                	//solo para el if que estoy usando
                	let xtemporal = elementos[Objetos[12]].position.x;
                	let ztemporal = elementos[Objetos[12]].position.z;
                	let ytemporal = elementos[Objetos[12]].position.y;
                	//setearlo como parent del contenedor la grua
                	elementos[Objetos[10]].parent = elementos[Objetos[0]];
                	//ponerle al contenedor la posicion del temporal de no se que 
                	elementos[Objetos[10]].position.x = xtemporal + 1;
                	elementos[Objetos[10]].position.z = ztemporal;
                	elementos[Objetos[10]].position.y = ytemporal + 1.1;

            		console.log("cont5");
            	} 
            } 
        }


        //subir 
        else if (evt.keyCode == 77)  {

        	if(elementos[Objetos[12]].position.y>4.68 && elementos[Objetos[12]].position.y<15.88){
        		var vector = new BABYLON.Vector3(0,1,0);
        		Traslacion(elementos[Objetos[12]], vector);

        	}	




        	if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[5]])){
                	hold_1 = true;
                	hold_2 = false;
                	hold_3 = false;
                	hold_4 = false;
                	hold_5 = false;
                	if (evt.keyCode == 66){
                		hold_1 = false;
                	}
                	console.log("cont1");
            	}
            	else if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[7]])){
            		hold_2 = true;
            		hold_1 = false;
            		hold_3 = false;
            		hold_4 = false;
            		hold_5 = false;
            		if (evt.keyCode == 66){
                		hold_2 = false;
                	}
            		console.log("cont2");
            	}
           		else if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[8]])){
            		hold_3 = true;
            		hold_1 = false;
            		hold_2 = false;
            		hold_4 = false;
            		hold_5 = false;
            		if (evt.keyCode == 66){
                		hold_3 = false;
                	}
            		console.log("cont3");
            	}
            	else if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[9]])){
            		hold_4 = true;
            		hold_1 = false;
            		hold_2 = false;
                	hold_3 = false;
                	hold_5 = false;
                	if (evt.keyCode == 66){
                		hold_4 = false;
                	}
            		console.log("cont4");
            	}
            	else if (elementos[Objetos[12]].intersectsMesh(elementos[Objetos[10]])){
            		hold_5 = true;
            		hold_2 = false;
                	hold_3 = false;
                	hold_4 = false;
                	hold_1 = false;
                	if (evt.keyCode == 66){
                		hold_5 = false;
                	}
            		console.log("cont5");
            	}




            if (hold_1){
                var vector = new BABYLON.Vector3(0, 1, 0);          
    
                Traslacion(elementos[Objetos[5]],vector);
            }

            if (hold_2){
            	var vector = new BABYLON.Vector3(0,1,0);
            	Traslacion(elementos[Objetos[7]],vector);
            }
            if (hold_3){
            	var vector = new BABYLON.Vector3(0,1,0);
            	Traslacion(elementos[Objetos[8]],vector);
            }
            if (hold_4){
            	var vector = new BABYLON.Vector3(0,1,0);
            	Traslacion(elementos[Objetos[9]],vector);
            }
            	if (hold_5){
            	var vector = new BABYLON.Vector3(0,1,0);
            	Traslacion(elementos[Objetos[10]],vector);
            }

            var vector = new BABYLON.Vector3(0, 1, 0);          
            Traslacion(elementos[Objetos[4]], vector);
            Traslacion(elementos[Objetos[12]], vector); 
        } 

        // CAMARAS
        else if (evt.keyCode == 49){
            scene.activeCamera = camaralibre;
            camaralibre.attachControl(canvas, true);
        }

        else if (evt.keyCode == 50){
            
            camaraB.lockedTarget = elementos[Objetos[1]];
            scene.activeCamera = camaraB;
        }
        else if (evt.keyCode == 51){
            
            camaraG.lockedTarget = elementos[Objetos[0]];
            scene.activeCamera = camaraG;
        }



    };
    

    // Resetear movimiento
    var onKeyUp = function(evt) {
    };

    // Traslacion
    var Traslacion = function(element, vect) {
        // Matriz de traslacion
        var matrix = BABYLON.Matrix.Translation(0, 0, 0);
        element.setPivotMatrix(matrix);
        // Transformar con matriz 
        element.translate(vect, 0.1, BABYLON.Space.LOCAL);
    };   
    var Escalarx = function(element,factor){
        element.scaling.x = element.scaling.x* factor;
    };
    var Escalary = function(element,factor){
        element.scaling.y = element.scaling.y* factor;
    };
    var Escalarz = function(element,factor){
        element.scaling.z = element.scaling.z* factor;
    };

    var Rotacion = function(element, vect) {
        element.pivotLocation = 10, 10, 10;
        // Transformar con matriz
        element.rotate(vect, 0.523599, BABYLON.Space.WORLD);
    };
    // Register events with the right Babylon function
    BABYLON.Tools.RegisterTopRootEvents([{ name: "keydown", handler: onKeyDown }, { name: "keyup", handler: onKeyUp }]);

    // Ciclo del render
    engine.runRenderLoop(function() {
        scene.render();
    });
});
        