uniform sampler2D textureMap;

in vec4 portalSpaceCoords;

void main() {
    vec3 projCoords = (portalSpaceCoords.xyz / portalSpaceCoords.w)* 0.5 + 0.5;
    vec4 texColor = texture(textureMap, projCoords.xy);
    gl_FragColor = texColor;
}