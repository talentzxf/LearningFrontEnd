import {Cube} from './cube';

var cubes = [];

var angle = 0;

function initEnvironment(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 40, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer({ antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // controls
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.minDistance = 20;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    var hemiLight2 = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, -500, 0 );
    scene.add( hemiLight2 );

    //var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    //dirLight.color.setHSL( 0.1, 1, 0.95 );
    //dirLight.position.set( -1, 1.75, 1 );
    //dirLight.position.multiplyScalar( 50 );
    //scene.add( dirLight );


    var render = function () {
        requestAnimationFrame( render );

        var curCubeArray = cubes['L'];
        curCubeArray.rotateX(angle);
        //for(var cubeIdx in curCubeArray){
        //    var cube = curCubeArray[cubeIdx];
        //    // cube.rotateX(angle);
        //    // cube.rotateAxisAngle(new THREE.Vector3(1,0,0), angle);
        //}

        angle += 0.00001;

        renderer.render(scene, camera);
    };

    //for(var x=-1; x<=1 ;x++){
    //    for(var y=-1; y<=1 ;y++){
    //        for(var z=-1; z<=1 ;z++){
    //            new Cube(x,y,z,1,scene);
    //        }
    //    }
    //}

    cubes['F'] = new THREE.Object3D();
    cubes['R'] = new THREE.Object3D();
    cubes['L'] = new THREE.Object3D();
    cubes['D'] = new THREE.Object3D();
    cubes['U'] = new THREE.Object3D();
    cubes['B'] = new THREE.Object3D();

    for(var x = -1; x <= 1; x++ ){
        for(var y=-1 ; y<=1 ; y++ ){
            for( var z=-1; z<=1 ;z++){
                var newCube = new Cube(x,y,z,scene);
                newCube.colorFace();

                if(x == -1 ){
                    cubes['L'].add(newCube.getGeometry());
                    scene.add(cubes['L']);
                }

            }
        }
    }

    //new Cube(-1,0,0,1,scene);
    //new Cube(1,0,0,1,scene);

    render();
}

export function RubicCube(){
    initEnvironment();
}

RubicCube();