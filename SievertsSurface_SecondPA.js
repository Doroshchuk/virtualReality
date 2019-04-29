class Surface {
    constructor(quality = 50, animationStep = {x: 0.001, y: 0.001, z: 0.005}) {
        this.quality = quality;
        this.animationStep = animationStep;
    }

    init(drawingSurfaceFun, startZ = 1, matrix) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 1000);
        this.camera.position.z = startZ;
        this.scene.add(this.camera);
        const geometrySurface = new THREE.ParametricBufferGeometry( drawingSurfaceFun, this.quality, this.quality );

        var materialSurface	= new THREE.MeshNormalMaterial();

        this.meshSurface = new THREE.Mesh(geometrySurface, materialSurface);
        // this.meshSurface.position.x = 0;
        // this.meshSurface.position.y = -50;
        // this.meshSurface.position.z = -300;

        // this.meshSurface.rotation.x = 1.05;
        // this.meshSurface.rotation.y = 1.05;
        // this.meshSurface.rotation.z = 5.21;
        console.log(matrix.elements);
        document.getElementById('matrix').innerText = matrix.elements;
        this.meshSurface.applyMatrix(matrix);

        this.scene.add(this.meshSurface);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('myCanvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

function getRotationMatrix( alpha, beta, gamma ) {
	
	var degtorad = Math.PI / 180;
    var _x = beta  ? beta  * degtorad : 0; // beta value
    var _y = gamma ? gamma * degtorad : 0; // gamma value
    var _z = alpha ? alpha * degtorad : 0; // alpha value

    var cX = Math.cos( _x );
    var cY = Math.cos( _y );
    var cZ = Math.cos( _z );
    var sX = Math.sin( _x );
    var sY = Math.sin( _y );
    var sZ = Math.sin( _z );

    //
    // ZXY rotation matrix construction.
    //

    var m11 = cZ * cY - sZ * sX * sY;
    var m12 = - cX * sZ;
    var m13 = cY * sZ * sX + cZ * sY;

    var m21 = cY * sZ + cZ * sX * sY;
    var m22 = cZ * cX;
    var m23 = sZ * sY - cZ * cY * sX;

    var m31 = - cX * sY;
    var m32 = sX;
    var m33 = cX * cY;

    var matrix4D = new THREE.Matrix4();
    matrix4D.set(
        m11,    m12,    m13,    0,
        m21,    m22,    m23,    0,
        m31,    m32,    m33,    0,
        0,      0,      0,      1,
    );

    // return [
    //     m11,    m12,    m13,
    //     m21,    m22,    m23,
    //     m31,    m32,    m33,
    // ];
    return matrix4D;

};

function sievertsDrawing(u, v) {
    var c = 5;
    u = u * Math.PI / 2;
    v = v * Math.PI * 0.95;
    var phi = -(u / Math.sqrt(c + 1)) + Math.atan(Math.sqrt(c + 1) * Math.tan(u));
    var a_ = 2 / (c + 1 - c * Math.pow(Math.sin(v), 2) * Math.pow(Math.cos(u), 2));
    var r = a_ / Math.sqrt(c) * Math.sqrt((c + 1) * (1 + c * Math.pow(Math.sin(u), 2))) * Math.sin(v);

    var x = r * Math.cos(phi);
    var y = r * Math.sin(phi);
    var z = (Math.log(Math.tan(v / 2)) + a_ * (c + 1) * Math.cos(v)) / Math.sqrt(c);
    const scale = 10;
    return new THREE.Vector3(x * scale, y * scale, z * scale);
}

window.addEventListener("deviceorientation", function(event) {
    // process event.alpha, event.beta and event.gamma
    const m = getRotationMatrix(event.alpha, event.beta, event.gamma);
    console.log(m);
    const sievertsSurface = new Surface();
    sievertsSurface.init(sievertsDrawing, 1, m);
    sievertsSurface.render();
}, true);

