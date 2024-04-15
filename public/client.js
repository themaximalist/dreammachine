const message = document.getElementById('message');
const text = document.getElementById('text');

async function handleSend() {

    const value = message.value;
    message.value = '';

    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ value }),
    });

    if (!response) throw new Error('No response');
    if (!response.ok) throw new Error('Response not ok');

    // console.log(response);

    for await (const event of readChunks(response.body.getReader())) {
        switch (event.msg) {
            case "error":
                console.error(event.error);
                break;
            case "chunk":
                console.log(event.chunk);
                text.innerText += event.chunk;
                break;
            case "code":
                console.log(event.code);
                text.style.visibility = 'hidden';
                eval(event.code); // lol
                break;
            default:
                console.log(event);
        }
    }

    /*
    if (!response.json) throw new Error('No json');

    const data = await response.json();
    if (!data) throw new Error('No data');
    if (data.status !== "ok") throw new Error('Data not ok');
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error('No data.data');

    const javascript = data.data.response;

    eval(javascript); // lol
    text.innerText = JSON.stringify(javascript, null, 4);
    */
}

message.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleSend();
    }
});


function readChunks(reader) {
    const decoder = new TextDecoder("utf-8");
    return {
        async *[Symbol.asyncIterator]() {
            let readResult = await reader.read();
            while (!readResult.done) {
                const value = decoder.decode(readResult.value);
                const lines = value.trim().split(/\n+/);
                for (const line of lines) {
                    const json = JSON.parse(line.split("data: ")[1]);
                    yield json;
                }
                readResult = await reader.read();
            }
        },
    };
}
