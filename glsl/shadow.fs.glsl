in vec3 interpolatedPos;

void main() {
	if (interpolatedPos.x < -180.0 || interpolatedPos.z < -100.0) {
		discard;
	}
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}