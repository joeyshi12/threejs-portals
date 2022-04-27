uniform mat4 camProjMatrix;
uniform mat4 camViewMatrix;

out vec3 vcsPosition;
out vec4 portalSpaceCoords;

void main() {
    portalSpaceCoords = camProjMatrix * camViewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}