import {Cube} from './cube';
import {CubeRotater} from './CubeRotater';
var renderer;
var scene;

var cubeRotater;

function init3DRenderer(scene:THREE.Scene, borderLength:number){
    renderer = new THREE.WebGLRenderer({ antialias: true } );
    var camera = new THREE.PerspectiveCamera( 40, 1.0, 0.1, 1000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( borderLength, borderLength);
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

    renderer.renderScene = function () {
        requestAnimationFrame( renderer.renderScene );


        if(cubeRotater){
            cubeRotater.update();
        }


        renderer.render(scene, camera);
    };

}

function initTopViewRenderer(scene:THREE.Scene, borderLength:number){
    var topViewRenderer = new THREE.WebGLRenderer({antialias: true});
    topViewRenderer.setPixelRatio( window.devicePixelRatio );
    topViewRenderer.setSize( borderLength, borderLength );
    document.body.appendChild(topViewRenderer.domElement);

}

function initEnvironment(){
    scene = new THREE.Scene();
    cubeRotater = new CubeRotater(scene);

    var borderLength = Math.min(window.innerWidth/2 - 20, window.innerHeight);

    console.log("Border length is:" + borderLength);

    init3DRenderer(scene, borderLength);
    // initTopViewRenderer(scene, borderLength);

    //new Cube(-1,0,0,1,scene);
    //new Cube(1,0,0,1,scene);

    renderer.renderScene();

}


export function RubicCube(){
    initEnvironment();
    initCommands();
}

function initCommands(){

    if(!window.input_command){
        window.input_command = function(commandSeries:string){
            cubeRotater.apply_command(commandSeries);
        }
    }

    if(!window.buffer_commands){
        window.buffer_commands = function(commandSeries:string){
            cubeRotater.buffer_commands(commandSeries);
        }
    }

    if(!window.show_face){
        window.show_face = function(face:string, isVisible:boolean){
            cubeRotater.show_face(face, isVisible)
        }
    }

    if(!window.toggle_random){
        window.toggle_random = function(){
            cubeRotater.toggle_random();
        }
    }

}

RubicCube();