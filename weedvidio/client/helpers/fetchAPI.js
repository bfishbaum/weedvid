const defaultParamsPost = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
        "Content-Type": "application/json",
		// "Access-Control-Allow-Origin": "http://localhost:3000"
    },
    body: JSON.stringify({}),
	"credentials": "include"
}

const defaultParamsGet = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
		"Content-Type": "application/json",
		// "Access-Control-Allow-Origin": "http://localhost:3000"
    },
	"credentials": "include"
}


export function fetchJSONPost(url, params) {
    const updatedParams = Object.assign({}, defaultParamsPost, params, {body: JSON.stringify(params)});
    return fetch(url, updatedParams)
    .then(response => response.json()) // parses response to JSON
    .catch(err => console.log(err)) // catches error (usually non-JSON responses)
}

export function fetchJSONGet(url, params) {
    const updatedParams = Object.assign({}, defaultParamsGet, params);
    return fetch(url, updatedParams)
    .then(response => response.json()) // parses response to JSON
    .catch(err => console.log(err)) // catches error (usually non-JSON responses)
}

export function fetchImage(url, params){
    const updatedParams = Object.assign({}, defaultParamsGet, params);
    return fetch(url, updatedParams)
    .then(response => response.blob()) // parses response to Image 
}