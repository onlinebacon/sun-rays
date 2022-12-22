const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let wall_x = canvas.width - 20;
let wall_color = '#ccc';
let sun_dist = 600;
let sun_rad = 20;
let sun_x = wall_x - sun_dist;
let sun_y = canvas.height/2;
let sun_color = '#fa0';
let top_ray_color = '#0ff';
let middle_ray_color = '#07f';
let bottom_ray_color = '#ff0';
let points_wall_dist = 100;
let points_offset = 0;
let points_dist = 50;
let draw_top_rays = true;
let draw_middle_rays = true;
let draw_bottom_rays = true;

const setSunDist = (value) => {
	sun_dist = value;
	sun_x = wall_x - sun_dist;
};

const drawRayToPoint = (x, y, offset, color) => {
	const dy = y - (sun_y + offset);
	const dx = x - sun_x;
	const slope = dy/dx;
	const gap = wall_x - x;
	if (gap > 0) {
		x += gap;
		y += gap*slope;
	}
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(sun_x, sun_y + offset);
	ctx.lineTo(x, y);
	ctx.stroke();
};

const drawTopRayToPoint = (x, y) => drawRayToPoint(x, y, -sun_rad, top_ray_color);
const drawMiddleRayToPoint = (x, y) => drawRayToPoint(x, y, 0, middle_ray_color);
const drawBottomRayToPoint = (x, y) => drawRayToPoint(x, y, +sun_rad, bottom_ray_color);

const clear = () => {
	ctx.fillStyle = '#222';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawSun = () => {
	ctx.strokeStyle = sun_color;
	ctx.beginPath();
	ctx.arc(sun_x, sun_y, sun_rad, 0, Math.PI*2);
	ctx.stroke();
};

const drawWall = () => {
	ctx.strokeStyle = wall_color;
	ctx.beginPath();
	ctx.moveTo(wall_x, 0);
	ctx.lineTo(wall_x, canvas.height);
	ctx.stroke();
};

const getTopPoint = () => {
	let cx = wall_x - points_wall_dist;
	let cy = canvas.height*0.5;
	return [ cx, cy - points_dist*0.5 ];
};

const getBottomPoint = () => {
	let cx = wall_x - points_wall_dist;
	let cy = canvas.height*0.5;
	return [ cx, cy + points_dist*0.5 ];
};

const drawRays = () => {
	[ getTopPoint(), getBottomPoint() ].forEach(point => {
		const [ x, y ] = point;
		if (draw_top_rays) drawTopRayToPoint(x, y);
		if (draw_middle_rays) drawMiddleRayToPoint(x, y);
		if (draw_bottom_rays) drawBottomRayToPoint(x, y);
	});
};

const drawPoint = (x, y) => {
	ctx.fillStyle = '#fff';
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, Math.PI*2);
	ctx.fill();
};

const drawPoints = () => {
	drawPoint(...getTopPoint());
	drawPoint(...getBottomPoint());
};

const update = () => {
	clear();
	drawWall();
	drawSun();
	drawRays();
	drawPoints();
};

const addLinearRange = ({ label, start, min, max, update }) => {
	const input = document.createElement('input');
	const range = document.createElement('input');
	const title = document.createElement('div');
	title.style.display = 'inline-block';
	title.style.width = '210px';
	title.style.marginTop = '10px';
	title.innerText = label;
	input.setAttribute('type', 'text');
	range.setAttribute('type', 'range');
	range.setAttribute('min', min);
	range.setAttribute('max', max);
	range.style.marginLeft = '10px';
	range.style.width = '400px';
	input.value = start;
	range.value = start;
	input.addEventListener('input', () => {
		const value = Number(input.value);
		if (isNaN(value)) return;
		range.value = value;
		update(value);
	});
	range.addEventListener('input', () => {
		const value = Number(range.value);
		input.value = value;
		update(value);
	});
	document.body.appendChild(title);
	document.body.appendChild(input);
	document.body.appendChild(range);
	document.body.appendChild(document.createElement('br'));
};

const addToggle = ({ label, start, update }) => {
	const input = document.createElement('input');
	const title = document.createElement('div');
	title.style.display = 'inline-block';
	title.style.width = '210px';
	title.style.marginTop = '10px';
	title.innerText = label;
	input.setAttribute('type', 'checkbox');
	input.checked = start;
	input.addEventListener('input', () => {
		const value = input.checked;
		update(value);
	});
	document.body.appendChild(title);
	document.body.appendChild(input);
	document.body.appendChild(document.createElement('br'));
};

addLinearRange({
	label: 'Sun distance',
	start: sun_dist,
	min: 150,
	max: 20000,
	update: (value) => {
		setSunDist(value);
		update();
	},
});

addLinearRange({
	label: 'Sun radius',
	start: sun_rad,
	min: 10,
	max: 2000,
	update: (value) => {
		sun_rad = value;
		update();
	},
});

addLinearRange({
	label: 'Distance between points',
	start: points_dist,
	min: 0,
	max: canvas.height,
	update: (value) => {
		points_dist = value;
		update();
	},
});

addLinearRange({
	label: 'Points distance to the wall',
	start: points_wall_dist,
	min: 0,
	max: 500,
	update: (value) => {
		points_wall_dist = value;
		update();
	},
});

addToggle({
	label: 'Draw top rays',
	start: draw_top_rays,
	update: (value) => {
		draw_top_rays = value;
		update();
	},
});

addToggle({
	label: 'Draw middle rays',
	start: draw_middle_rays,
	update: (value) => {
		draw_middle_rays = value;
		update();
	},
});

addToggle({
	label: 'Draw bottom rays',
	start: draw_bottom_rays,
	update: (value) => {
		draw_bottom_rays = value;
		update();
	},
});

update();
