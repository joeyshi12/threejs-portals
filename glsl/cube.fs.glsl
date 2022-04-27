in vec3 vcsNormal;
in vec3 vcsPosition;
in vec2 texCoord;
in vec4 lightSpaceCoords;
in vec3 interpolatedPos;

uniform vec3 lightColor;
uniform vec3 ambientColor;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

uniform vec3 cameraPos;
uniform vec3 lightPosition;
uniform vec3 lightDirection;

// Textures are passed in as uniforms
uniform sampler2D colorMap;
uniform sampler2D moMap;
uniform sampler2D shadowMap;
uniform float textureSize;

float BIAS = 0.01;

float calculateShadow() {
	// HINT: define a "stepAmount", so texels you sample from the texture are some "stepAmount" number of texels apart 
	float stepAmount = 1.0 / textureSize;

	// HINT: the number of texels you sample from the texture
	float sampleSize = 0.0;

	// HINT: the number of samples determind to be in shadow
	float count = 0.0;

	vec3 projCoords = (lightSpaceCoords.xyz / lightSpaceCoords.w) * 0.5 + 0.5;
	float closestDepth;
	float currentDepth = projCoords.z;
	for (int x = -1; x <= 1; x++) {
		for (int y = -1; y <= 1; y++) {
			closestDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * stepAmount).r;
			count += currentDepth - BIAS > closestDepth ? 1.0 : 0.0;
			sampleSize++;
		}
	}
	return count / sampleSize;
}

void main() {
	//PRE-CALCS
	vec3 N = normalize(vcsNormal);
	vec3 L = normalize(vec3(viewMatrix * vec4(lightDirection, 0.0)));
	vec3 V = normalize(-vcsPosition);
	vec3 H = normalize(V + L);

	//AMBIENT
	vec3 light_AMB = ambientColor * kAmbient;

	//DIFFUSE
	vec3 diffuse = kDiffuse * lightColor;
	vec3 light_DFF = diffuse * max(0.0, dot(N, L));

	//SPECULAR
	vec3 specular = kSpecular * lightColor;
	vec3 light_SPC = specular * pow(max(0.0, dot(H, N)), shininess);

	//TOTAL
	light_DFF *= texture(colorMap, texCoord).xyz + texture(moMap, texCoord).xyz; //TODO Q2 sample the color from the color txture here
	vec3 TOTAL = light_AMB + light_DFF * (1.0 - calculateShadow()) + light_SPC;

	gl_FragColor = vec4(TOTAL, 1.0);
}