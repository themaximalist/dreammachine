import LLM from "@themaximalist/llm.js"

export function index(req, res) {
    res.render("index");
}

export async function chat(req, res) {
    const value = req.body.value;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');

    res.push = (message) => { res.write("data: " + JSON.stringify(message) + "\n\n") }

    if (!value) return res.push({ msg: "error", error: "No value provided" });

    const prompt = `
You are Dream Machine.
You take a prompt and turn it into a scene using ThreeJS.
The user has requested the following: ${value}

Please create this scene using pure JavaScript.
ThreeJS is already imported and setup as the variable 'THREE'.
You can use any ThreeJS features you like.
But you do not have access to any other libraries or APIs.
Also you do not have access to any other assets, textures, fonts, or models.
Please return the code in a '\`\`\`javascript' Markdown code block
You don't need to explain anything, just provide the code.
You are brilliant, you are imaginative, you are weird.
You are full of suprises and you help people see the world in a new way.
You are Dream Machine.`

    function stream_handler(chunk) {
        res.push({ msg: "chunk", chunk });
    }

    const response = await LLM(prompt, {
        // model: "gpt-4-turbo-preview",
        model: "gpt-4-turbo",
        // model: "claude-3-sonnet-20240229",
        // model: "claude-3-haiku-20240307",
        // model: "gemini-1.5-pro-latest",
        stream_handler,
        stream: true,
        parser: LLM.parsers.codeBlock("javascript")
    });

    console.log("RESPONSE", response);

    res.push({ msg: "code", code: response })
}