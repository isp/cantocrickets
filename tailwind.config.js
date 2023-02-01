module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		/*extend: {
			fontFamily: {
				'comic': ["Comic Sans MS"]
			}
		},*/
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["black"],
	},
}
