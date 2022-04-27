uniform mat4 lightProjMatrix;
uniform mat4 lightViewMatrix;
uniform vec3 worldPos;
uniform float rot;

out vec3 vcsPosition;
out vec3 vcsNormal;
out vec2 texCoord;
out vec4 lightSpaceCoords;

out vec3 interpolatedPos;

void main() {
	vcsNormal = normalMatrix * normal;
	vcsPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    texCoord.x = uv.x ;
    texCoord.y = 1.0 - uv.y ;
    lightSpaceCoords = lightProjMatrix * lightViewMatrix * modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }