import { init_server } from "./app/app";

async function init() {
    const app = await init_server();
    
    app.listen(8000, () => {
        console.log("🚀 Server is live at localhost:8000");
    });
}

init();