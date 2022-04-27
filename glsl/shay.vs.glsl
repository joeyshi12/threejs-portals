uniform vec3 worldPos;
uniform float rot;

out vec3 vcsPosition;
out vec3 vcsNormal;
out vec2 texCoord;

out vec3 interpolatedPos;

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main() {
    interpolatedPos = vec3(rotationMatrix(vec3(0.0, 1.0, 0.0), rot) * vec4(position, 1.0) - vec4(worldPos, 0.0));

	vcsNormal = normalMatrix * normal;
	vcsPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    texCoord.x = uv.x ;
    texCoord.y = 1.0 - uv.y ;

    gl_Position = projectionMatrix * modelViewMatrix * (rotationMatrix(vec3(0.0, 1.0, 0.0), rot) * vec4(position, 1.0) - vec4(worldPos, 0.0));
 }